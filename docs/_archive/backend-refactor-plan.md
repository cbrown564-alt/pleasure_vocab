# Backend Refactoring Plan

This plan addresses the issues identified in `backend-refactor-notes.md` and additional complexity discovered during codebase analysis. The goal is to reduce backend complexity, improve robustness, and create a more maintainable architecture.

---

## Executive Summary

**Current State**: The backend has dual state stores, duplicated platform logic, silent failures, and fragile event-driven synchronization.

**Target State**: Unified storage layer with a repository pattern, proper error handling, and simplified state management.

**Priority Order**:
1. Eliminate dual state stores (highest impact, moderate effort)
2. Add data validation layer (high robustness gain)
3. Unify platform adapters with shared repository (reduces duplication)
4. Improve error handling and observability
5. Add schema migrations (future-proofing)

---

## Phase 1: Eliminate Dual State Stores

### Problem
Two parallel tracking systems exist:
- **Primary**: `user_concepts` table (status: unexplored|explored|resonates|not_for_me|curious)
- **Secondary**: `user-store.ts` (unlockedConcepts[], masteredConcepts[])

Components like `ConceptDeck.tsx:72-106` call BOTH systems, creating redundancy and potential inconsistency.

### Solution
Extend `user_concepts` schema and consolidate all progress tracking.

### Tasks

#### 1.1 Add columns to user_concepts table
**File**: `lib/databaseImpl.native.ts:24-29`
```sql
CREATE TABLE IF NOT EXISTS user_concepts (
  concept_id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'unexplored',
  is_unlocked INTEGER DEFAULT 0,      -- NEW
  is_mastered INTEGER DEFAULT 0,      -- NEW
  explored_at TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.2 Add migration for existing data
Create migration to copy data from AsyncStorage (`user_unlocked_concepts`, `user_mastered_concepts`) into the new columns.

#### 1.3 Update web implementation
**File**: `lib/databaseImpl.web.ts:55-61`
Add `is_unlocked` and `is_mastered` fields to `UserConceptRow` interface and storage operations.

#### 1.4 Add unlock/master functions to database layer
```typescript
// lib/databaseImpl.native.ts
export async function unlockConcept(conceptId: string): Promise<void>
export async function masterConcept(conceptId: string): Promise<void>
export async function isConceptUnlocked(conceptId: string): Promise<boolean>
export async function isConceptMastered(conceptId: string): Promise<boolean>
```

#### 1.5 Extend useUserConcepts hook
**File**: `hooks/useDatabase.ts:117-174`
Add `unlockConcept`, `masterConcept`, `isUnlocked`, `isMastered` methods to the hook.

#### 1.6 Remove user-store.ts
Delete `lib/user-store.ts` entirely and update all imports:
- `components/ConceptDeck.tsx`
- `app/(tabs)/index.tsx`
- Any other consumers

#### 1.7 Seed default unlocked concepts
Move default unlock logic (`['angling', 'rocking', 'shallowing']`) to database initialization.

---

## Phase 2: Add Data Validation Layer

### Problem
- Type assertions like `status as ConceptStatus` bypass runtime validation
- Invalid data in storage causes silent failures
- No schema validation for JSON blobs

### Solution
Add runtime validation using Zod schemas.

### Tasks

#### 2.1 Install Zod
```bash
npm install zod
```

#### 2.2 Create validation schemas
**New file**: `lib/validation.ts`
```typescript
import { z } from 'zod';

export const ConceptStatusSchema = z.enum([
  'unexplored', 'explored', 'resonates', 'not_for_me', 'curious'
]);

export const UserConceptSchema = z.object({
  concept_id: z.string(),
  status: ConceptStatusSchema,
  is_unlocked: z.boolean().default(false),
  is_mastered: z.boolean().default(false),
  explored_at: z.string().nullable(),
  updated_at: z.string(),
});

export const OnboardingSchema = z.object({
  completed: z.number().int().min(0).max(1),
  goal: z.string().nullable(),
  first_concept_viewed: z.number().int().min(0).max(1),
});

