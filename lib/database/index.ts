// Database facade
// Provides unified access to repositories with platform-appropriate storage

import { Platform } from 'react-native';
import { logger } from '../logger';
import {
  ConceptRepository,
  JournalRepository,
  OnboardingRepository,
  PathwayRepository,
  SettingsRepository,
} from '../repositories';
import {
  AsyncStorageAdapter,
  SQLiteAdapter,
  StorageAdapter,
} from '../storage';

const log = logger.scope('Database');

/**
 * Database singleton that provides access to all repositories.
 */
class Database {
  private static instance: Database | null = null;

  private adapter: StorageAdapter;
  private _initialized = false;
  private initPromise: Promise<void> | null = null;

  // Repositories
  public readonly concepts: ConceptRepository;
  public readonly onboarding: OnboardingRepository;
  public readonly journal: JournalRepository;
  public readonly pathways: PathwayRepository;
  public readonly settings: SettingsRepository;

  private constructor() {
    // Create platform-appropriate adapter
    this.adapter =
      Platform.OS === 'web'
        ? new AsyncStorageAdapter()
        : new SQLiteAdapter();

    // Initialize repositories
    this.concepts = new ConceptRepository(this.adapter);
    this.onboarding = new OnboardingRepository(this.adapter);
    this.journal = new JournalRepository(this.adapter);
    this.pathways = new PathwayRepository(this.adapter);
    this.settings = new SettingsRepository(this.adapter);
  }

  /**
   * Get the database instance.
   */
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Initialize the database.
   * Safe to call multiple times - only initializes once.
   */
  async initialize(): Promise<void> {
    if (this._initialized) return;

    // Prevent concurrent initialization
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      log.info('Initializing database...');
      await this.adapter.initialize();
      this._initialized = true;
      log.info('Database initialized successfully');
    } catch (error) {
      log.error('Failed to initialize database', error);
      throw error;
    }
  }

  /**
   * Check if database is initialized.
   */
  isInitialized(): boolean {
    return this._initialized;
  }

  /**
   * Clear all data (for reset/logout).
   */
  async clearAll(): Promise<void> {
    try {
      log.info('Clearing all data...');
      await Promise.all([
        this.concepts.deleteAll(),
        this.journal.deleteAll(),
        this.pathways.deleteAll(),
        this.onboarding.reset(),
      ]);
      log.info('All data cleared');
    } catch (error) {
      log.error('Failed to clear all data', error);
      throw error;
    }
  }

  /**
   * Get the storage adapter (for advanced use cases).
   */
  getAdapter(): StorageAdapter {
    return this.adapter;
  }
}

// Export singleton getter
export function getDatabase(): Database {
  return Database.getInstance();
}

// Export initialization function
export async function initDatabase(): Promise<void> {
  const db = getDatabase();
  await db.initialize();
}

// Export repository accessors for convenience
export const db = {
  get concepts() {
    return getDatabase().concepts;
  },
  get onboarding() {
    return getDatabase().onboarding;
  },
  get journal() {
    return getDatabase().journal;
  },
  get pathways() {
    return getDatabase().pathways;
  },
  get settings() {
    return getDatabase().settings;
  },
  initialize: initDatabase,
  clearAll: () => getDatabase().clearAll(),
  isInitialized: () => getDatabase().isInitialized(),
};

// Re-export repository types for convenience
export type {
  ConceptRepository,
  JournalRepository,
  OnboardingRepository,
  PathwayRepository,
  SettingsRepository,
};
