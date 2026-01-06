// Database setup and operations for Pleasure Vocabulary Builder
// Uses expo-sqlite for local-only storage (native platforms)

import * as SQLite from 'expo-sqlite';
import { ConceptStatus, UserGoal } from '@/types';
import { generateId } from './utils/id';
import { logger } from './logger';
import { runNativeMigrations } from './migrations';
import {
  DEFAULT_ONBOARDING,
  DEFAULT_USER_CONCEPT,
  JournalEntryRowSchema,
  OnboardingRowSchema,
  PathwayProgressRowSchema,
  UserConceptRowSchema,
  validateArray,
  validateWithFallback,
} from './validation';

const log = logger.scope('Database:Native');

const DATABASE_NAME = 'vocab.db';

// Initialize database with schema
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Create tables
  await db.execAsync(`
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

    -- Initialize onboarding row if not exists
    INSERT OR IGNORE INTO onboarding (id) VALUES (1);
  `);

  // Run migrations
  const migrationResult = await runNativeMigrations(db);
  if (!migrationResult.success) {
    const errorMsg = migrationResult.error || 'Unknown migration error';
    log.error(`Migration failed: ${errorMsg}`);
    // Don't throw - allow app to continue with potentially outdated schema
  } else if (migrationResult.migrationsRun > 0) {
    log.info(`Ran ${migrationResult.migrationsRun} migration(s), now at version ${migrationResult.currentVersion}`);
  }

  return db;
}

// Get database instance (singleton pattern)
let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

// ============ Settings Operations ============

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return result?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

// ============ Onboarding Operations ============

export interface OnboardingRow {
  completed: number;
  goal: string | null;
  first_concept_viewed: number;
}

export async function getOnboardingState(): Promise<OnboardingRow> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<unknown>(
    'SELECT completed, goal, first_concept_viewed FROM onboarding WHERE id = 1'
  );
  return validateWithFallback(
    OnboardingRowSchema,
    result,
    DEFAULT_ONBOARDING,
    'getOnboardingState'
  );
}

export async function updateOnboarding(updates: {
  completed?: boolean;
  goal?: UserGoal;
  firstConceptViewed?: boolean;
}): Promise<void> {
  const db = await getDatabase();
  const sets: string[] = [];
  const values: (string | number)[] = [];

  if (updates.completed !== undefined) {
    sets.push('completed = ?');
    values.push(updates.completed ? 1 : 0);
  }
  if (updates.goal !== undefined) {
    sets.push('goal = ?');
    values.push(updates.goal);
  }
  if (updates.firstConceptViewed !== undefined) {
    sets.push('first_concept_viewed = ?');
    values.push(updates.firstConceptViewed ? 1 : 0);
  }

  if (sets.length > 0) {
    await db.runAsync(
      `UPDATE onboarding SET ${sets.join(', ')} WHERE id = 1`,
      values
    );
  }
}

// ============ User Concepts Operations ============

export interface UserConceptRow {
  concept_id: string;
  status: string;
  is_unlocked: number;
  is_mastered: number;
  explored_at: string | null;
  updated_at: string;
}

export async function getUserConcept(conceptId: string): Promise<UserConceptRow | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<unknown>(
    'SELECT * FROM user_concepts WHERE concept_id = ?',
    [conceptId]
  );
  if (!result) return null;

  const validated = UserConceptRowSchema.safeParse(result);
  if (!validated.success) {
    log.warn('getUserConcept: Invalid data', { conceptId, issues: validated.error.issues });
    return null;
  }
  return validated.data;
}

export async function getAllUserConcepts(): Promise<UserConceptRow[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<unknown>(
    'SELECT * FROM user_concepts ORDER BY updated_at DESC'
  );
  return validateArray(UserConceptRowSchema, results, 'getAllUserConcepts');
}

export async function updateConceptStatus(
  conceptId: string,
  status: ConceptStatus
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  // Check if concept exists
  const existing = await getUserConcept(conceptId);

  if (existing) {
    await db.runAsync(
      `UPDATE user_concepts SET status = ?, updated_at = ?, explored_at = COALESCE(explored_at, ?) WHERE concept_id = ?`,
      [status, now, now, conceptId]
    );
  } else {
    await db.runAsync(
      `INSERT INTO user_concepts (concept_id, status, explored_at, updated_at) VALUES (?, ?, ?, ?)`,
      [conceptId, status, now, now]
    );
  }
}

export async function markConceptExplored(conceptId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const existing = await getUserConcept(conceptId);

  if (existing) {
    // Only update explored_at if not already set, keep status unless unexplored
    if (existing.status === 'unexplored') {
      await db.runAsync(
        `UPDATE user_concepts SET status = 'explored', explored_at = COALESCE(explored_at, ?), updated_at = ? WHERE concept_id = ?`,
        [now, now, conceptId]
      );
    }
  } else {
    await db.runAsync(
      `INSERT INTO user_concepts (concept_id, status, explored_at, updated_at) VALUES (?, 'explored', ?, ?)`,
      [conceptId, now, now]
    );
  }
}

// ============ Unlock/Master Operations ============

export async function unlockConcept(conceptId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const existing = await getUserConcept(conceptId);

  if (existing) {
    await db.runAsync(
      `UPDATE user_concepts SET is_unlocked = 1, updated_at = ? WHERE concept_id = ?`,
      [now, conceptId]
    );
  } else {
    await db.runAsync(
      `INSERT INTO user_concepts (concept_id, status, is_unlocked, is_mastered, updated_at) VALUES (?, 'unexplored', 1, 0, ?)`,
      [conceptId, now]
    );
  }
}

