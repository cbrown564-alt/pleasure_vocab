// SQLite storage adapter for native platforms
// Wraps expo-sqlite with the StorageAdapter interface

import * as SQLite from 'expo-sqlite';
import { logger } from '../logger';
import { runNativeMigrations } from '../migrations';
import { Collections, StorageAdapter } from './types';

const log = logger.scope('SQLiteAdapter');

const DATABASE_NAME = 'vocab.db';

/**
 * SQLite implementation of StorageAdapter.
 * Used on native iOS/Android platforms.
 */
export class SQLiteAdapter implements StorageAdapter {
  private db: SQLite.SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private _initialized = false;

  isInitialized(): boolean {
    return this._initialized;
  }

  async initialize(): Promise<void> {
    if (this._initialized) return;

    // Prevent multiple concurrent initializations
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

      // Create tables
      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;

        -- User settings (key-value store)
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        );

        -- User's relationship with concepts
        CREATE TABLE IF NOT EXISTS user_concepts (
          concept_id TEXT PRIMARY KEY,
          status TEXT DEFAULT 'unexplored',
          is_unlocked INTEGER DEFAULT 0,
          is_mastered INTEGER DEFAULT 0,
          explored_at TEXT,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        -- Journal entries
        CREATE TABLE IF NOT EXISTS journal_entries (
          id TEXT PRIMARY KEY,
          concept_id TEXT,
          content TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        -- Onboarding state
        CREATE TABLE IF NOT EXISTS onboarding (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          completed INTEGER DEFAULT 0,
          goal TEXT,
          comfort_level TEXT DEFAULT 'direct',
          first_concept_viewed INTEGER DEFAULT 0
        );

        -- Pathway progress tracking
        CREATE TABLE IF NOT EXISTS pathway_progress (
          pathway_id TEXT PRIMARY KEY,
          started_at TEXT DEFAULT CURRENT_TIMESTAMP,
          completed_at TEXT,
          concepts_completed TEXT DEFAULT '[]'
        );

        -- Pathway concept completions (normalized junction table)
        CREATE TABLE IF NOT EXISTS pathway_concept_completions (
          pathway_id TEXT NOT NULL,
          concept_id TEXT NOT NULL,
          completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (pathway_id, concept_id)
        );

        -- Index for faster pathway completion lookups
        CREATE INDEX IF NOT EXISTS idx_pathway_completions_pathway
        ON pathway_concept_completions(pathway_id);

        -- Initialize onboarding row if not exists
        INSERT OR IGNORE INTO onboarding (id) VALUES (1);
      `);

      // Run migrations
      const migrationResult = await runNativeMigrations(this.db);
      if (!migrationResult.success) {
        log.error('Migration failed', new Error(migrationResult.error));
      } else if (migrationResult.migrationsRun > 0) {
        log.info(
          `Ran ${migrationResult.migrationsRun} migration(s), now at version ${migrationResult.currentVersion}`
        );
      }

      this._initialized = true;
      log.info('Database initialized');
    } catch (error) {
      log.error('Failed to initialize database', error);
      throw error;
    }
  }

  private getDb(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  // ============ Key-Value Operations ============

  async getValue(key: string): Promise<string | null> {
    const db = this.getDb();
    const result = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return result?.value ?? null;
  }

  async setValue(key: string, value: string): Promise<void> {
    const db = this.getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }

  async deleteValue(key: string): Promise<void> {
    const db = this.getDb();
    await db.runAsync('DELETE FROM settings WHERE key = ?', [key]);
  }

  // ============ Entity Operations ============

  async getOne<T>(collection: string, id: string): Promise<T | null> {
    const db = this.getDb();
    const idColumn = this.getIdColumn(collection);

    // Special case for onboarding (always id = 1)
    if (collection === Collections.ONBOARDING) {
      const result = await db.getFirstAsync<T>(
        `SELECT * FROM ${collection} WHERE id = 1`
      );
      return result ?? null;
    }

    const result = await db.getFirstAsync<T>(
      `SELECT * FROM ${collection} WHERE ${idColumn} = ?`,
      [id]
    );
    return result ?? null;
  }

  async getAll<T>(collection: string): Promise<T[]> {
    const db = this.getDb();
    const orderColumn = this.getOrderColumn(collection);
    const results = await db.getAllAsync<T>(
      `SELECT * FROM ${collection} ORDER BY ${orderColumn} DESC`
    );
    return results;
  }

  async getWhere<T>(
    collection: string,
    filter: Record<string, unknown>
  ): Promise<T[]> {
    const db = this.getDb();
    const entries = Object.entries(filter);

    if (entries.length === 0) {
      return this.getAll(collection);
    }

    const whereClauses = entries.map(([key]) => `${key} = ?`).join(' AND ');
    const values = entries.map(([, value]) => value) as SQLite.SQLiteBindParams;

    const results = await db.getAllAsync<T>(
      `SELECT * FROM ${collection} WHERE ${whereClauses}`,
      values
    );
    return results;
  }

  async upsert<T extends Record<string, unknown>>(
    collection: string,
    id: string,
    data: T
  ): Promise<void> {
    const db = this.getDb();
    const idColumn = this.getIdColumn(collection);

    // Special case for onboarding
    if (collection === Collections.ONBOARDING) {
      const existing = await this.getOne(collection, '1');
      if (existing) {
        await this.update(collection, '1', data);
      } else {
        const entries = Object.entries({ ...data, id: 1 });
        const columns = entries.map(([k]) => k).join(', ');
        const placeholders = entries.map(() => '?').join(', ');
        const values = entries.map(([, v]) => v) as SQLite.SQLiteBindParams;

        await db.runAsync(
          `INSERT INTO ${collection} (${columns}) VALUES (${placeholders})`,
          values
        );
      }
      return;
    }

    const entries = Object.entries({ ...data, [idColumn]: id });
    const columns = entries.map(([k]) => k).join(', ');
    const placeholders = entries.map(() => '?').join(', ');
    const values = entries.map(([, v]) => v) as SQLite.SQLiteBindParams;

    await db.runAsync(
      `INSERT OR REPLACE INTO ${collection} (${columns}) VALUES (${placeholders})`,
      values
    );
  }

  async update(
    collection: string,
    id: string,
    updates: Record<string, unknown>
  ): Promise<void> {
    const db = this.getDb();
    const idColumn = this.getIdColumn(collection);
    const entries = Object.entries(updates);

    if (entries.length === 0) return;

    const setClauses = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = [...entries.map(([, value]) => value), id];

    // Special case for onboarding
    const whereClause =
      collection === Collections.ONBOARDING
        ? 'id = 1'
        : `${idColumn} = ?`;
    const queryValues = (
      collection === Collections.ONBOARDING
        ? entries.map(([, value]) => value)
        : values
    ) as SQLite.SQLiteBindParams;

    await db.runAsync(
      `UPDATE ${collection} SET ${setClauses} WHERE ${whereClause}`,
      queryValues
    );
  }

  async delete(collection: string, id: string): Promise<void> {
    const db = this.getDb();
    const idColumn = this.getIdColumn(collection);
    await db.runAsync(`DELETE FROM ${collection} WHERE ${idColumn} = ?`, [id]);
  }

  async deleteAll(collection: string): Promise<void> {
    const db = this.getDb();

    // Special case for onboarding - reset instead of delete
    if (collection === Collections.ONBOARDING) {
      await db.runAsync(
        `UPDATE onboarding SET completed = 0, goal = NULL, first_concept_viewed = 0 WHERE id = 1`
      );
      return;
    }

    await db.runAsync(`DELETE FROM ${collection}`);
  }

  // ============ Aggregate Operations ============

  async count(
    collection: string,
    filter?: Record<string, unknown>
  ): Promise<number> {
    const db = this.getDb();

    if (!filter || Object.keys(filter).length === 0) {
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${collection}`
      );
      return result?.count ?? 0;
    }