export const JournalEntrySchema = z.object({
  id: z.string(),
  concept_id: z.string().nullable(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
```

#### 2.3 Wrap database reads with validation
```typescript
export async function getUserConcept(conceptId: string): Promise<UserConcept | null> {
  const raw = await db.getFirstAsync<unknown>(...);
  if (!raw) return null;
  return UserConceptSchema.parse(raw); // Throws if invalid
}
```

#### 2.4 Add safe parse variants for graceful degradation
```typescript
export async function getUserConceptSafe(conceptId: string): Promise<UserConcept | null> {
  const raw = await db.getFirstAsync<unknown>(...);
  const result = UserConceptSchema.safeParse(raw);
  if (!result.success) {
    console.warn('Invalid user concept data:', result.error);
    return null;
  }
  return result.data;
}
```

---

## Phase 3: Unify Platform Adapters

### Problem
`databaseImpl.native.ts` (381 lines) and `databaseImpl.web.ts` (341 lines) duplicate ~80% of business logic with only storage primitives differing.

### Solution
Create a shared repository layer with platform-specific storage adapters.

### Tasks

#### 3.1 Define storage adapter interface
**New file**: `lib/storage/adapter.ts`
```typescript
export interface StorageAdapter {
  // Primitives
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;

  // For SQLite
  query?<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute?(sql: string, params?: unknown[]): Promise<void>;
  transaction?(operations: () => Promise<void>): Promise<void>;
}
```

#### 3.2 Implement platform adapters
**New files**:
- `lib/storage/sqliteAdapter.ts` - Wraps expo-sqlite
- `lib/storage/asyncStorageAdapter.ts` - Wraps AsyncStorage

#### 3.3 Create repositories
**New file**: `lib/repositories/ConceptRepository.ts`
```typescript
export class ConceptRepository {
  constructor(private adapter: StorageAdapter) {}

  async getStatus(id: string): Promise<ConceptStatus> { ... }
  async setStatus(id: string, status: ConceptStatus): Promise<void> { ... }
  async unlock(id: string): Promise<void> { ... }
  async master(id: string): Promise<void> { ... }
  async getAll(): Promise<UserConcept[]> { ... }
}
```

Similar repositories for:
- `OnboardingRepository`
- `JournalRepository`
- `PathwayRepository`
- `SettingsRepository`

#### 3.4 Create database facade
**New file**: `lib/database/index.ts`
```typescript
import { Platform } from 'react-native';
import { SQLiteAdapter } from './storage/sqliteAdapter';
import { AsyncStorageAdapter } from './storage/asyncStorageAdapter';

const adapter = Platform.OS === 'web'
  ? new AsyncStorageAdapter()
  : new SQLiteAdapter();

export const conceptRepo = new ConceptRepository(adapter);
export const journalRepo = new JournalRepository(adapter);
// etc.
```

#### 3.5 Migrate existing code
Update hooks to use repositories instead of direct database calls.

---

## Phase 4: Improve Error Handling

### Problem
- Web adapter silently returns defaults on errors (`catch { return defaultOnboarding; }`)
- No logging or error context
- Users never know when data operations fail

### Solution
Centralized error handling with contextual logging.

### Tasks

#### 4.1 Create error types
**New file**: `lib/errors.ts`
```typescript
export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

#### 4.2 Create error logger
**New file**: `lib/logger.ts`
```typescript
export const logger = {
  error(context: string, error: unknown, meta?: Record<string, unknown>) {
    console.error(`[${context}]`, error, meta);
    // Future: send to error reporting service
  },
  warn(context: string, message: string, meta?: Record<string, unknown>) {
    console.warn(`[${context}]`, message, meta);
  },
};
```

#### 4.3 Wrap storage operations
```typescript
async function safeExecute<T>(
  operation: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logger.error('Database', error, { operation });
    return fallback;
  }
}
```

#### 4.4 Surface errors to UI
Update hooks to expose error states:
```typescript
export function useUserConcepts() {
  const [error, setError] = useState<Error | null>(null);
  // ...
  return { concepts, isLoading, error, ... };
}
```

---

## Phase 5: Replace Event Emitter with React Context

### Problem
- Manual event subscription/cleanup is fragile
- Each hook duplicates subscription pattern
- Memory leaks possible if cleanup missed

### Solution
Use React Context for cross-component state synchronization.

### Tasks

#### 5.1 Create Data Context
**New file**: `lib/contexts/DataContext.tsx`
```typescript
interface DataContextValue {
  concepts: UserConcept[];
  onboarding: OnboardingState | null;
  refreshConcepts: () => Promise<void>;
  refreshOnboarding: () => Promise<void>;
  // ... other shared state
}

export const DataContext = React.createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [concepts, setConcepts] = useState<UserConcept[]>([]);
  // ...

  const refreshConcepts = useCallback(async () => {
    const data = await conceptRepo.getAll();
    setConcepts(data);
  }, []);

  return (
    <DataContext.Provider value={{ concepts, refreshConcepts, ... }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
```

#### 5.2 Wrap app with provider
**File**: `app/_layout.tsx`
```tsx
<DataProvider>
  {/* existing layout */}
</DataProvider>
```

#### 5.3 Simplify hooks
Hooks can now use context instead of managing their own state:
```typescript
export function useUserConcepts() {
  const { concepts, refreshConcepts } = useData();
  // Just add mutation methods
}
```

#### 5.4 Remove event emitter
Delete `lib/events.ts` after migration complete.

---

## Phase 6: Improve ID Generation

### Problem
IDs use `Date.now() + random suffix` which can collide under rapid operations.

### Solution
Use UUID v4 or nanoid.

### Tasks

#### 6.1 Install nanoid
```bash
npm install nanoid
```

#### 6.2 Create ID utility
**New file**: `lib/utils/id.ts`
```typescript
import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid();
}

// For testing - allows deterministic IDs
let idGenerator = nanoid;
export function setIdGenerator(generator: () => string) {
  idGenerator = generator;
}
```

#### 6.3 Replace all generateId calls
Update both `databaseImpl.native.ts:378-380` and `databaseImpl.web.ts:339-341`.

---

## Phase 7: Add Schema Migrations

### Problem
- No versioned migrations
- Schema changes require manual intervention
- No way to upgrade existing user data

### Solution
Simple migration system.

### Tasks

#### 7.1 Create migrations table
```sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### 7.2 Create migration runner
**New file**: `lib/migrations/runner.ts`
```typescript
interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
  description: string;
}

const migrations: Migration[] = [
  {
    version: 1,
    description: 'Add unlock/master columns to user_concepts',
    up: async (db) => {
      await db.execAsync(`
        ALTER TABLE user_concepts ADD COLUMN is_unlocked INTEGER DEFAULT 0;
        ALTER TABLE user_concepts ADD COLUMN is_mastered INTEGER DEFAULT 0;
      `);
    },
  },
  // Future migrations...
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const currentVersion = await getCurrentVersion(db);
  const pending = migrations.filter(m => m.version > currentVersion);

  for (const migration of pending) {
    await migration.up(db);
    await db.runAsync(
      'INSERT INTO schema_migrations (version) VALUES (?)',
      [migration.version]
    );
  }
}
```

#### 7.3 Run migrations on init
**File**: `lib/databaseImpl.native.ts:10-62`
Add `runMigrations(db)` call after schema creation.

---

## Phase 8: Normalize Pathway Progress

### Problem
`concepts_completed` stored as JSON string requires repeated parse/stringify operations.

### Solution
Create proper junction table.

### Tasks

#### 8.1 Create junction table (via migration)
```sql
CREATE TABLE IF NOT EXISTS pathway_concept_completions (
  pathway_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (pathway_id, concept_id)
);
```

#### 8.2 Migrate existing data
Parse existing JSON arrays and insert into junction table.

#### 8.3 Update queries
```sql
-- Get completed concepts for pathway
SELECT concept_id FROM pathway_concept_completions
WHERE pathway_id = ?;

-- Check if pathway complete
SELECT COUNT(*) as completed
FROM pathway_concept_completions
WHERE pathway_id = ?;
```

#### 8.4 Add indexes
```sql
CREATE INDEX IF NOT EXISTS idx_pathway_completions_pathway
ON pathway_concept_completions(pathway_id);
```

---

## File Structure After Refactoring

```
lib/
├── database/
│   └── index.ts              # Main export facade
├── storage/
│   ├── adapter.ts            # Interface
│   ├── sqliteAdapter.ts      # Native implementation
│   └── asyncStorageAdapter.ts # Web implementation
├── repositories/
│   ├── ConceptRepository.ts
│   ├── JournalRepository.ts
│   ├── OnboardingRepository.ts
│   ├── PathwayRepository.ts
│   └── SettingsRepository.ts
├── contexts/
│   └── DataContext.tsx       # Shared state context
├── migrations/
│   ├── runner.ts
│   └── migrations/           # Individual migration files
├── validation.ts             # Zod schemas
├── errors.ts                 # Error types
├── logger.ts                 # Logging utility
└── utils/
    └── id.ts                 # ID generation
```

---

## Implementation Order

| Phase | Effort | Impact | Dependencies |
|-------|--------|--------|--------------|
| 1. Dual stores | Medium | High | None |
| 2. Validation | Low | Medium | None |
| 6. ID generation | Low | Low | None |
| 4. Error handling | Low | Medium | None |
| 7. Migrations | Medium | Medium | Phase 1 |
| 3. Repository pattern | High | High | Phase 1, 2 |
| 5. Context API | Medium | Medium | Phase 3 |
| 8. Pathway normalization | Medium | Low | Phase 7 |

**Recommended approach**: Complete Phases 1, 2, 6, 4 first (quick wins), then tackle 7, 3, 5, 8.

---

## Testing Strategy

1. **Unit tests** for validation schemas
2. **Unit tests** for repositories (mock storage adapter)
3. **Integration tests** for migrations (use in-memory SQLite)
4. **E2E tests** for critical flows (onboarding → concept view → journal)

---

## Rollback Plan

Each phase should be independently deployable. If issues arise:
1. Feature flag new code paths
2. Keep old implementations until new ones are verified
3. Migration rollbacks via down() methods

---

## Success Metrics

- [ ] Single source of truth for concept progress
- [ ] Zero silent failures (all errors logged)
- [ ] <100 lines per platform adapter (down from ~350)
- [ ] All data reads validated
- [ ] Migrations run automatically on app update
