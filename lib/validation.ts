// Runtime validation schemas using Zod
// Ensures data integrity when reading from storage

import { z } from 'zod';
import { logValidationWarning } from './logger';

// ============ Concept Status ============

export const ConceptStatusSchema = z.enum([
  'unexplored',
  'explored',
  'resonates',
  'not_for_me',
  'curious',
]);

export type ValidatedConceptStatus = z.infer<typeof ConceptStatusSchema>;

// ============ User Goal ============

export const UserGoalSchema = z.enum([
  'self_discovery',
  'partner_communication',
  'expanding_knowledge',
]);

export type ValidatedUserGoal = z.infer<typeof UserGoalSchema>;

// ============ User Concept Row ============

export const UserConceptRowSchema = z.object({
  concept_id: z.string().min(1),
  status: ConceptStatusSchema.default('unexplored'),
  is_unlocked: z.number().int().min(0).max(1).default(0),
  is_mastered: z.number().int().min(0).max(1).default(0),
  explored_at: z.string().nullable(),
  updated_at: z.string(),
});

export type ValidatedUserConceptRow = z.infer<typeof UserConceptRowSchema>;

// ============ Onboarding Row ============

export const OnboardingRowSchema = z.object({
  completed: z.number().int().min(0).max(1).default(0),
  goal: z.string().nullable(),
  first_concept_viewed: z.number().int().min(0).max(1).default(0),
});

export type ValidatedOnboardingRow = z.infer<typeof OnboardingRowSchema>;

// ============ Journal Entry Row ============

export const JournalEntryRowSchema = z.object({
  id: z.string().min(1),
  concept_id: z.string().nullable(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ValidatedJournalEntryRow = z.infer<typeof JournalEntryRowSchema>;

// ============ Pathway Progress Row ============

export const PathwayProgressRowSchema = z.object({
  pathway_id: z.string().min(1),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  concepts_completed: z.string().default('[]'), // JSON array stored as string
});

export type ValidatedPathwayProgressRow = z.infer<typeof PathwayProgressRowSchema>;

// ============ Validation Helpers ============

/**
 * Validates data and returns the parsed result.
 * Throws ZodError if validation fails.
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validates data and returns a result object.
 * Never throws - returns success/error state instead.
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Validates data with a fallback value on failure.
 * Logs warning but doesn't throw.
 */
export function validateWithFallback<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback: T,
  context?: string
): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  const issues = result.error.issues.map(i => ({
    path: i.path.join('.'),
    message: i.message,
  }));
  logValidationWarning(context ?? 'unknown', issues);
  return fallback;
}

/**
 * Validates an array of items, filtering out invalid entries.
 * Returns only valid items with warnings for invalid ones.
 */
export function validateArray<T>(
  schema: z.ZodSchema<T>,
  data: unknown[],
  context?: string
): T[] {
  const validItems: T[] = [];

  for (let i = 0; i < data.length; i++) {
    const result = schema.safeParse(data[i]);
    if (result.success) {
      validItems.push(result.data);
    } else {
      const issues = result.error.issues.map(issue => ({
        path: `[${i}].${issue.path.join('.')}`,
        message: issue.message,
      }));
      logValidationWarning(context ?? 'unknown', issues);
    }
  }

  return validItems;
}

// ============ Default Values ============

export const DEFAULT_USER_CONCEPT: ValidatedUserConceptRow = {
  concept_id: '',
  status: 'unexplored',
  is_unlocked: 0,
  is_mastered: 0,
  explored_at: null,
  updated_at: new Date().toISOString(),
};

export const DEFAULT_ONBOARDING: ValidatedOnboardingRow = {
  completed: 0,
  goal: null,
  first_concept_viewed: 0,
};

export const DEFAULT_JOURNAL_ENTRY: ValidatedJournalEntryRow = {
  id: '',
  concept_id: null,
  content: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_PATHWAY_PROGRESS: ValidatedPathwayProgressRow = {
  pathway_id: '',
  started_at: new Date().toISOString(),
  completed_at: null,
  concepts_completed: '[]',
};
