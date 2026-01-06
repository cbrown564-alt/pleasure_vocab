// Concept Repository
// Handles all user concept operations with validation

import { ConceptStatus } from '@/types';
import { logger } from '../logger';
import { Collections, StorageAdapter } from '../storage';
import { generateId } from '../utils/id';
import {
  DEFAULT_USER_CONCEPT,
  UserConceptRowSchema,
  validateArray,
  validateWithFallback,
  ValidatedUserConceptRow,
} from '../validation';

const log = logger.scope('ConceptRepository');

/**
 * Repository for user concept operations.
 * Abstracts storage details and provides validated data access.
 */
export class ConceptRepository {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Get a user's concept record by concept ID.
   */
  async get(conceptId: string): Promise<ValidatedUserConceptRow | null> {
    try {
      const raw = await this.adapter.getOne<unknown>(
        Collections.USER_CONCEPTS,
        conceptId
      );
      if (!raw) return null;

      const result = UserConceptRowSchema.safeParse(raw);
      if (!result.success) {
        log.warn('Invalid concept data', { conceptId, issues: result.error.issues });
        return null;
      }
      return result.data;
    } catch (error) {
      log.error('Failed to get concept', error, { conceptId });
      return null;
    }
  }

  /**
   * Get all user concepts, ordered by updated_at descending.
   */
  async getAll(): Promise<ValidatedUserConceptRow[]> {
    try {
      const raw = await this.adapter.getAll<unknown>(Collections.USER_CONCEPTS);
      return validateArray(UserConceptRowSchema, raw, 'ConceptRepository.getAll');
    } catch (error) {
      log.error('Failed to get all concepts', error);
      return [];
    }
  }

  /**
   * Get concepts matching a status.
   */
  async getByStatus(status: ConceptStatus): Promise<ValidatedUserConceptRow[]> {
    try {
      const raw = await this.adapter.getWhere<unknown>(Collections.USER_CONCEPTS, {
        status,
      });
      return validateArray(UserConceptRowSchema, raw, 'ConceptRepository.getByStatus');
    } catch (error) {
      log.error('Failed to get concepts by status', error, { status });
      return [];
    }
  }

  /**
   * Update a concept's status.
   */
  async updateStatus(conceptId: string, status: ConceptStatus): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existing = await this.get(conceptId);

      if (existing) {
        await this.adapter.update(Collections.USER_CONCEPTS, conceptId, {
          status,
          updated_at: now,
          explored_at: existing.explored_at ?? now,
        });
      } else {
        await this.adapter.upsert(Collections.USER_CONCEPTS, conceptId, {
          concept_id: conceptId,
          status,
          is_unlocked: 0,
          is_mastered: 0,
          explored_at: now,
          updated_at: now,
        });
      }
    } catch (error) {
      log.error('Failed to update concept status', error, { conceptId, status });
      throw error;
    }
  }

  /**
   * Mark a concept as explored (if not already explored).
   */
  async markExplored(conceptId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existing = await this.get(conceptId);

      if (existing) {
        if (existing.status === 'unexplored') {
          await this.adapter.update(Collections.USER_CONCEPTS, conceptId, {
            status: 'explored',
            explored_at: existing.explored_at ?? now,
            updated_at: now,
          });
        }
      } else {
        await this.adapter.upsert(Collections.USER_CONCEPTS, conceptId, {
          concept_id: conceptId,
          status: 'explored',
          is_unlocked: 0,
          is_mastered: 0,
          explored_at: now,
          updated_at: now,
        });
      }
    } catch (error) {
      log.error('Failed to mark concept explored', error, { conceptId });
      throw error;
    }
  }

  /**
   * Unlock a concept for the user.
   */
  async unlock(conceptId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existing = await this.get(conceptId);

      if (existing) {
        await this.adapter.update(Collections.USER_CONCEPTS, conceptId, {
          is_unlocked: 1,
          updated_at: now,
        });
      } else {
        await this.adapter.upsert(Collections.USER_CONCEPTS, conceptId, {
          concept_id: conceptId,
          status: 'unexplored',
          is_unlocked: 1,
          is_mastered: 0,
          explored_at: null,
          updated_at: now,
        });
      }
    } catch (error) {
      log.error('Failed to unlock concept', error, { conceptId });
      throw error;
    }
  }

  /**
   * Mark a concept as mastered.
   */
  async master(conceptId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existing = await this.get(conceptId);

      if (existing) {
        await this.adapter.update(Collections.USER_CONCEPTS, conceptId, {
          is_unlocked: 1, // Mastering also unlocks
          is_mastered: 1,
          updated_at: now,
        });
      } else {
        await this.adapter.upsert(Collections.USER_CONCEPTS, conceptId, {
          concept_id: conceptId,
          status: 'unexplored',
          is_unlocked: 1,
          is_mastered: 1,
          explored_at: null,
          updated_at: now,
        });
      }
    } catch (error) {
      log.error('Failed to master concept', error, { conceptId });
      throw error;
    }
  }

  /**
   * Check if a concept is unlocked.
   */
  async isUnlocked(conceptId: string): Promise<boolean> {
    const concept = await this.get(conceptId);
    return concept?.is_unlocked === 1;
  }

  /**
   * Check if a concept is mastered.
   */
  async isMastered(conceptId: string): Promise<boolean> {
    const concept = await this.get(conceptId);
    return concept?.is_mastered === 1;
  }

  /**
   * Get all unlocked concept IDs.
   */
  async getUnlockedIds(): Promise<string[]> {
    try {
      const raw = await this.adapter.getWhere<ValidatedUserConceptRow>(
        Collections.USER_CONCEPTS,
        { is_unlocked: 1 }
      );
      return raw.map((c) => c.concept_id);
    } catch (error) {
      log.error('Failed to get unlocked concept IDs', error);
      return [];
    }
  }

  /**
   * Get all mastered concept IDs.
   */
  async getMasteredIds(): Promise<string[]> {
    try {
      const raw = await this.adapter.getWhere<ValidatedUserConceptRow>(
        Collections.USER_CONCEPTS,
        { is_mastered: 1 }
      );
      return raw.map((c) => c.concept_id);
    } catch (error) {
      log.error('Failed to get mastered concept IDs', error);
      return [];
    }
  }

  /**
   * Get count of explored concepts (status != 'unexplored').
   */
  async getExploredCount(): Promise<number> {
    try {
      const all = await this.getAll();
      return all.filter((c) => c.status !== 'unexplored').length;
    } catch (error) {
      log.error('Failed to get explored count', error);
      return 0;
    }
  }

  /**
   * Get count of concepts that resonate.
   */
  async getResonatesCount(): Promise<number> {
    try {
      return this.adapter.count(Collections.USER_CONCEPTS, { status: 'resonates' });
    } catch (error) {
      log.error('Failed to get resonates count', error);
      return 0;
    }
  }

  /**
   * Delete all user concepts.
   */
  async deleteAll(): Promise<void> {
    try {
      await this.adapter.deleteAll(Collections.USER_CONCEPTS);
    } catch (error) {
      log.error('Failed to delete all concepts', error);
      throw error;
    }
  }
}
