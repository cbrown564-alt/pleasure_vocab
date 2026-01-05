// Web-compatible database using AsyncStorage
// This is used as a fallback when SQLite is not available (web platform)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConceptStatus, UserGoal } from '@/types';
import { generateId } from './utils/id';
import {
  DEFAULT_ONBOARDING,
  JournalEntryRowSchema,
  OnboardingRowSchema,
  PathwayProgressRowSchema,
  UserConceptRowSchema,
  validateArray,
  validateWithFallback,
} from './validation';

// Default concepts that are unlocked from the start
const DEFAULT_UNLOCKED_CONCEPTS = ['angling', 'rocking', 'shallowing'];

const STORAGE_KEYS = {
  ONBOARDING: '@vocab:onboarding',
  USER_CONCEPTS: '@vocab:user_concepts',
  JOURNAL_ENTRIES: '@vocab:journal_entries',
  SETTINGS: '@vocab:settings',
  PATHWAY_PROGRESS: '@vocab:pathway_progress',
};

// ============ Onboarding Operations ============

export interface OnboardingRow {
  completed: number;
  goal: string | null;
  first_concept_viewed: number;
}

const defaultOnboarding: OnboardingRow = {
  completed: 0,
  goal: null,
  first_concept_viewed: 0,
};

export async function getOnboardingState(): Promise<OnboardingRow> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
    if (!data) return DEFAULT_ONBOARDING;
    const parsed = JSON.parse(data);
    return validateWithFallback(
      OnboardingRowSchema,
      parsed,
      DEFAULT_ONBOARDING,
      'getOnboardingState'
    );
  } catch (error) {
    console.warn('[getOnboardingState] Error reading data:', error);
    return DEFAULT_ONBOARDING;
  }
}

export async function updateOnboarding(updates: {
  completed?: boolean;
  goal?: UserGoal;
  firstConceptViewed?: boolean;
}): Promise<void> {
  const current = await getOnboardingState();
  const updated = {
    ...current,
    ...(updates.completed !== undefined && { completed: updates.completed ? 1 : 0 }),
    ...(updates.goal !== undefined && { goal: updates.goal }),
    ...(updates.firstConceptViewed !== undefined && { first_concept_viewed: updates.firstConceptViewed ? 1 : 0 }),
  };
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(updated));
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

async function getUserConceptsMap(): Promise<Record<string, UserConceptRow>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_CONCEPTS);
    if (!data) return {};
    const parsed = JSON.parse(data);
    // Validate each entry in the map
    const validated: Record<string, UserConceptRow> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const result = UserConceptRowSchema.safeParse(value);
      if (result.success) {
        validated[key] = result.data;
      } else {
        console.warn(`[getUserConceptsMap] Invalid entry for ${key}:`, result.error.issues);
      }
    }
    return validated;
  } catch (error) {
    console.warn('[getUserConceptsMap] Error reading data:', error);
    return {};
  }
}

async function saveUserConceptsMap(map: Record<string, UserConceptRow>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_CONCEPTS, JSON.stringify(map));
}

export async function getUserConcept(conceptId: string): Promise<UserConceptRow | null> {
  const map = await getUserConceptsMap();
  return map[conceptId] ?? null;
}

