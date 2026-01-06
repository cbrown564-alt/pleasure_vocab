// Tests for validation schemas and helper functions

import {
  ConceptStatusSchema,
  UserGoalSchema,
  UserConceptRowSchema,
  OnboardingRowSchema,
  JournalEntryRowSchema,
  PathwayProgressRowSchema,
  validate,
  validateSafe,
  validateWithFallback,
  validateArray,
  DEFAULT_USER_CONCEPT,
  DEFAULT_ONBOARDING,
  DEFAULT_JOURNAL_ENTRY,
  DEFAULT_PATHWAY_PROGRESS,
} from '@/lib/validation';

describe('ConceptStatusSchema', () => {
  const validStatuses = ['unexplored', 'explored', 'resonates', 'not_for_me', 'curious'];

  it.each(validStatuses)('should accept valid status: %s', (status) => {
    expect(ConceptStatusSchema.safeParse(status).success).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = ConceptStatusSchema.safeParse('invalid_status');
    expect(result.success).toBe(false);
  });

  it('should reject empty string', () => {
    const result = ConceptStatusSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('should reject null', () => {
    const result = ConceptStatusSchema.safeParse(null);
    expect(result.success).toBe(false);
  });
});

describe('UserGoalSchema', () => {
  const validGoals = ['self_discovery', 'partner_communication', 'expanding_knowledge'];

  it.each(validGoals)('should accept valid goal: %s', (goal) => {
    expect(UserGoalSchema.safeParse(goal).success).toBe(true);
  });

  it('should reject invalid goal', () => {
    const result = UserGoalSchema.safeParse('invalid_goal');
    expect(result.success).toBe(false);
  });
});

describe('UserConceptRowSchema', () => {
  const validConcept = {
    concept_id: 'test-concept',
    status: 'explored',
    is_unlocked: 1,
    is_mastered: 0,
    explored_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('should accept valid concept data', () => {
    const result = UserConceptRowSchema.safeParse(validConcept);
    expect(result.success).toBe(true);
  });

  it('should apply default values for optional fields', () => {
    const minimal = {
      concept_id: 'test',
      explored_at: null,
      updated_at: '2024-01-01T00:00:00Z',
    };
    const result = UserConceptRowSchema.parse(minimal);
    expect(result.status).toBe('unexplored');
    expect(result.is_unlocked).toBe(0);
    expect(result.is_mastered).toBe(0);
  });

  it('should reject empty concept_id', () => {
    const invalid = { ...validConcept, concept_id: '' };
    const result = UserConceptRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid status', () => {
    const invalid = { ...validConcept, status: 'invalid_status' };
    const result = UserConceptRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject is_unlocked outside 0-1 range', () => {
    const invalid = { ...validConcept, is_unlocked: 2 };
    const result = UserConceptRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject negative is_unlocked', () => {
    const invalid = { ...validConcept, is_unlocked: -1 };
    const result = UserConceptRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject is_mastered outside 0-1 range', () => {
    const invalid = { ...validConcept, is_mastered: 5 };
    const result = UserConceptRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept null explored_at', () => {
    const data = { ...validConcept, explored_at: null };
    const result = UserConceptRowSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject non-integer is_unlocked', () => {
    const invalid = { ...validConcept, is_unlocked: 0.5 };
    const result = UserConceptRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('OnboardingRowSchema', () => {
  it('should accept valid onboarding data', () => {
    const data = {
      completed: 1,
      goal: 'self_discovery',
      first_concept_viewed: 1,
    };
    const result = OnboardingRowSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should apply defaults for missing fields', () => {
    // goal is required (nullable, not optional), so we must provide it
    const result = OnboardingRowSchema.parse({ goal: null });
    expect(result.completed).toBe(0);
    expect(result.goal).toBeNull();
    expect(result.first_concept_viewed).toBe(0);
  });

  it('should accept null goal', () => {
    const data = { completed: 0, goal: null, first_concept_viewed: 0 };
    const result = OnboardingRowSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject completed outside 0-1 range', () => {
    const invalid = { completed: 2, goal: null, first_concept_viewed: 0 };
    const result = OnboardingRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('JournalEntryRowSchema', () => {
  const validEntry = {
    id: 'entry-123',
    concept_id: 'concept-456',
    content: 'My journal entry content',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('should accept valid journal entry', () => {
    const result = JournalEntryRowSchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('should accept null concept_id', () => {
    const data = { ...validEntry, concept_id: null };
    const result = JournalEntryRowSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject empty id', () => {
    const invalid = { ...validEntry, id: '' };
    const result = JournalEntryRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept empty content', () => {
    const data = { ...validEntry, content: '' };
    const result = JournalEntryRowSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalid = { id: 'entry-123' };
    const result = JournalEntryRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('PathwayProgressRowSchema', () => {
  const validProgress = {
    pathway_id: 'pathway-123',
    started_at: '2024-01-01T00:00:00Z',
    completed_at: null,
    concepts_completed: '["concept-1", "concept-2"]',
  };

  it('should accept valid pathway progress', () => {
    const result = PathwayProgressRowSchema.safeParse(validProgress);
    expect(result.success).toBe(true);
  });

  it('should apply default for concepts_completed', () => {
    const data = {
      pathway_id: 'pathway-123',
      started_at: '2024-01-01T00:00:00Z',
      completed_at: null,
    };
    const result = PathwayProgressRowSchema.parse(data);
    expect(result.concepts_completed).toBe('[]');
  });

  it('should accept completed_at as string', () => {
    const data = { ...validProgress, completed_at: '2024-01-15T00:00:00Z' };
    const result = PathwayProgressRowSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject empty pathway_id', () => {
    const invalid = { ...validProgress, pathway_id: '' };
    const result = PathwayProgressRowSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('validate', () => {
  it('should return parsed data on success', () => {
    const data = { completed: 1, goal: 'self_discovery', first_concept_viewed: 0 };
    const result = validate(OnboardingRowSchema, data);
    expect(result).toEqual(data);
  });

  it('should throw on invalid data', () => {
    const invalid = { completed: 5 };
    expect(() => validate(OnboardingRowSchema, invalid)).toThrow();
  });
});

describe('validateSafe', () => {
  it('should return success object for valid data', () => {
    const data = { completed: 0, goal: null, first_concept_viewed: 0 };
    const result = validateSafe(OnboardingRowSchema, data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it('should return error object for invalid data', () => {
    const invalid = { completed: 'invalid' };
    const result = validateSafe(OnboardingRowSchema, invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });
});

describe('validateWithFallback', () => {
  it('should return parsed data on success', () => {
    const data = { completed: 1, goal: null, first_concept_viewed: 1 };
    const result = validateWithFallback(OnboardingRowSchema, data, DEFAULT_ONBOARDING);
    expect(result).toEqual(data);
  });

  it('should return fallback on failure', () => {
    const invalid = { completed: 'invalid' };
    const result = validateWithFallback(OnboardingRowSchema, invalid, DEFAULT_ONBOARDING);
    expect(result).toEqual(DEFAULT_ONBOARDING);
  });

  it('should apply defaults when fields are missing', () => {
    const partial = {};
    const result = validateWithFallback(OnboardingRowSchema, partial, DEFAULT_ONBOARDING);
    expect(result.completed).toBe(0);
    expect(result.goal).toBeNull();
  });
});

describe('validateArray', () => {
  it('should return all valid items', () => {
    const data = [
      { completed: 0, goal: null, first_concept_viewed: 0 },
      { completed: 1, goal: 'self_discovery', first_concept_viewed: 1 },
    ];
    const result = validateArray(OnboardingRowSchema, data);
    expect(result).toHaveLength(2);
  });

  it('should filter out invalid items', () => {
    const data = [
      { completed: 0, goal: null, first_concept_viewed: 0 },
      { completed: 'invalid' }, // invalid
      { completed: 1, goal: null, first_concept_viewed: 1 },
    ];
    const result = validateArray(OnboardingRowSchema, data);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when all items invalid', () => {
    const data = [
      { completed: 'invalid' },
      { completed: 5 },
    ];
    const result = validateArray(OnboardingRowSchema, data);
    expect(result).toHaveLength(0);
  });

  it('should return empty array for empty input', () => {
    const result = validateArray(OnboardingRowSchema, []);
    expect(result).toHaveLength(0);
  });
});

describe('Default values', () => {
  it('DEFAULT_USER_CONCEPT should be valid', () => {
    // Need to set updated_at as it uses new Date()
    const concept = { ...DEFAULT_USER_CONCEPT, concept_id: 'test' };
    const result = UserConceptRowSchema.safeParse(concept);
    expect(result.success).toBe(true);
  });

  it('DEFAULT_ONBOARDING should be valid', () => {
    const result = OnboardingRowSchema.safeParse(DEFAULT_ONBOARDING);
    expect(result.success).toBe(true);
  });

  it('DEFAULT_JOURNAL_ENTRY should be valid with required fields', () => {
    const entry = { ...DEFAULT_JOURNAL_ENTRY, id: 'test' };
    const result = JournalEntryRowSchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it('DEFAULT_PATHWAY_PROGRESS should be valid with required fields', () => {
    const progress = { ...DEFAULT_PATHWAY_PROGRESS, pathway_id: 'test' };
    const result = PathwayProgressRowSchema.safeParse(progress);
    expect(result.success).toBe(true);
  });
});
