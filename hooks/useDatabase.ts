// React hooks for database operations
// Uses DataContext for shared state and repository pattern for data access

import { db } from '@/lib/database/index';
import { useData } from '@/lib/contexts';
import { getErrorMessage } from '@/lib/errors';
import { logger } from '@/lib/logger';
import {
  ValidatedJournalEntryRow,
  ValidatedOnboardingRow,
  ValidatedUserConceptRow,
} from '@/lib/validation';
import { ConceptStatus, UserGoal } from '@/types';
import { useCallback, useEffect, useState } from 'react';

const log = logger.scope('Hooks');

// ============ Database Initialization ============

/**
 * Hook for database initialization status.
 * Uses the DataContext for shared state.
 */
export function useInitDatabase() {
  const { isDbReady, dbError } = useData();
  return { isReady: isDbReady, error: dbError };
}

// ============ Onboarding Hook ============

/**
 * Hook for onboarding state with update capabilities.
 * Uses DataContext for shared state and triggers context refresh on mutations.
 */
export function useOnboarding() {
  const {
    onboarding: state,
    onboardingLoading: isLoading,
    onboardingError: error,
    refreshOnboarding,
    refreshAll,
  } = useData();

  const update = useCallback(
    async (updates: {
      completed?: boolean;
      goal?: UserGoal;
      firstConceptViewed?: boolean;
    }) => {
      await db.onboarding.update(updates);
      await refreshOnboarding();
    },
    [refreshOnboarding]
  );

  const completeOnboarding = useCallback(async () => {
    await update({ completed: true });
  }, [update]);

  return {
    state,
    isLoading,
    error,
    isCompleted: state?.completed === 1,
    goal: state?.goal as UserGoal | null,
    update,
    completeOnboarding,
    reload: refreshOnboarding,
  };
}

// ============ User Concepts Hook ============

/**
 * Hook for user concepts with CRUD operations.
 * Uses DataContext for shared state and triggers context refresh on mutations.
 */
export function useUserConcepts() {
  const {
    concepts,
    unlockedIds,
    masteredIds,
    conceptsLoading: isLoading,
    conceptsError: error,
    refreshConcepts,
  } = useData();

  const setStatus = useCallback(
    async (conceptId: string, status: ConceptStatus) => {
      await db.concepts.updateStatus(conceptId, status);
      await refreshConcepts();
    },
    [refreshConcepts]
  );

  const markExplored = useCallback(
    async (conceptId: string) => {
      await db.concepts.markExplored(conceptId);
      await refreshConcepts();
    },
    [refreshConcepts]
  );

  const getStatus = useCallback(
    (conceptId: string): ConceptStatus => {
      const concept = concepts.find((c) => c.concept_id === conceptId);
      return (concept?.status as ConceptStatus) ?? 'unexplored';
    },
    [concepts]
  );

  const unlockConcept = useCallback(
    async (conceptId: string) => {
      await db.concepts.unlock(conceptId);
      await refreshConcepts();
    },
    [refreshConcepts]
  );

  const masterConcept = useCallback(
    async (conceptId: string) => {
      await db.concepts.master(conceptId);
      await refreshConcepts();
    },
    [refreshConcepts]
  );

  const isUnlocked = useCallback(
    (conceptId: string): boolean => {
      return unlockedIds.includes(conceptId);
    },
    [unlockedIds]
  );

  const isMastered = useCallback(
    (conceptId: string): boolean => {
      return masteredIds.includes(conceptId);
    },
    [masteredIds]
  );

  return {
    concepts,
    isLoading,
    error,
    setStatus,
    markExplored,
    getStatus,
    unlockConcept,
    masterConcept,
    isUnlocked,
    isMastered,
    unlockedConcepts: unlockedIds,
    masteredConcepts: masteredIds,
    reload: refreshConcepts,
  };
}

// Hook for a single concept's user data
export function useUserConcept(conceptId: string) {
  const { concepts, refreshConcepts } = useData();
  const [isLoading, setIsLoading] = useState(false);

  // Find the concept from the shared state
  const concept = concepts.find((c) => c.concept_id === conceptId) ?? null;

  const setStatus = useCallback(
    async (status: ConceptStatus) => {
      setIsLoading(true);
      await db.concepts.updateStatus(conceptId, status);
      await refreshConcepts();
      setIsLoading(false);
    },
    [conceptId, refreshConcepts]
  );

  const markExplored = useCallback(async () => {
    setIsLoading(true);
    await db.concepts.markExplored(conceptId);
    await refreshConcepts();
    setIsLoading(false);
  }, [conceptId, refreshConcepts]);

  return {
    concept,
    status: (concept?.status as ConceptStatus) ?? 'unexplored',
    isLoading,
    setStatus,
    markExplored,
    reload: refreshConcepts,
  };
}

// ============ Journal Hook ============

/**
 * Hook for journal entries.
 * Journal entries are not in the shared context as they're less frequently
 * accessed across components. Uses local state with repository pattern.
 */
export function useJournal(conceptId?: string) {
  const [entries, setEntries] = useState<ValidatedJournalEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = conceptId
      ? await db.journal.getForConcept(conceptId)
      : await db.journal.getAll();
    setEntries(result);
    setIsLoading(false);
  }, [conceptId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (content: string, entryConceptId?: string) => {
      const id = await db.journal.create(content, entryConceptId ?? conceptId);
      await load();
      return id;
    },
    [conceptId, load]
  );

  const update = useCallback(
    async (id: string, content: string) => {
      await db.journal.update(id, content);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await db.journal.delete(id);
      await load();
    },
    [load]
  );

  return {
    entries,
    isLoading,
    create,
    update,
    remove,
    reload: load,
  };
}

// ============ Stats Hook ============

/**
 * Hook for stats.
 * Uses computed values from DataContext.
 */
export function useStats() {
  const { exploredCount, resonatesCount, conceptsLoading, refreshConcepts } = useData();

  return {
    exploredCount,
    resonatesCount,
    isLoading: conceptsLoading,
    reload: refreshConcepts,
  };
}

// ============ Clear Data Hook ============

/**
 * Hook for clearing all data.
 * Triggers context refresh after clearing.
 */
export function useClearData() {
  const { refreshAll } = useData();
  const [isClearing, setIsClearing] = useState(false);

  const clear = useCallback(async () => {
    setIsClearing(true);
    await db.clearAll();
    await refreshAll();
    setIsClearing(false);
  }, [refreshAll]);

  return { clear, isClearing };
}

// ============ Re-export types for backward compatibility ============

export type { ValidatedJournalEntryRow as JournalEntryRow } from '@/lib/validation';
export type { ValidatedOnboardingRow as OnboardingRow } from '@/lib/validation';
export type { ValidatedUserConceptRow as UserConceptRow } from '@/lib/validation';