export async function getAllUserConcepts(): Promise<UserConceptRow[]> {
  const map = await getUserConceptsMap();
  return Object.values(map).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function updateConceptStatus(
  conceptId: string,
  status: ConceptStatus
): Promise<void> {
  const map = await getUserConceptsMap();
  const now = new Date().toISOString();
  const existing = map[conceptId];

  map[conceptId] = {
    concept_id: conceptId,
    status,
    is_unlocked: existing?.is_unlocked ?? 0,
    is_mastered: existing?.is_mastered ?? 0,
    explored_at: existing?.explored_at ?? now,
    updated_at: now,
  };

  await saveUserConceptsMap(map);
}

export async function markConceptExplored(conceptId: string): Promise<void> {
  const map = await getUserConceptsMap();
  const now = new Date().toISOString();
  const existing = map[conceptId];

  if (!existing || existing.status === 'unexplored') {
    map[conceptId] = {
      concept_id: conceptId,
      status: 'explored',
      is_unlocked: existing?.is_unlocked ?? 0,
      is_mastered: existing?.is_mastered ?? 0,
      explored_at: existing?.explored_at ?? now,
      updated_at: now,
    };
    await saveUserConceptsMap(map);
  }
}

// ============ Unlock/Master Operations ============

export async function unlockConcept(conceptId: string): Promise<void> {
  const map = await getUserConceptsMap();
  const now = new Date().toISOString();
  const existing = map[conceptId];

  map[conceptId] = {
    concept_id: conceptId,
    status: existing?.status ?? 'unexplored',
    is_unlocked: 1,
    is_mastered: existing?.is_mastered ?? 0,
    explored_at: existing?.explored_at ?? null,
    updated_at: now,
  };

  await saveUserConceptsMap(map);
}

export async function masterConcept(conceptId: string): Promise<void> {
  const map = await getUserConceptsMap();
  const now = new Date().toISOString();
  const existing = map[conceptId];

  map[conceptId] = {
    concept_id: conceptId,
    status: existing?.status ?? 'unexplored',
    is_unlocked: 1, // Mastering also unlocks
    is_mastered: 1,
    explored_at: existing?.explored_at ?? null,
    updated_at: now,
  };

  await saveUserConceptsMap(map);
}

export async function isConceptUnlocked(conceptId: string): Promise<boolean> {
  const map = await getUserConceptsMap();
  return map[conceptId]?.is_unlocked === 1;
}

export async function isConceptMastered(conceptId: string): Promise<boolean> {
  const map = await getUserConceptsMap();
  return map[conceptId]?.is_mastered === 1;
}

export async function getUnlockedConceptIds(): Promise<string[]> {
  const map = await getUserConceptsMap();
  return Object.values(map)
    .filter(c => c.is_unlocked === 1)
    .map(c => c.concept_id);
}

export async function getMasteredConceptIds(): Promise<string[]> {
  const map = await getUserConceptsMap();
  return Object.values(map)
    .filter(c => c.is_mastered === 1)
    .map(c => c.concept_id);
}

// ============ Journal Operations ============

export interface JournalEntryRow {
  id: string;
  concept_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

async function getJournalEntriesMap(): Promise<Record<string, JournalEntryRow>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    if (!data) return {};
    const parsed = JSON.parse(data);
    // Validate each entry in the map
    const validated: Record<string, JournalEntryRow> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const result = JournalEntryRowSchema.safeParse(value);
      if (result.success) {
        validated[key] = result.data;
      } else {
        console.warn(`[getJournalEntriesMap] Invalid entry for ${key}:`, result.error.issues);
      }
    }
    return validated;
  } catch (error) {
    console.warn('[getJournalEntriesMap] Error reading data:', error);
    return {};
  }
}

async function saveJournalEntriesMap(map: Record<string, JournalEntryRow>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(map));
}

export async function createJournalEntry(
  content: string,
  conceptId?: string
): Promise<string> {
  const map = await getJournalEntriesMap();
  const id = generateId();
  const now = new Date().toISOString();

  map[id] = {
    id,
    concept_id: conceptId ?? null,
    content,
    created_at: now,
    updated_at: now,
  };

  await saveJournalEntriesMap(map);
  return id;
}

export async function updateJournalEntry(
  id: string,
  content: string
): Promise<void> {
  const map = await getJournalEntriesMap();
  if (map[id]) {
    map[id] = {
      ...map[id],
      content,
      updated_at: new Date().toISOString(),
    };
    await saveJournalEntriesMap(map);
  }
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const map = await getJournalEntriesMap();
  delete map[id];
  await saveJournalEntriesMap(map);
}

export async function getJournalEntries(): Promise<JournalEntryRow[]> {
  const map = await getJournalEntriesMap();
  return Object.values(map).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getJournalEntriesForConcept(conceptId: string): Promise<JournalEntryRow[]> {
  const entries = await getJournalEntries();
  return entries.filter((e) => e.concept_id === conceptId);
}

// ============ Stats Operations ============

export async function getExploredCount(): Promise<number> {
  const concepts = await getAllUserConcepts();
  return concepts.filter((c) => c.status !== 'unexplored').length;
}

export async function getResonatesCount(): Promise<number> {
  const concepts = await getAllUserConcepts();
  return concepts.filter((c) => c.status === 'resonates').length;
}

// ============ Pathway Progress Operations ============

export interface PathwayProgressRow {
  pathway_id: string;
  started_at: string;
  completed_at: string | null;
  concepts_completed: string; // JSON array
}

async function getPathwayProgressMap(): Promise<Record<string, PathwayProgressRow>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PATHWAY_PROGRESS);
    if (!data) return {};
    const parsed = JSON.parse(data);
    // Validate each entry in the map
    const validated: Record<string, PathwayProgressRow> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const result = PathwayProgressRowSchema.safeParse(value);
      if (result.success) {
        validated[key] = result.data;
      } else {
        console.warn(`[getPathwayProgressMap] Invalid entry for ${key}:`, result.error.issues);
      }
    }
    return validated;
  } catch (error) {
    console.warn('[getPathwayProgressMap] Error reading data:', error);
    return {};
  }
}

