// Pathway Repository
// Handles pathway progress operations with validation

import { PathwayProgress } from '@/types';
import { logger } from '../logger';
import { Collections, StorageAdapter } from '../storage';
import {
  PathwayProgressRowSchema,
  validateArray,
  ValidatedPathwayProgressRow,
} from '../validation';

const log = logger.scope('PathwayRepository');

/**
 * Repository for pathway progress operations.
 */
export class PathwayRepository {
  constructor(private adapter: StorageAdapter) {}

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
        concepts_completed: '[]',
      });
    } catch (error) {
      log.error('Failed to start pathway', error, { pathwayId });
      throw error;
    }
  }

  /**
   * Update pathway progress with a completed concept.
   */
  async updateProgress(
    pathwayId: string,
    conceptId: string,
    totalConceptsInPathway: number
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      let progress = await this.get(pathwayId);

      if (!progress) {
        await this.start(pathwayId);
        progress = await this.get(pathwayId);
      }

      if (progress) {
        const completedConcepts: string[] = JSON.parse(
          progress.concepts_completed || '[]'
        );

        if (!completedConcepts.includes(conceptId)) {
          completedConcepts.push(conceptId);

          const isComplete = completedConcepts.length >= totalConceptsInPathway;

          await this.adapter.update(Collections.PATHWAY_PROGRESS, pathwayId, {
            concepts_completed: JSON.stringify(completedConcepts),
            completed_at: isComplete ? now : null,
          });
        }
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
   * Get completed concept IDs for a pathway.
   */
  async getCompletedConcepts(pathwayId: string): Promise<string[]> {
    const progress = await this.get(pathwayId);
    if (!progress) return [];

    try {
      return JSON.parse(progress.concepts_completed || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Check if a pathway is completed.
   */
  async isCompleted(pathwayId: string): Promise<boolean> {
    const progress = await this.get(pathwayId);
    return progress?.completed_at !== null;
  }

  /**
   * Delete pathway progress.
   */
  async delete(pathwayId: string): Promise<void> {
    try {
      await this.adapter.delete(Collections.PATHWAY_PROGRESS, pathwayId);
    } catch (error) {
      log.error('Failed to delete pathway progress', error, { pathwayId });
      throw error;
    }
  }

  /**
   * Delete all pathway progress.
   */
  async deleteAll(): Promise<void> {
    try {
      await this.adapter.deleteAll(Collections.PATHWAY_PROGRESS);
    } catch (error) {
      log.error('Failed to delete all pathway progress', error);
      throw error;
    }
  }

  /**
   * Convert a row to a domain object.
   */
  toDomain(row: ValidatedPathwayProgressRow): PathwayProgress {
    return {
      pathwayId: row.pathway_id,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      conceptsCompleted: JSON.parse(row.concepts_completed || '[]'),
    };
  }

  /**
   * Get pathway progress as a domain object.
   */
  async getDomain(pathwayId: string): Promise<PathwayProgress | null> {
    const row = await this.get(pathwayId);
    if (!row) return null;
    return this.toDomain(row);
  }
}
