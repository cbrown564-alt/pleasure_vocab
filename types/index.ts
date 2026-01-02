// Type definitions for Pleasure Vocabulary Builder

// Concept status - tracks user's relationship with each vocabulary concept
export type ConceptStatus =
  | 'unexplored'    // Haven't looked at this concept yet
  | 'explored'      // Read but haven't indicated resonance
  | 'resonates'     // This concept resonates with user
  | 'not_for_me'    // Doesn't resonate with user
  | 'curious';      // Curious to explore more

// Category of vocabulary concepts
export type ConceptCategory =
  | 'technique'     // Physical techniques (Angling, Rocking, etc.)
  | 'sensation'     // How things feel (building, spreading, etc.)
  | 'timing'        // Pacing and timing concepts
  | 'psychological'; // Mental/emotional factors

// Tier for future paywall
export type ConceptTier = 'free' | 'premium';

// A vocabulary concept
export interface Concept {
  id: string;
  name: string;
  category: ConceptCategory;
  definition: string;           // Short one-line definition
  description: string;          // Detailed explanation
  researchBasis: string;        // Research backing this concept
  source: string;               // Citation
  recognitionPrompts: string[]; // "Have you noticed..." questions
  relatedConcepts: string[];    // IDs of related concepts
  tier: ConceptTier;
}

// User's tracked state for a concept
export interface UserConcept {
  id: string;
  conceptId: string;
  status: ConceptStatus;
  exploredAt: string | null;    // ISO date string
  updatedAt: string;            // ISO date string
}

// Journal entry
export interface JournalEntry {
  id: string;
  conceptId: string | null;     // Optional link to a concept
  content: string;
  createdAt: string;            // ISO date string
  updatedAt: string;            // ISO date string
}

// User's goal selection during onboarding
export type UserGoal =
  | 'self_discovery'          // Understanding own preferences
  | 'partner_communication'   // Better communication with partners
  | 'expanding_knowledge';    // General learning

// Content comfort level
export type ComfortLevel =
  | 'clinical'    // More medical/clinical language
  | 'balanced'    // Mix of clinical and casual
  | 'direct';     // Warm and direct language

// Onboarding state
export interface OnboardingState {
  completed: boolean;
  goal: UserGoal | null;
  comfortLevel: ComfortLevel | null;
  firstConceptViewed: boolean;
}

// User settings
export interface UserSettings {
  appLockEnabled: boolean;
  onboardingCompleted: boolean;
  goal: UserGoal | null;
  comfortLevel: ComfortLevel;
}

// Navigation params
export type RootStackParamList = {
  '(tabs)': undefined;
  'onboarding/welcome': undefined;
  'onboarding/privacy': undefined;
  'onboarding/goals': undefined;
  'onboarding/comfort': undefined;
  'onboarding/first-concept': undefined;
  'concept/[id]': { id: string };
  modal: undefined;
};
