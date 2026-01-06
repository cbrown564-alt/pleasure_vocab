// Mock StorageAdapter for testing repositories
// Provides an in-memory storage implementation

import { Collections, StorageAdapter } from '@/lib/storage';

type CollectionData = Map<string, Record<string, unknown>>;

interface MockStorageAdapter {
  _store: Map<string, CollectionData>;
  _kvStore: Map<string, string>;
  _reset: () => void;
  initialize: jest.Mock;
  isInitialized: jest.Mock;
  getValue: jest.Mock;
  setValue: jest.Mock;
  deleteValue: jest.Mock;
  getOne: jest.Mock;
  getAll: jest.Mock;
  getWhere: jest.Mock;
  upsert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  deleteAll: jest.Mock;
  count: jest.Mock;
  // Note: rawQuery and rawExecute are optional - only present in native mode
  rawQuery?: jest.Mock;
  rawExecute?: jest.Mock;
}

/**
 * Creates a mock StorageAdapter with in-memory storage.
 * Useful for testing repositories in isolation.
 */
export function createMockStorageAdapter(): MockStorageAdapter {
  const store = new Map<string, CollectionData>();
  const kvStore = new Map<string, string>();

  // Initialize collections
  Object.values(Collections).forEach((c) => store.set(c, new Map()));

  const adapter: MockStorageAdapter = {
    _store: store,
    _kvStore: kvStore,
    _reset: () => {
      store.clear();
      kvStore.clear();
      Object.values(Collections).forEach((c) => store.set(c, new Map()));
    },

    initialize: jest.fn().mockResolvedValue(undefined),
    isInitialized: jest.fn().mockReturnValue(true),

    // Key-Value Operations
    getValue: jest.fn((key: string) => {
      return Promise.resolve(kvStore.get(key) ?? null);
    }),

    setValue: jest.fn((key: string, value: string) => {
      kvStore.set(key, value);
      return Promise.resolve();
    }),

    deleteValue: jest.fn((key: string) => {
      kvStore.delete(key);
      return Promise.resolve();
    }),

    // Entity Operations
    getOne: jest.fn(<T>(collection: string, id: string): Promise<T | null> => {
      const col = store.get(collection);
      return Promise.resolve((col?.get(id) as T) ?? null);
    }),

    getAll: jest.fn(<T>(collection: string): Promise<T[]> => {
      const col = store.get(collection);
      return Promise.resolve(Array.from(col?.values() ?? []) as T[]);
    }),

    getWhere: jest.fn(
      <T>(collection: string, filter: Record<string, unknown>): Promise<T[]> => {
        const col = store.get(collection);
        const results = Array.from(col?.values() ?? []).filter((item) => {
          const record = item as Record<string, unknown>;
          return Object.entries(filter).every(([k, v]) => record[k] === v);
        });
        return Promise.resolve(results as T[]);
      }
    ),

    upsert: jest.fn(
      <T extends Record<string, unknown>>(
        collection: string,
        id: string,
        data: T
      ): Promise<void> => {
        let col = store.get(collection);
        if (!col) {
          col = new Map();
          store.set(collection, col);
        }
        col.set(id, data);
        return Promise.resolve();
      }
    ),

    update: jest.fn(
      (
        collection: string,
        id: string,
        updates: Record<string, unknown>
      ): Promise<void> => {
        const col = store.get(collection);
        const existing = col?.get(id);
        if (existing) {
          col?.set(id, { ...existing, ...updates });
        }
        return Promise.resolve();
      }
    ),

    delete: jest.fn((collection: string, id: string): Promise<void> => {
      store.get(collection)?.delete(id);
      return Promise.resolve();
    }),

    deleteAll: jest.fn((collection: string): Promise<void> => {
      store.get(collection)?.clear();
      return Promise.resolve();
    }),

    // Aggregate Operations
    count: jest.fn(
      (collection: string, filter?: Record<string, unknown>): Promise<number> => {
        const col = store.get(collection);
        if (!filter || Object.keys(filter).length === 0) {
          return Promise.resolve(col?.size ?? 0);
        }
        const results = Array.from(col?.values() ?? []).filter((item) => {
          const record = item as Record<string, unknown>;
          return Object.entries(filter).every(([k, v]) => record[k] === v);
        });
        return Promise.resolve(results.length);
      }
    ),

    // Raw Operations - NOT included by default (web mode)
    // To test native mode, add these after creation:
    //   mockAdapter.rawQuery = jest.fn().mockResolvedValue([]);
    //   mockAdapter.rawExecute = jest.fn().mockResolvedValue(undefined);
  };

  return adapter;
}

/**
 * Helper to seed mock adapter with test data.
 */
export function seedMockAdapter(
  adapter: MockStorageAdapter,
  collection: string,
  data: Array<{ id: string; record: Record<string, unknown> }>
): void {
  const col = adapter._store.get(collection);
  if (col) {
    data.forEach(({ id, record }) => {
      col.set(id, record);
    });
  }
}
