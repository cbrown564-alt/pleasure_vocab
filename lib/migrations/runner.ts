// Migration runner
// Handles running migrations for both native (SQLite) and web (AsyncStorage) platforms

import { logger } from '../logger';
import { getLatestVersion, getPendingMigrations, migrations } from './migrations';
import { MigrationContext, MigrationResult, SchemaVersion } from './types';

const log = logger.scope('Migrations');

// Storage key for schema version (web)
const SCHEMA_VERSION_KEY = '@vocab:schema_version';

/**
 * Database interface for migrations.
 * Uses a minimal interface to avoid tight coupling with expo-sqlite types.
 */
interface MigrationDatabase {
  execAsync(sql: string): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runAsync(sql: string, params?: any): Promise<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFirstAsync<T>(sql: string, params?: any): Promise<T | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllAsync<T>(sql: string, params?: any): Promise<T[]>;
}

/**
 * Run migrations for native SQLite database.
 */
export async function runNativeMigrations(
  db: MigrationDatabase
): Promise<MigrationResult> {
  try {
    // Ensure migrations table exists
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      )
    `);

    // Get current version
    const versionRow = await db.getFirstAsync<{ version: number }>(
      'SELECT MAX(version) as version FROM schema_migrations'
    );
    const currentVersion = versionRow?.version ?? 0;
    const latestVersion = getLatestVersion();

    log.info(`Current schema version: ${currentVersion}, latest: ${latestVersion}`);

    if (currentVersion >= latestVersion) {
      log.info('Database is up to date');
      return {
        success: true,
        migrationsRun: 0,
        currentVersion,
      };
    }

    // Get pending migrations
    const pending = getPendingMigrations(currentVersion);
    log.info(`Running ${pending.length} migration(s)`);

    // Check which columns already exist (for idempotency)
    const tableInfo = await db.getFirstAsync<{ name: string }[]>(
      'PRAGMA table_info(user_concepts)'
    );
    const existingColumns = new Set(
      Array.isArray(tableInfo) ? tableInfo.map((col: { name: string }) => col.name) : []
    );

    // Run each migration
    for (const migration of pending) {
      log.info(`Running migration ${migration.version}: ${migration.description}`);

      const context: MigrationContext = {
        platform: 'native',
        executeSql: async (sql: string, params?: unknown[]) => {
          // Skip ALTER TABLE if column already exists
          const match = sql.match(/ALTER TABLE (\w+) ADD COLUMN (\w+)/i);
          if (match) {
            const columnName = match[2];
            if (existingColumns.has(columnName)) {
              log.info(`Column ${columnName} already exists, skipping`);
              return;
            }
          }
          await db.runAsync(sql, params);
        },
        log: (message: string) => log.info(`  ${message}`),
      };

      await migration.up(context);

      // Record migration
      await db.runAsync(
        'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
        [migration.version, new Date().toISOString()]
      );

      log.info(`Migration ${migration.version} completed`);
    }

    return {
      success: true,
      migrationsRun: pending.length,
      currentVersion: latestVersion,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error('Migration failed', error);
    return {
      success: false,
      migrationsRun: 0,
      currentVersion: 0,
      error: message,
    };
  }
}

/**
 * Run migrations for web AsyncStorage.
 */
export async function runWebMigrations(
  storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
  }
): Promise<MigrationResult> {
  try {
    // Get current version
    const versionData = await storage.getItem(SCHEMA_VERSION_KEY);
    const schemaVersion: SchemaVersion = versionData
      ? JSON.parse(versionData)
      : { version: 0, appliedAt: new Date().toISOString() };

    const currentVersion = schemaVersion.version;
    const latestVersion = getLatestVersion();

    log.info(`Current schema version: ${currentVersion}, latest: ${latestVersion}`);

    if (currentVersion >= latestVersion) {
      log.info('Storage is up to date');
      return {
        success: true,
        migrationsRun: 0,
        currentVersion,
      };
    }

    // Get pending migrations
    const pending = getPendingMigrations(currentVersion);
    log.info(`Running ${pending.length} migration(s)`);

    // Run each migration
    for (const migration of pending) {
      log.info(`Running migration ${migration.version}: ${migration.description}`);

      const context: MigrationContext = {
        platform: 'web',
        getValue: (key: string) => storage.getItem(key),
        setValue: (key: string, value: string) => storage.setItem(key, value),
        log: (message: string) => log.info(`  ${message}`),
      };

      await migration.up(context);

      // Update schema version
      const newVersion: SchemaVersion = {
        version: migration.version,
        appliedAt: new Date().toISOString(),
      };
      await storage.setItem(SCHEMA_VERSION_KEY, JSON.stringify(newVersion));

      log.info(`Migration ${migration.version} completed`);
    }

    return {
      success: true,
      migrationsRun: pending.length,
      currentVersion: latestVersion,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error('Migration failed', error);
    return {
      success: false,
      migrationsRun: 0,
      currentVersion: 0,
      error: message,
    };
  }
}

/**
 * Get the current schema version (for debugging/display).
 */
export async function getCurrentVersion(
  platform: 'native' | 'web',
  storage: {
    getItem?: (key: string) => Promise<string | null>;
    getFirstAsync?: <T>(sql: string) => Promise<T | null>;
  }
): Promise<number> {
  try {
    if (platform === 'web' && storage.getItem) {
      const data = await storage.getItem(SCHEMA_VERSION_KEY);
      if (data) {
        const version: SchemaVersion = JSON.parse(data);
        return version.version;
      }
      return 0;
    } else if (platform === 'native' && storage.getFirstAsync) {
      const row = await storage.getFirstAsync<{ version: number }>(
        'SELECT MAX(version) as version FROM schema_migrations'
      );
      return row?.version ?? 0;
    }
    return 0;
  } catch {
    return 0;
  }
}