export async function masterConcept(conceptId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const existing = await getUserConcept(conceptId);

  if (existing) {
    await db.runAsync(
      `UPDATE user_concepts SET is_mastered = 1, is_unlocked = 1, updated_at = ? WHERE concept_id = ?`,
      [now, conceptId]
    );
  } else {
    await db.runAsync(
      `INSERT INTO user_concepts (concept_id, status, is_unlocked, is_mastered, updated_at) VALUES (?, 'unexplored', 1, 1, ?)`,
      [conceptId, now]
    );
  }
}

export async function isConceptUnlocked(conceptId: string): Promise<boolean> {
  const concept = await getUserConcept(conceptId);
  return concept?.is_unlocked === 1;
}

export async function isConceptMastered(conceptId: string): Promise<boolean> {
  const concept = await getUserConcept(conceptId);
  return concept?.is_mastered === 1;
}

export async function getUnlockedConceptIds(): Promise<string[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<{ concept_id: string }>(
    'SELECT concept_id FROM user_concepts WHERE is_unlocked = 1'
  );
  return results.map(r => r.concept_id);
}

export async function getMasteredConceptIds(): Promise<string[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<{ concept_id: string }>(
    'SELECT concept_id FROM user_concepts WHERE is_mastered = 1'
  );
  return results.map(r => r.concept_id);
}

// ============ Journal Operations ============

export interface JournalEntryRow {
  id: string;
  concept_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function createJournalEntry(
  content: string,
  conceptId?: string
): Promise<string> {
  const db = await getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO journal_entries (id, concept_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    [id, conceptId ?? null, content, now, now]
  );

  return id;
}

export async function updateJournalEntry(
  id: string,
  content: string
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE journal_entries SET content = ?, updated_at = ? WHERE id = ?`,
    [content, now, id]
  );
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM journal_entries WHERE id = ?', [id]);
}

export async function getJournalEntries(): Promise<JournalEntryRow[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<unknown>(
    'SELECT * FROM journal_entries ORDER BY created_at DESC'
  );
  return validateArray(JournalEntryRowSchema, results, 'getJournalEntries');
}

export async function getJournalEntriesForConcept(conceptId: string): Promise<JournalEntryRow[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<unknown>(
    'SELECT * FROM journal_entries WHERE concept_id = ? ORDER BY created_at DESC',
    [conceptId]
  );
  return validateArray(JournalEntryRowSchema, results, 'getJournalEntriesForConcept');
}

// ============ Stats Operations ============

export async function getExploredCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM user_concepts WHERE status != 'unexplored'`
  );
  return result?.count ?? 0;
}

export async function getResonatesCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM user_concepts WHERE status = 'resonates'`
  );
  return result?.count ?? 0;
}

// ============ Pathway Progress Operations ============

export interface PathwayProgressRow {
  pathway_id: string;
  started_at: string;
  completed_at: string | null;
  concepts_completed: string; // JSON array
}

export async function getPathwayProgress(pathwayId: string): Promise<PathwayProgressRow | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<unknown>(
    'SELECT * FROM pathway_progress WHERE pathway_id = ?',
    [pathwayId]
  );
  if (!result) return null;

  const validated = PathwayProgressRowSchema.safeParse(result);
  if (!validated.success) {
    log.warn('getPathwayProgress: Invalid data', { pathwayId, issues: validated.error.issues });
    return null;
  }
  return validated.data;
}

export async function getAllPathwayProgress(): Promise<PathwayProgressRow[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<unknown>(
    'SELECT * FROM pathway_progress ORDER BY started_at DESC'
  );
  return validateArray(PathwayProgressRowSchema, results, 'getAllPathwayProgress');
}

export async function startPathway(pathwayId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const existing = await getPathwayProgress(pathwayId);

  if (!existing) {
    await db.runAsync(
      `INSERT INTO pathway_progress (pathway_id, started_at, concepts_completed) VALUES (?, ?, '[]')`,
      [pathwayId, now]
    );
  }
}

export async function updatePathwayProgress(
  pathwayId: string,
  conceptId: string,
  totalConceptsInPathway: number
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  let progress = await getPathwayProgress(pathwayId);

  if (!progress) {
    await startPathway(pathwayId);
    progress = await getPathwayProgress(pathwayId);
  }

  if (progress) {
    const completedConcepts: string[] = JSON.parse(progress.concepts_completed || '[]');

    if (!completedConcepts.includes(conceptId)) {
      completedConcepts.push(conceptId);

      const isComplete = completedConcepts.length >= totalConceptsInPathway;

      await db.runAsync(
        `UPDATE pathway_progress SET concepts_completed = ?, completed_at = ? WHERE pathway_id = ?`,
        [JSON.stringify(completedConcepts), isComplete ? now : null, pathwayId]
      );
    }
  }
}

// ============ Data Management ============

export async function clearAllData(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM user_concepts;
    DELETE FROM journal_entries;
    DELETE FROM pathway_progress;
    UPDATE onboarding SET completed = 0, goal = NULL, first_concept_viewed = 0 WHERE id = 1;
    DELETE FROM settings;
  `);
}

// Note: generateId is now imported from './utils/id'
