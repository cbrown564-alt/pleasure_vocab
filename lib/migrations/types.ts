// Migration types and interfaces

/**
 * A database migration definition.
 */
export interface Migration {
  /** Unique version number (must be sequential) */
  version: number;
  /** Human-readable description of what this migration does */
  description: string;
  /** The migration function to run */
  up: (context: MigrationContext) => Promise<void>;
}

/**
 * Context passed to migration functions.
 * Abstracts the underlying storage mechanism.
 */
export interface MigrationContext {
  /** Execute raw SQL (native only) */
  executeSql?: (sql: string, params?: unknown[]) => Promise<void>;
  /** Get a value from storage (web only) */
  getValue?: (key: string) => Promise<string | null>;
  /** Set a value in storage (web only) */
  setValue?: (key: string, value: string) => Promise<void>;
  /** Platform identifier */
  platform: 'native' | 'web';
  /** Logger for migration output */
  log: (message: string) => void;
}

/**
 * Result of running migrations.
 */
export interface MigrationResult {
  /** Whether migrations completed successfully */
  success: boolean;
  /** Number of migrations applied */
  migrationsRun: number;
  /** Current schema version after migrations */
  currentVersion: number;
  /** Error message if failed */
  error?: string;
}

/**
 * Schema version record stored in the database.
 */
export interface SchemaVersion {
  version: number;
  appliedAt: string;
}
