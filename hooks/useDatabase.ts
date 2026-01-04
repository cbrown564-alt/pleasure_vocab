// React hooks for database operations

import {
  clearAllData,
  createJournalEntry,
  deleteJournalEntry,
  getAllUserConcepts,
  getDatabase,
  getExploredCount,
  getJournalEntries,
  getJournalEntriesForConcept,
  getOnboardingState,
  getResonatesCount,
  getUserConcept,
  JournalEntryRow,
  markConceptExplored,
  OnboardingRow,
  updateConceptStatus,
  updateJournalEntry,
  updateOnboarding,
  UserConceptRow,
} from '@/lib/database';
import { ComfortLevel, ConceptStatus, UserGoal } from '@/types';
import { useCallback, useEffect, useState } from 'react';

// ============ Database Initialization ============

export function useInitDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await getDatabase();
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

import { events, EVENTS } from '@/lib/events';

// ... (imports)

// ============ Onboarding Hook ============

export function useOnboarding() {
  const [state, setState] = useState<OnboardingRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await getOnboardingState();
    setState(result);
    setIsLoading(false);
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
      comfortLevel?: ComfortLevel;
      firstConceptViewed?: boolean;
    }) => {
      await updateOnboarding(updates);
      events.emit(EVENTS.ONBOARDING_UPDATED);
      await load(); // optional since listener catches it, but immediate consistency is good
    },
    [load]
  );

  const completeOnboarding = useCallback(async () => {
    await update({ completed: true });
  }, [update]);

  return {
    state,
    isLoading,
    isCompleted: state?.completed === 1,
    goal: state?.goal as UserGoal | null,
    comfortLevel: (state?.comfort_level ?? 'direct') as ComfortLevel,
    update,
    completeOnboarding,
    reload: load,
  };
}

// ============ User Concepts Hook ============

export function useUserConcepts() {
  const [concepts, setConcepts] = useState<UserConceptRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await getAllUserConcepts();
    setConcepts(result);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = useCallback(
    async (conceptId: string, status: ConceptStatus) => {
      await updateConceptStatus(conceptId, status);
      await load();
    },
    [load]
  );

  const markExplored = useCallback(
    async (conceptId: string) => {
      await markConceptExplored(conceptId);
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

  return {
    concepts,
    isLoading,
    setStatus,
    markExplored,
    getStatus,
    reload: load,
  };
}

// Hook for a single concept's user data
export function useUserConcept(conceptId: string) {
  const [concept, setConcept] = useState<UserConceptRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await getUserConcept(conceptId);
    setConcept(result);
    setIsLoading(false);
  }, [conceptId]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = useCallback(
    async (status: ConceptStatus) => {
      await updateConceptStatus(conceptId, status);
      await load();
    },
    [conceptId, load]
  );

  const markExplored = useCallback(async () => {
    await markConceptExplored(conceptId);
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
  const [entries, setEntries] = useState<JournalEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = conceptId
      ? await getJournalEntriesForConcept(conceptId)
      : await getJournalEntries();
    setEntries(result);
    setIsLoading(false);
  }, [conceptId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (content: string, entryConceptId?: string) => {
      const id = await createJournalEntry(content, entryConceptId ?? conceptId);
      await load();
      return id;
    },
    [conceptId, load]
  );

  const update = useCallback(
    async (id: string, content: string) => {
      await updateJournalEntry(id, content);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteJournalEntry(id);
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
      getExploredCount(),
      getResonatesCount(),
    ]);
    setExploredCount(explored);
    setResonatesCount(resonates);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
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
    await clearAllData();
    events.emit(EVENTS.DATA_CLEARED);
    setIsClearing(false);
  }, []);

  return { clear, isClearing };
}
