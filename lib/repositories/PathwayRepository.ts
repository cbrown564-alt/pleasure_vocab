// Pathway Repository
// Handles pathway progress operations with normalized junction table

import { PathwayProgress } from '@/types';
import { logger } from '../logger';
import { Collections, StorageAdapter } from '../storage';
import {
  PathwayProgressRowSchema,
  validateArray,
  ValidatedPathwayProgressRow,
} from '../validation';

const log = logger.scope('PathwayRepository');

// Storage key for web junction data
const WEB_COMPLETIONS_KEY = '@vocab:pathway_completions';

// Junction table row type
interface PathwayCompletionRow {
  pathway_id: string;
  concept_id: string;
  completed_at: string;
}

/**
 * Repository for pathway progress operations.
 * Uses normalized junction table for concept completions.
 */
export class PathwayRepository {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Check if we're on native platform (has raw SQL support).
   */
  private isNative(): boolean {
    return typeof this.adapter.rawQuery === 'function';
  }

  /**
   * Get pathway progress by pathway ID.
   */
  async get(pathwayId: string): Promise<ValidatedPathwayProgressRow | null> {
    try {
      const raw = await this.adapter.getOne<unknown>(
        Collections.PATHWAY_PROGRESS,
        pathwayId
      );
      if (!raw) return null;

      const result = PathwayProgressRowSchema.safeParse(raw);
      if (!result.success) {
        log.warn('Invalid pathway progress data', {
          pathwayId,
          issues: result.error.issues,
        });
        return null;
      }
      return result.data;
    } catch (error) {
      log.error('Failed to get pathway progress', error, { pathwayId });
      return null;
    }
  }

  /**
   * Get all pathway progress records.
   */
  async getAll(): Promise<ValidatedPathwayProgressRow[]> {
    try {
      const raw = await this.adapter.getAll<unknown>(Collections.PATHWAY_PROGRESS);
      return validateArray(
        PathwayProgressRowSchema,
        raw,
        'PathwayRepository.getAll'
      );
    } catch (error) {
      log.error('Failed to get all pathway progress', error);
      return [];
    }
  }

  /**
   * Start tracking a pathway.
   */
  async start(pathwayId: string): Promise<void> {
    try {
      const existing = await this.get(pathwayId);
      if (existing) {
        // Already started
        return;
      }

      const now = new Date().toISOString();
      await this.adapter.upsert(Collections.PATHWAY_PROGRESS, pathwayId, {
        pathway_id: pathwayId,
        started_at: now,
        completed_at: null,
      });
    } catch (error) {
      log.error('Failed to start pathway', error, { pathwayId });
      throw error;
    }
  }

  /**
   * Update pathway progress with a completed concept.
   * Uses normalized junction table for storage.
   */
  async updateProgress(
    pathwayId: string,
    conceptId: string,
    totalConceptsInPathway: number
  ): Promise<void> {
    try {
      const now = new Date().toISOString();

      // Ensure pathway exists
      let progress = await this.get(pathwayId);
      if (!progress) {
        await this.start(pathwayId);
        progress = await this.get(pathwayId);
      }

      // Check if concept already completed
      const completedConcepts = await this.getCompletedConcepts(pathwayId);
      if (completedConcepts.includes(conceptId)) {
        return; // Already completed
      }

      // Add to junction table
      await this.addCompletion(pathwayId, conceptId, now);

      // Check if pathway is now complete
      const newCount = completedConcepts.length + 1;
      const isComplete = newCount >= totalConceptsInPathway;

      if (isComplete) {
        await this.adapter.update(Collections.PATHWAY_PROGRESS, pathwayId, {
          completed_at: now,
        });
      }
    } catch (error) {
      log.error('Failed to update pathway progress', error, {
        pathwayId,
        conceptId,
      });
      throw error;
    }
  }

  /**
   * Add a completion record to the junction table.
   */
  private async addCompletion(
    pathwayId: string,
    conceptId: string,
    completedAt: string
  ): Promise<void> {
    if (this.isNative()) {
      // Native: Use raw SQL
      await this.adapter.rawExecute!(
        `INSERT OR IGNORE INTO ${Collections.PATHWAY_COMPLETIONS}
         (pathway_id, concept_id, completed_at) VALUES (?, ?, ?)`,
        [pathwayId, conceptId, completedAt]
      );
    } else {
      // Web: Use value storage
      const completions = await this.getWebCompletions();
      if (!completions[pathwayId]) {
        completions[pathwayId] = [];
      }

      // Check if already exists
      const exists = completions[pathwayId].some(
        (c) => c.concept_id === conceptId
      );
      if (!exists) {
        completions[pathwayId].push({
          pathway_id: pathwayId,
          concept_id: conceptId,
          completed_at: completedAt,
        });
        await this.saveWebCompletions(completions);
      }
    }
  }

