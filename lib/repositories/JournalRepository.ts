// Journal Repository
// Handles journal entry operations with validation

import { JournalEntry } from '@/types';
import { logger } from '../logger';
import { Collections, StorageAdapter } from '../storage';
import { generateId } from '../utils/id';
import {
  JournalEntryRowSchema,
  validateArray,
  ValidatedJournalEntryRow,
} from '../validation';

const log = logger.scope('JournalRepository');

/**
 * Repository for journal entry operations.
 */
export class JournalRepository {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Get a journal entry by ID.
   */
  async get(id: string): Promise<ValidatedJournalEntryRow | null> {
    try {
      const raw = await this.adapter.getOne<unknown>(
        Collections.JOURNAL_ENTRIES,
        id
      );
      if (!raw) return null;

      const result = JournalEntryRowSchema.safeParse(raw);
      if (!result.success) {
        log.warn('Invalid journal entry data', { id, issues: result.error.issues });
        return null;
      }
      return result.data;
    } catch (error) {
      log.error('Failed to get journal entry', error, { id });
      return null;
    }
  }

  /**
   * Get all journal entries, ordered by created_at descending.
   */
  async getAll(): Promise<ValidatedJournalEntryRow[]> {
    try {
      const raw = await this.adapter.getAll<unknown>(Collections.JOURNAL_ENTRIES);
      return validateArray(JournalEntryRowSchema, raw, 'JournalRepository.getAll');
    } catch (error) {
      log.error('Failed to get all journal entries', error);
      return [];
    }
  }

  /**
   * Get journal entries for a specific concept.
   */
  async getForConcept(conceptId: string): Promise<ValidatedJournalEntryRow[]> {
    try {
      const raw = await this.adapter.getWhere<unknown>(
        Collections.JOURNAL_ENTRIES,
        { concept_id: conceptId }
      );
      return validateArray(
        JournalEntryRowSchema,
        raw,
        'JournalRepository.getForConcept'
      );
    } catch (error) {
      log.error('Failed to get journal entries for concept', error, { conceptId });
      return [];
    }
  }

  /**
   * Create a new journal entry.
   * Returns the ID of the created entry.
   */
  async create(content: string, conceptId?: string): Promise<string> {
    try {
      const id = generateId();
      const now = new Date().toISOString();

      await this.adapter.upsert(Collections.JOURNAL_ENTRIES, id, {
        id,
        concept_id: conceptId ?? null,
        content,
        created_at: now,
        updated_at: now,
      });

      return id;
    } catch (error) {
      log.error('Failed to create journal entry', error, { conceptId });
      throw error;
    }
  }

  /**
   * Update a journal entry's content.
   */
  async update(id: string, content: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      await this.adapter.update(Collections.JOURNAL_ENTRIES, id, {
        content,
        updated_at: now,
      });
    } catch (error) {
      log.error('Failed to update journal entry', error, { id });
      throw error;
    }
  }

  /**
   * Delete a journal entry.
   */
  async delete(id: string): Promise<void> {
    try {
      await this.adapter.delete(Collections.JOURNAL_ENTRIES, id);
    } catch (error) {
      log.error('Failed to delete journal entry', error, { id });
      throw error;
    }
  }

  /**
   * Delete all journal entries.
   */
  async deleteAll(): Promise<void> {
    try {
      await this.adapter.deleteAll(Collections.JOURNAL_ENTRIES);
    } catch (error) {
      log.error('Failed to delete all journal entries', error);
      throw error;
    }
  }

  /**
   * Convert a row to a domain object.
   */
  toDomain(row: ValidatedJournalEntryRow): JournalEntry {
    return {
      id: row.id,
      conceptId: row.concept_id,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Get all journal entries as domain objects.
   */
  async getAllDomain(): Promise<JournalEntry[]> {
    const rows = await this.getAll();
    return rows.map((row) => this.toDomain(row));
  }
}
