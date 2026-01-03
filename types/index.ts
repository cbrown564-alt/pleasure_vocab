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
  | 'psychological' // Mental/emotional factors
  | 'anatomy';      // Body understanding and anatomy

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

// Learning pathway
export interface Pathway {
  id: string;
  name: string;
  description: string;
  icon: string;              // Ionicons icon name
  conceptIds: string[];      // Ordered sequence of concept IDs
  estimatedTime: string;     // e.g., "15-20 min"
}

// Pathway progress tracking
export interface PathwayProgress {
  pathwayId: string;
  startedAt: string;         // ISO date string
  completedAt: string | null; // ISO date string when all concepts explored
  conceptsCompleted: string[]; // IDs of completed concepts in this pathway
}

// Conversation starter for communication toolkit
export interface ConversationStarter {
  id: string;
  situation: string;         // e.g., "Introducing a new preference"
  comfortLevels: {
    clinical: string;
    balanced: string;
    direct: string;
  };
  tips: string[];
}

// Script example for communication toolkit
export interface ScriptExample {
  id: string;
  category: string;          // e.g., "Requesting change", "Positive feedback"
  opening: string;           // The script text
  context: string;           // When to use this
}

// Barrier/fear with reassurance
export interface CommunicationBarrier {
  id: string;
  fear: string;              // What people worry about
  percentage: number;        // How common (e.g., 42.4)
  reassurance: string;       // Research-backed response
  tips: string[];
}

// Research explainer - accessible science summary
export interface ResearchExplainer {
  id: string;
  title: string;
  subtitle: string;          // One-line hook
  icon: string;              // Ionicons icon name
  readTime: string;          // e.g., "5 min read"

  // Content sections
  overview: string;          // 2-3 sentence intro
  keyTakeaways: string[];    // 3-5 bullet points

  // Main content sections
  sections: {
    title: string;
    content: string;         // 2-3 paragraphs
    statistic?: {
      value: string;
      label: string;
      source: string;
    };
  }[];

  // Misconceptions
  misconceptions: {
    myth: string;
    fact: string;
  }[];

  // Research sources
  keySources: {
    citation: string;
    finding: string;
  }[];

  // Linking
  relatedConceptIds: string[];
  relatedExplainerIds: string[];

  tier: ConceptTier;
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
