// Platform-specific database module
// Metro bundler resolves to .native.ts or .web.ts at runtime
// This file provides TypeScript types and re-exports for IDE support


// Type definitions (shared between platforms)
export interface OnboardingRow {
  completed: number;
  goal: string | null;
  first_concept_viewed: number;
}

export interface UserConceptRow {
  concept_id: string;
  status: string;
  explored_at: string | null;
  updated_at: string;
}

export interface JournalEntryRow {
  id: string;
  concept_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

// Re-export from platform-specific implementation
// Note: Metro bundler will resolve the actual implementation at build time
export {
  clearAllData, createJournalEntry, deleteJournalEntry, getAllPathwayProgress, getAllUserConcepts, getDatabase, getExploredCount, getJournalEntries,
  getJournalEntriesForConcept, getOnboardingState, getPathwayProgress, getResonatesCount, getSetting, getUserConcept, initDatabase, markConceptExplored, setSetting, startPathway, updateConceptStatus, updateJournalEntry, updateOnboarding, updatePathwayProgress
} from './databaseImpl';

export type { PathwayProgressRow } from './databaseImpl';