  /**
   * Get completed concept IDs for a pathway.
   * Uses normalized junction table.
   */
  async getCompletedConcepts(pathwayId: string): Promise<string[]> {
    try {
      if (this.isNative()) {
        // Native: Query junction table
        const rows = await this.adapter.rawQuery!<PathwayCompletionRow>(
          `SELECT concept_id FROM ${Collections.PATHWAY_COMPLETIONS}
           WHERE pathway_id = ? ORDER BY completed_at`,
          [pathwayId]
        );
        return rows.map((r) => r.concept_id);
      } else {
        // Web: Use value storage
        const completions = await this.getWebCompletions();
        const pathwayCompletions = completions[pathwayId] || [];
        return pathwayCompletions.map((c) => c.concept_id);
      }
    } catch (error) {
      log.error('Failed to get completed concepts', error, { pathwayId });
      return [];
    }
  }

  /**
   * Get completion count for a pathway.
   */
  async getCompletionCount(pathwayId: string): Promise<number> {
    try {
      if (this.isNative()) {
        const rows = await this.adapter.rawQuery!<{ count: number }>(
          `SELECT COUNT(*) as count FROM ${Collections.PATHWAY_COMPLETIONS}
           WHERE pathway_id = ?`,
          [pathwayId]
        );
        return rows[0]?.count ?? 0;
      } else {
        const completions = await this.getWebCompletions();
        return completions[pathwayId]?.length ?? 0;
      }
    } catch (error) {
      log.error('Failed to get completion count', error, { pathwayId });
      return 0;
    }
  }

  /**
   * Check if a pathway is completed.
   */
  async isCompleted(pathwayId: string): Promise<boolean> {
    const progress = await this.get(pathwayId);
    // Return false if pathway doesn't exist, true only if completed_at is set
    return progress?.completed_at != null;
  }

  /**
   * Check if a specific concept is completed in a pathway.
   */
  async isConceptCompleted(pathwayId: string, conceptId: string): Promise<boolean> {
    try {
      if (this.isNative()) {
        const rows = await this.adapter.rawQuery!<{ count: number }>(
          `SELECT COUNT(*) as count FROM ${Collections.PATHWAY_COMPLETIONS}
           WHERE pathway_id = ? AND concept_id = ?`,
          [pathwayId, conceptId]
        );
        return (rows[0]?.count ?? 0) > 0;
      } else {
        const completions = await this.getWebCompletions();
        const pathwayCompletions = completions[pathwayId] || [];
        return pathwayCompletions.some((c) => c.concept_id === conceptId);
      }
    } catch (error) {
      log.error('Failed to check concept completion', error, { pathwayId, conceptId });
      return false;
    }
  }

  /**
   * Delete pathway progress including junction table entries.
   */
  async delete(pathwayId: string): Promise<void> {
    try {
      // Delete from junction table
      if (this.isNative()) {
        await this.adapter.rawExecute!(
          `DELETE FROM ${Collections.PATHWAY_COMPLETIONS} WHERE pathway_id = ?`,
          [pathwayId]
        );
      } else {
        const completions = await this.getWebCompletions();
        delete completions[pathwayId];
        await this.saveWebCompletions(completions);
      }

      // Delete from main table
      await this.adapter.delete(Collections.PATHWAY_PROGRESS, pathwayId);
    } catch (error) {
      log.error('Failed to delete pathway progress', error, { pathwayId });
      throw error;
    }
  }

  /**
   * Delete all pathway progress including junction table.
   */
  async deleteAll(): Promise<void> {
    try {
      // Clear junction table
      if (this.isNative()) {
        await this.adapter.rawExecute!(
          `DELETE FROM ${Collections.PATHWAY_COMPLETIONS}`
        );
      } else {
        await this.saveWebCompletions({});
      }

      // Clear main table
      await this.adapter.deleteAll(Collections.PATHWAY_PROGRESS);
    } catch (error) {
      log.error('Failed to delete all pathway progress', error);
      throw error;
    }
  }

  /**
   * Convert a row to a domain object.
   * @deprecated Use getDomain() instead - this method returns empty conceptsCompleted
   * since the legacy column was removed in migration v4.
   */
  toDomain(row: ValidatedPathwayProgressRow): PathwayProgress {
    return {
      pathwayId: row.pathway_id,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      conceptsCompleted: [], // Legacy column removed - use getDomain() for completions
    };
  }

  /**
   * Get pathway progress as a domain object with live completion data.
   */
  async getDomain(pathwayId: string): Promise<PathwayProgress | null> {
    const row = await this.get(pathwayId);
    if (!row) return null;

    // Get completions from junction table (normalized)
    const completedConcepts = await this.getCompletedConcepts(pathwayId);

    return {
      pathwayId: row.pathway_id,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      conceptsCompleted: completedConcepts,
    };
  }

  // ============ Web Storage Helpers ============

  private async getWebCompletions(): Promise<
    Record<string, PathwayCompletionRow[]>
  > {
    try {
      const data = await this.adapter.getValue(WEB_COMPLETIONS_KEY);
      if (!data) return {};
      return JSON.parse(data);
    } catch (error) {
      log.error('Failed to get web completions', error);
      return {};
    }
  }

  private async saveWebCompletions(
    completions: Record<string, PathwayCompletionRow[]>
  ): Promise<void> {
    await this.adapter.setValue(WEB_COMPLETIONS_KEY, JSON.stringify(completions));
  }
}
