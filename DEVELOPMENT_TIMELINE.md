# Pleasure Vocabulary Builder — Development Journey

A chronological narrative of how the Pleasure Vocabulary Builder evolved, focusing on major milestones, feature directions, and design priorities captured in the git history.

## Timeline

### 2025-12-31 — Project foundation
- **Initial commit** bootstrapped an Expo application with the default tab layout, theming primitives, and initial asset set, establishing the scaffold for later feature work. (commit `c387672`)

### 2026-01-02 — Phase 1 experience and cross-platform data layer
- **Phase 1 foundation** introduced the app’s first full feature set: onboarding (welcome, privacy, goals, comfort, and first concept), the home dashboard, a vocabulary library with concept cards and detail views, a resonance-focused profile, a reflection journal, settings, and a reusable UI kit. It also added a local encrypted SQLite-based data layer and seeded the first four vocabulary techniques. (commit `3c97fc9`)
- **Web compatibility** arrived via platform-specific database implementations: Expo SQLite for native and AsyncStorage for web, plus Metro configuration to resolve platform extensions, signaling a commitment to multi-platform access. (commit `5110ef6`)

### 2026-01-03 — Phase 2 content depth and science layer
- **Phase 2 expansion** broadened the curriculum with 18 concepts across five categories, structured learning pathways with progress tracking, a communication toolkit (conversation starters, scripts, reassurance), partner-sharing summaries, pathway/category filtering in the Library, and pattern insights in the Profile. The data layer gained pathway progress support. (commit `b294903`)
- **Research Explainers (Phase 3 preview)** added science-backed explainers (Orgasm Gap, Anatomy 101, Mind-Body Connection, Communication Science), cards and detail screens, a Library research tab, and science callouts on Home and concept detail views—deepening evidence-based learning. (commit `f685fda`)

### 2026-01-04 — Phase 3 UI/UX revamp and learning flow refinement
- **Comprehensive UI/UX overhaul** delivered the Profile V2 “Atelier” dashboard, refreshed layouts across Home, Library, Journal, concepts, and explainers, updated design tokens, and bundled product brief/reference research PDFs—resetting the visual and interaction language. (commit `4d42d34`)
- **Home polish and navigation fixes** removed redundant science sections, clarified the journey flow, corrected pathway progression logic, and added footer/navigation improvements with richer concept metadata. (commits `941ee6c`, `268ae0e`)
- **Navigation/data structure refinement** streamlined screen layouts, updated onboarding copy and flows, added event tracking scaffolding, and reorganized assets for pathways, explainers, and tabs, reflecting a maturing IA. (commit `7a3d888`)
- **ConceptDeck evolution** introduced distinct slide layouts and a user progress store, then shifted all concepts to a new four-slide story arc—Recognize → Name → Understand → Explore—plus content rewrites for chunked learning, aligning pedagogy with consistent micro-learning patterns. (commits `c8dad09`, `1d8bb5e`, `b9a63e2`)
- **Documentation of the sprint** captured the design system overhaul, screen-by-screen changes, ConceptDeck details, and future paths in a dedicated Phase 3 revamp writeup, emphasizing intentional design decisions. (commit `20a8466`)

### 2026-01-05 — Visual storytelling and project positioning
- **Illustration integration** layered bespoke illustrations into ConceptDeck slides, refreshed category and UI assets, and added dedicated slide artwork—reinforcing the narrative, welcoming tone of the learning experience. (commit `7c42a82`)
- **Project README** summarized goals, features, and tech stack, framing the product vision and current capabilities. (commit `9f9227f`)

## Overall direction and focus
- **Evidence-backed sexual education**: Early addition of research explainers and science callouts shows a commitment to grounding guidance in research, not just anecdotal tips.
- **Structured micro-learning**: Successive iterations of ConceptDeck (distinct layouts, content rewriting, four-slide arc) indicate a focus on digestible, story-driven learning with clear recognition→action flow.
- **Personalization and progression**: Resonance tracking, pathway progress, pattern insights, journals, and partner sharing highlight an intent to support individualized journeys and communication.
- **Cross-platform accessibility**: Native/web database split and Metro configuration underscore a requirement for consistent experiences across devices.
- **Design maturity**: The Phase 3 UI/UX revamp, illustration suite, and typography/color updates reflect a shift from MVP scaffolding to a polished, emotionally warm product identity.

## Implied next steps
- Extend the four-slide narrative and refined content to any remaining concepts or future additions.
- Build on event tracking and data structures to power adaptive recommendations.
- Continue aligning visual storytelling (illustrations) with micro-learning flows and research explainers for cohesive journeys.