    const entries = Object.entries(filter);
    const whereClauses = entries.map(([key]) => `${key} = ?`).join(' AND ');
    const values = entries.map(([, value]) => value) as SQLite.SQLiteBindParams;

    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${collection} WHERE ${whereClauses}`,
      values
    );
    return result?.count ?? 0;
  }

  // ============ Raw Operations ============

  async rawQuery<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const db = this.getDb();
    return db.getAllAsync<T>(sql, params as SQLite.SQLiteBindParams);
  }

  async rawExecute(sql: string, params?: unknown[]): Promise<void> {
    const db = this.getDb();
    await db.runAsync(sql, params as SQLite.SQLiteBindParams);
  }

  // ============ Helpers ============

  private getIdColumn(collection: string): string {
    switch (collection) {
      case Collections.USER_CONCEPTS:
        return 'concept_id';
      case Collections.PATHWAY_PROGRESS:
        return 'pathway_id';
      case Collections.JOURNAL_ENTRIES:
        return 'id';
      case Collections.ONBOARDING:
        return 'id';
      case Collections.SETTINGS:
        return 'key';
      default:
        return 'id';
    }
  }

  private getOrderColumn(collection: string): string {
    switch (collection) {
      case Collections.USER_CONCEPTS:
        return 'updated_at';
      case Collections.JOURNAL_ENTRIES:
        return 'created_at';
      case Collections.PATHWAY_PROGRESS:
        return 'started_at';
      default:
        return 'id';
    }
  }
}
