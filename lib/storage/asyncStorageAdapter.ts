// AsyncStorage adapter for web platform
// Wraps @react-native-async-storage/async-storage with the StorageAdapter interface

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logger';
import { runWebMigrations } from '../migrations';
import { Collections, StorageAdapter } from './types';

const log = logger.scope('AsyncStorageAdapter');

// Storage key prefix
const STORAGE_PREFIX = '@vocab:';

// Storage keys for collections
const COLLECTION_KEYS: Record<string, string> = {
  [Collections.USER_CONCEPTS]: `${STORAGE_PREFIX}user_concepts`,
  [Collections.JOURNAL_ENTRIES]: `${STORAGE_PREFIX}journal_entries`,
  [Collections.PATHWAY_PROGRESS]: `${STORAGE_PREFIX}pathway_progress`,
  [Collections.ONBOARDING]: `${STORAGE_PREFIX}onboarding`,
  [Collections.SETTINGS]: `${STORAGE_PREFIX}settings`,
};

/**
 * AsyncStorage implementation of StorageAdapter.
 * Used on web platform where SQLite is not available.
 * Stores each collection as a JSON object keyed by entity ID.
 */
export class AsyncStorageAdapter implements StorageAdapter {
  private _initialized = false;
  private initPromise: Promise<void> | null = null;

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
      // Run migrations
      const migrationResult = await runWebMigrations(AsyncStorage);
      if (!migrationResult.success) {
        log.error('Migration failed', new Error(migrationResult.error || 'Unknown migration error'));
      } else if (migrationResult.migrationsRun > 0) {
        log.info(
          `Ran ${migrationResult.migrationsRun} migration(s), now at version ${migrationResult.currentVersion}`
        );
      }

      this._initialized = true;
      log.info('Storage initialized');
    } catch (error) {
      log.error('Failed to initialize storage', error);
      throw error;
    }
  }

  // ============ Key-Value Operations ============

  async getValue(key: string): Promise<string | null> {
    const settings = await this.getSettingsData();
    return settings[key] ?? null;
  }

  async setValue(key: string, value: string): Promise<void> {
    const settings = await this.getSettingsData();
    settings[key] = value;
    await this.saveSettingsData(settings);
  }

  async deleteValue(key: string): Promise<void> {
    const settings = await this.getSettingsData();
    delete settings[key];
    await this.saveSettingsData(settings);
  }

  private async getSettingsData(): Promise<Record<string, string>> {
    try {
      const data = await AsyncStorage.getItem(COLLECTION_KEYS[Collections.SETTINGS]);
      if (!data) return {};
      return JSON.parse(data);
    } catch (error) {
      log.error('Failed to get settings data', error);
      return {};
    }
  }

  private async saveSettingsData(data: Record<string, string>): Promise<void> {
    await AsyncStorage.setItem(COLLECTION_KEYS[Collections.SETTINGS], JSON.stringify(data));
  }

  // ============ Entity Operations ============

  async getOne<T>(collection: string, id: string): Promise<T | null> {
    // Special case for onboarding (single record)
    if (collection === Collections.ONBOARDING) {
      const data = await AsyncStorage.getItem(COLLECTION_KEYS[collection]);
      if (!data) return null;
      return JSON.parse(data) as T;
    }

    const collectionData = await this.getCollectionData(collection);
    return (collectionData[id] as T) ?? null;
  }

  async getAll<T>(collection: string): Promise<T[]> {
    // Special case for onboarding
    if (collection === Collections.ONBOARDING) {
      const data = await this.getOne<T>(collection, '1');
      return data ? [data] : [];
    }

    const collectionData = await this.getCollectionData(collection);
    const items = Object.values(collectionData) as T[];

    // Sort by appropriate field
    const orderKey = this.getOrderKey(collection);
    return items.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[orderKey] as string;
      const bVal = (b as Record<string, unknown>)[orderKey] as string;
      return new Date(bVal).getTime() - new Date(aVal).getTime();
    });
  }

  async getWhere<T>(
    collection: string,
    filter: Record<string, unknown>
  ): Promise<T[]> {
    const all = await this.getAll<T>(collection);

    return all.filter((item) => {
      const record = item as Record<string, unknown>;
      return Object.entries(filter).every(([key, value]) => record[key] === value);
    });
  }

  async upsert<T extends Record<string, unknown>>(
    collection: string,
    id: string,
    data: T
  ): Promise<void> {
    // Special case for onboarding
    if (collection === Collections.ONBOARDING) {
      await AsyncStorage.setItem(
        COLLECTION_KEYS[collection],
        JSON.stringify(data)
      );
      return;
    }

    const collectionData = await this.getCollectionData(collection);
    collectionData[id] = data;
    await this.saveCollectionData(collection, collectionData);
  }

  async update(
    collection: string,
    id: string,
    updates: Record<string, unknown>
  ): Promise<void> {
    // Special case for onboarding
    if (collection === Collections.ONBOARDING) {
      const existing = await this.getOne<Record<string, unknown>>(collection, '1');
      const updated = { ...existing, ...updates };
      await AsyncStorage.setItem(
        COLLECTION_KEYS[collection],
        JSON.stringify(updated)
      );
      return;
    }

    const collectionData = await this.getCollectionData(collection);
    if (collectionData[id]) {
      collectionData[id] = { ...collectionData[id], ...updates };
      await this.saveCollectionData(collection, collectionData);
    }
  }

  async delete(collection: string, id: string): Promise<void> {
    const collectionData = await this.getCollectionData(collection);
    delete collectionData[id];
    await this.saveCollectionData(collection, collectionData);
  }

  async deleteAll(collection: string): Promise<void> {
    // Special case for onboarding - reset instead of delete
    if (collection === Collections.ONBOARDING) {
      const defaultOnboarding = {
        completed: 0,
        goal: null,
        first_concept_viewed: 0,
      };
      await AsyncStorage.setItem(
        COLLECTION_KEYS[collection],
        JSON.stringify(defaultOnboarding)
      );
      return;
    }

    await AsyncStorage.removeItem(COLLECTION_KEYS[collection]);
  }

  // ============ Aggregate Operations ============

  async count(
    collection: string,
    filter?: Record<string, unknown>
  ): Promise<number> {
    if (!filter || Object.keys(filter).length === 0) {
      const all = await this.getAll(collection);
      return all.length;
    }

    const filtered = await this.getWhere(collection, filter);
    return filtered.length;
  }

  // ============ Raw Operations (not supported on web) ============

  async rawQuery<T>(): Promise<T[]> {
    throw new Error('Raw SQL queries are not supported on web platform');
  }

  async rawExecute(): Promise<void> {
    throw new Error('Raw SQL execution is not supported on web platform');
  }

  // ============ Helpers ============

  private async getCollectionData(
    collection: string
  ): Promise<Record<string, Record<string, unknown>>> {
    try {
      const key = COLLECTION_KEYS[collection];
      if (!key) {
        throw new Error(`Unknown collection: ${collection}`);
      }

      const data = await AsyncStorage.getItem(key);
      if (!data) return {};
      return JSON.parse(data);
    } catch (error) {
      log.error('Failed to get collection data', error, { collection });
      return {};
    }
  }

  private async saveCollectionData(
    collection: string,
    data: Record<string, Record<string, unknown>>
  ): Promise<void> {
    const key = COLLECTION_KEYS[collection];
    if (!key) {
      throw new Error(`Unknown collection: ${collection}`);
    }
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  private getOrderKey(collection: string): string {
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
