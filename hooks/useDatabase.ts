// React hooks for database operations
// Uses the repository pattern for cleaner data access

import { db, initDatabase } from '@/lib/database/index';
import { getErrorMessage } from '@/lib/errors';
import { events, EVENTS } from '@/lib/events';
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

export function useInitDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await initDatabase();
        if (mounted) {
          setIsReady(true);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error('Failed to initialize database'));
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return { isReady, error };
}

// ============ Onboarding Hook ============

export function useOnboarding() {
  const [state, setState] = useState<ValidatedOnboardingRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await db.onboarding.get();
      setState(result);
    } catch (err) {
      const message = getErrorMessage(err);
      log.error('useOnboarding load failed', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    events.on(EVENTS.ONBOARDING_UPDATED, handleUpdate);
    events.on(EVENTS.DATA_CLEARED, handleUpdate);

    return () => {
      events.off(EVENTS.ONBOARDING_UPDATED, handleUpdate);
      events.off(EVENTS.DATA_CLEARED, handleUpdate);
    };
  }, [load]);

  const update = useCallback(
    async (updates: {
      completed?: boolean;
      goal?: UserGoal;
      firstConceptViewed?: boolean;
    }) => {
      await db.onboarding.update(updates);
      events.emit(EVENTS.ONBOARDING_UPDATED);
      await load();
    },
    [load]
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
    reload: load,
  };
}

// ============ User Concepts Hook ============

export function useUserConcepts() {
  const [concepts, setConcepts] = useState<ValidatedUserConceptRow[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [conceptsResult, unlocked, mastered] = await Promise.all([
        db.concepts.getAll(),
        db.concepts.getUnlockedIds(),
        db.concepts.getMasteredIds(),
      ]);
      setConcepts(conceptsResult);
      setUnlockedIds(unlocked);
      setMasteredIds(mastered);
    } catch (err) {
      const message = getErrorMessage(err);
      log.error('useUserConcepts load failed', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    events.on(EVENTS.CONCEPTS_UPDATED, handleUpdate);
    events.on(EVENTS.DATA_CLEARED, handleUpdate);

    return () => {
      events.off(EVENTS.CONCEPTS_UPDATED, handleUpdate);
      events.off(EVENTS.DATA_CLEARED, handleUpdate);
    };
  }, [load]);

  const setStatus = useCallback(
    async (conceptId: string, status: ConceptStatus) => {
      await db.concepts.updateStatus(conceptId, status);
      events.emit(EVENTS.CONCEPTS_UPDATED);
      await load();
    },
    [load]
  );

  const markExplored = useCallback(
    async (conceptId: string) => {
      await db.concepts.markExplored(conceptId);
      events.emit(EVENTS.CONCEPTS_UPDATED);
      await load();
    },
    [load]
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
      events.emit(EVENTS.CONCEPTS_UPDATED);
      await load();
    },
    [load]
  );

  const masterConcept = useCallback(
    async (conceptId: string) => {
      await db.concepts.master(conceptId);
      events.emit(EVENTS.CONCEPTS_UPDATED);
      await load();
    },
    [load]
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
    reload: load,
  };
}

// Hook for a single concept's user data
export function useUserConcept(conceptId: string) {
  const [concept, setConcept] = useState<ValidatedUserConceptRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await db.concepts.get(conceptId);
    setConcept(result);
    setIsLoading(false);
  }, [conceptId]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = useCallback(
    async (status: ConceptStatus) => {
      await db.concepts.updateStatus(conceptId, status);
      await load();
    },
    [conceptId, load]
  );

  const markExplored = useCallback(async () => {
    await db.concepts.markExplored(conceptId);
    await load();
  }, [conceptId, load]);

  return {
    concept,
    status: (concept?.status as ConceptStatus) ?? 'unexplored',
    isLoading,
    setStatus,
    markExplored,
    reload: load,
  };
}

// ============ Journal Hook ============

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

export function useStats() {
  const [exploredCount, setExploredCount] = useState(0);
  const [resonatesCount, setResonatesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [explored, resonates] = await Promise.all([
      db.concepts.getExploredCount(),
      db.concepts.getResonatesCount(),
    ]);
    setExploredCount(explored);
    setResonatesCount(resonates);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    events.on(EVENTS.CONCEPTS_UPDATED, handleUpdate);
    events.on(EVENTS.DATA_CLEARED, handleUpdate);

    return () => {
      events.off(EVENTS.CONCEPTS_UPDATED, handleUpdate);
      events.off(EVENTS.DATA_CLEARED, handleUpdate);
    };
  }, [load]);

  return {
    exploredCount,
    resonatesCount,
    isLoading,
    reload: load,
  };
}

// ============ Clear Data Hook ============

export function useClearData() {
  const [isClearing, setIsClearing] = useState(false);

  const clear = useCallback(async () => {
    setIsClearing(true);
    await db.clearAll();
    events.emit(EVENTS.DATA_CLEARED);
    setIsClearing(false);
  }, []);

  return { clear, isClearing };
}

// ============ Re-export types for backward compatibility ============

export type { ValidatedJournalEntryRow as JournalEntryRow } from '@/lib/validation';
export type { ValidatedOnboardingRow as OnboardingRow } from '@/lib/validation';
export type { ValidatedUserConceptRow as UserConceptRow } from '@/lib/validation';
