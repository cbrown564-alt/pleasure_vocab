// Storage adapter types
// Defines the interface for platform-specific storage implementations

/**
 * Result from a query operation.
 */
export interface QueryResult<T> {
  rows: T[];
  rowsAffected?: number;
}

/**
 * Storage adapter interface.
 * Abstracts the differences between SQLite (native) and AsyncStorage (web).
 */
export interface StorageAdapter {
  /**
   * Initialize the storage (create tables, run migrations, etc.)
   */
  initialize(): Promise<void>;

  /**
   * Check if storage is initialized.
   */
  isInitialized(): boolean;

  // ============ Key-Value Operations (for simple settings) ============

  /**
   * Get a value by key.
   */
  getValue(key: string): Promise<string | null>;

  /**
   * Set a value by key.
   */
  setValue(key: string, value: string): Promise<void>;

  /**
   * Delete a value by key.
   */
  deleteValue(key: string): Promise<void>;

  // ============ Entity Operations ============

  /**
   * Get a single entity by ID from a collection/table.
   */
  getOne<T>(collection: string, id: string): Promise<T | null>;

  /**
   * Get all entities from a collection/table.
   */
  getAll<T>(collection: string): Promise<T[]>;

  /**
   * Get entities matching a filter.
   */
  getWhere<T>(
    collection: string,
    filter: Record<string, unknown>
  ): Promise<T[]>;

  /**
   * Insert or update an entity.
   */
  upsert<T extends Record<string, unknown>>(
    collection: string,
    id: string,
    data: T
  ): Promise<void>;

  /**
   * Update specific fields of an entity.
   */
  update(
    collection: string,
    id: string,
    updates: Record<string, unknown>
  ): Promise<void>;

  /**
   * Delete an entity by ID.
   */
  delete(collection: string, id: string): Promise<void>;

  /**
   * Delete all entities from a collection.
   */
  deleteAll(collection: string): Promise<void>;

  // ============ Aggregate Operations ============

  /**
   * Count entities matching a filter.
   */
  count(collection: string, filter?: Record<string, unknown>): Promise<number>;

  // ============ Raw Operations (for complex queries) ============

  /**
   * Execute a raw SQL query (native only, throws on web).
   */
  rawQuery?<T>(sql: string, params?: unknown[]): Promise<T[]>;

  /**
   * Execute a raw SQL statement (native only, throws on web).
   */
  rawExecute?(sql: string, params?: unknown[]): Promise<void>;
}

/**
 * Collection names used in the app.
 */
export const Collections = {
  USER_CONCEPTS: 'user_concepts',
  JOURNAL_ENTRIES: 'journal_entries',
  PATHWAY_PROGRESS: 'pathway_progress',
  PATHWAY_COMPLETIONS: 'pathway_concept_completions', // Junction table
  ONBOARDING: 'onboarding',
  SETTINGS: 'settings',
} as const;

export type CollectionName = (typeof Collections)[keyof typeof Collections];
