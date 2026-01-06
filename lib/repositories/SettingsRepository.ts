// Settings Repository
// Handles key-value settings storage

import { logger } from '../logger';
import { StorageAdapter } from '../storage';

const log = logger.scope('SettingsRepository');

/**
 * Repository for settings operations.
 * Simple key-value store for app settings.
 */
export class SettingsRepository {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Get a setting value by key.
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.adapter.getValue(key);
    } catch (error) {
      log.error('Failed to get setting', error, { key });
      return null;
    }
  }

  /**
   * Get a setting as a boolean.
   */
  async getBoolean(key: string, defaultValue = false): Promise<boolean> {
    const value = await this.get(key);
    if (value === null) return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * Get a setting as a number.
   */
  async getNumber(key: string, defaultValue = 0): Promise<number> {
    const value = await this.get(key);
    if (value === null) return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get a setting as JSON.
   */
  async getJSON<T>(key: string, defaultValue: T): Promise<T> {
    const value = await this.get(key);
    if (value === null) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Set a setting value.
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await this.adapter.setValue(key, value);
    } catch (error) {
      log.error('Failed to set setting', error, { key });
      throw error;
    }
  }

  /**
   * Set a boolean setting.
   */
  async setBoolean(key: string, value: boolean): Promise<void> {
    await this.set(key, value ? 'true' : 'false');
  }

  /**
   * Set a number setting.
   */
  async setNumber(key: string, value: number): Promise<void> {
    await this.set(key, String(value));
  }

  /**
   * Set a JSON setting.
   */
  async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  /**
   * Delete a setting.
   */
  async delete(key: string): Promise<void> {
    try {
      await this.adapter.deleteValue(key);
    } catch (error) {
      log.error('Failed to delete setting', error, { key });
      throw error;
    }
  }
}
