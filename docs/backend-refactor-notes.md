# Backend refactor opportunities

This repository persists user state locally via platform-specific adapters in `lib/databaseImpl.native.ts` (SQLite) and `lib/databaseImpl.web.ts` (AsyncStorage), plus a smaller store in `lib/user-store.ts`. Below are considerations and pathways to reduce complexity and improve performance.

## Unify storage abstractions
- **Problem:** Platform files duplicate most CRUD logic, diverging in edge-case handling and defaults. For example, onboarding and pathway updates are implemented separately across native and web.【F:lib/databaseImpl.native.ts†L46-L195】【F:lib/databaseImpl.web.ts†L26-L181】
- **Pathway:** Introduce a shared repository layer that encapsulates table/key names, serialization, and validation. Platform adapters would only supply persistence primitives (query/transaction vs. get/set), reducing duplicated domain logic and easing future schema changes.

## Harden data consistency
- **Problem:** Native writes run as independent statements without transactions, so multi-step updates (e.g., onboarding update) can leave partial state on failure. Web writes lack conflict safeguards or input validation, and JSON blobs are parsed repeatedly.【F:lib/databaseImpl.native.ts†L77-L141】【F:lib/databaseImpl.web.ts†L78-L123】
- **Pathway:** Wrap multi-field updates in transactions; add basic validation and coercion for enum-backed columns (e.g., `ConceptStatus`, `ComfortLevel`). On web, normalize read/write helpers to parse once per operation and guard against invalid JSON to avoid runtime errors.

## Improve performance of frequent paths
- **Problem:** Stats and progress queries scan full tables/objects and repeatedly JSON-parse `concepts_completed`. Journal lookups and concept status updates do not leverage indexes or batching.【F:lib/databaseImpl.native.ts†L176-L236】【F:lib/databaseImpl.web.ts†L138-L212】
- **Pathway:** Add indexes on `user_concepts.status`, `journal_entries.concept_id`, and `pathway_progress.pathway_id`. Cache parsed pathway progress in memory during a session, and expose batched fetch/update APIs to minimize round-trips and JSON churn on web.

## Strengthen schema evolution and migration
- **Problem:** Schema initialization is implicit; there are no versioned migrations, and `clearAllData` manually resets rows without vacuuming or pragma tuning. Web storage lacks schema version checks.【F:lib/databaseImpl.native.ts†L18-L73】【F:lib/databaseImpl.web.ts†L217-L235】
- **Pathway:** Add a migration table/version flag and a structured migration runner. For SQLite, separate schema creation from data seeding and apply pragma optimizations per platform. For web, store a schema version per namespace and run upgrade routines when it changes.

## Provide richer observability
- **Problem:** Errors are swallowed in web adapters and not surfaced to the UI; native calls rely on promise rejections without context. There is no instrumentation for slow queries or storage failures.【F:lib/databaseImpl.web.ts†L71-L86】【F:lib/user-store.ts†L41-L73】
- **Pathway:** Centralize error handling/logging with contextual messages and optional reporting hooks. Add lightweight timing around heavier queries (journal list, progress updates) to spot regressions and guide optimization work.

## Consolidate ID and clock management
- **Problem:** IDs rely on `Date.now()` plus random suffix per platform; timestamps are generated in multiple places. This can introduce collisions under high frequency and complicates testing.【F:lib/databaseImpl.native.ts†L114-L157】【F:lib/databaseImpl.web.ts†L99-L141】
- **Pathway:** Provide a shared ID/clock utility (e.g., UUID v4 or monotonic counter) and inject it into both adapters. This also enables deterministic IDs in tests and easier replay of user sessions.

## Evolve the user progress store
- **Problem:** `lib/user-store.ts` maintains concept unlock/mastery separately from the main persistence layer, seeds defaults inline, and writes to AsyncStorage inside React state setters. This can cause untracked divergence from the canonical `user_concepts` records.【F:lib/user-store.ts†L1-L76】
- **Pathway:** Fold unlock/mastery into the unified repository and expose a single hook backed by that source of truth. Move persistence out of render-cycle setters, and allow hydration/rehydration to occur via a shared data service to keep UI and storage aligned.