async function savePathwayProgressMap(map: Record<string, PathwayProgressRow>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PATHWAY_PROGRESS, JSON.stringify(map));
}

export async function getPathwayProgress(pathwayId: string): Promise<PathwayProgressRow | null> {
  const map = await getPathwayProgressMap();
  return map[pathwayId] ?? null;
}

export async function getAllPathwayProgress(): Promise<PathwayProgressRow[]> {
  const map = await getPathwayProgressMap();
  return Object.values(map).sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );
}

export async function startPathway(pathwayId: string): Promise<void> {
  const map = await getPathwayProgressMap();
  const now = new Date().toISOString();

  if (!map[pathwayId]) {
    map[pathwayId] = {
      pathway_id: pathwayId,
      started_at: now,
      completed_at: null,
      concepts_completed: '[]',
    };
    await savePathwayProgressMap(map);
  }
}

export async function updatePathwayProgress(
  pathwayId: string,
  conceptId: string,
  totalConceptsInPathway: number
): Promise<void> {
  const map = await getPathwayProgressMap();
  const now = new Date().toISOString();

  if (!map[pathwayId]) {
    map[pathwayId] = {
      pathway_id: pathwayId,
      started_at: now,
      completed_at: null,
      concepts_completed: '[]',
    };
  }

  const completedConcepts: string[] = JSON.parse(map[pathwayId].concepts_completed || '[]');

  if (!completedConcepts.includes(conceptId)) {
    completedConcepts.push(conceptId);

    const isComplete = completedConcepts.length >= totalConceptsInPathway;

    map[pathwayId] = {
      ...map[pathwayId],
      concepts_completed: JSON.stringify(completedConcepts),
      completed_at: isComplete ? now : null,
    };

    await savePathwayProgressMap(map);
  }
}

// ============ Settings Operations ============

export async function getSetting(key: string): Promise<string | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    const settings = data ? JSON.parse(data) : {};
    return settings[key] ?? null;
  } catch (error) {
    console.warn('[getSetting] Error reading data:', error);
    return null;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    const settings = data ? JSON.parse(data) : {};
    settings[key] = value;
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('[setSetting] Error writing data:', error);
  }
}

// ============ Data Management ============

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ONBOARDING,
    STORAGE_KEYS.USER_CONCEPTS,
    STORAGE_KEYS.JOURNAL_ENTRIES,
    STORAGE_KEYS.SETTINGS,
    STORAGE_KEYS.PATHWAY_PROGRESS,
  ]);
}

// ============ Database Init ============

export async function initDatabase(): Promise<void> {
  // Seed default unlocked concepts for web
  await seedDefaultUnlockedConcepts();
}

export async function getDatabase(): Promise<void> {
  // No-op for web - but ensure seeding runs
  await initDatabase();
}

// Seed default unlocked concepts if not already present
async function seedDefaultUnlockedConcepts(): Promise<void> {
  const map = await getUserConceptsMap();
  const now = new Date().toISOString();
  let updated = false;

  for (const conceptId of DEFAULT_UNLOCKED_CONCEPTS) {
    if (!map[conceptId]) {
      // Create new entry with is_unlocked = 1
      map[conceptId] = {
        concept_id: conceptId,
        status: 'unexplored',
        is_unlocked: 1,
        is_mastered: 0,
        explored_at: null,
        updated_at: now,
      };
      updated = true;
    } else if (map[conceptId].is_unlocked !== 1) {
      // Ensure existing entry is unlocked
      map[conceptId].is_unlocked = 1;
      map[conceptId].updated_at = now;
      updated = true;
    }
  }

  if (updated) {
    await saveUserConceptsMap(map);
  }
}

// Note: generateId is now imported from './utils/id'
