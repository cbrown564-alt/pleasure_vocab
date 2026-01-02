// Platform-specific database module
// Metro bundler resolves to .native.ts or .web.ts at runtime
// This file provides TypeScript types and re-exports for IDE support

import { Platform } from 'react-native';

// Type definitions (shared between platforms)
export interface OnboardingRow {
  completed: number;
  goal: string | null;
  comfort_level: string;
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
  initDatabase,
  getDatabase,
  getSetting,
  setSetting,
  getOnboardingState,
  updateOnboarding,
  getUserConcept,
  getAllUserConcepts,
  updateConceptStatus,
  markConceptExplored,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  getJournalEntriesForConcept,
  getExploredCount,
  getResonatesCount,
  clearAllData,
} from './database.native';
