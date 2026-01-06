# Core Experience Strategy: Pleasure Vocabulary Builder

## 1. Design Philosophy: "Tangible Mastery"
The core goal is to move users from "reading about sex" to "acquiring tools."
*   **Old Model:** Textbook. Passive reading (Long Scroll).
*   **New Model:** Toolkit. Active collection (Card Decks).

**UX Inspiration:**
*   **Blinkist:** Condensing complex ideas into digestible "blinks" (screens).
*   **Duolingo:** The feeling of *progress* and *collection* (Gamification).
*   **Headspace:** Warm, approachable, non-judgmental aesthetics.

---

## 2. Core Architecture: The "Concept Deck"
Instead of a single vertical scroll for each concept (e.g., "Angling"), we will restructure content into a **Concept Deck**—a swipeable series of 5-7 focused screens. This improves retention and feels more interactive.

### Anatomy of a Concept Deck
1.  **The "Card" (Cover):**
    *   Big, beautiful typography of the Term (e.g., "Angling").
    *   Simple 1-sentence definition.
    *   Status: "New" or "Collected".
2.  **The Context (The "Why"):**
    *   Brief explanation of *why* this matters.
    *   "Research says..." snippet (Credibility anchor).
3.  **The Visual (The "How"):**
    *   **Interactive Diagram:** The core educational moment.
    *   Users interact (tap/slide) to see the mechanic working (e.g., toggle pelvic tilt).
4.  **The Deep Dive (Optional):**
    *   Short paragraphs for those wanting more detail (expandable).
5.  **The Reflection (The "Try"):**
    *   Prompt: "Next time, notice if..."
    *   Action: "Mark as Tried" or "Add to Field Notes".
6.  **Collection Moment:**
    *   Animation: The Card flies into your "Vocabulary Library."
    *   Reward: "You've added 'Angling' to your vocabulary."

---

## 3. Visual Asset Catalogue
To support the "Concept Deck" and specifically the "Visual" screen, we need the following assets.
*Note: We should use a consistent, warm, abstract-but-anatomically-correct artistic style.*

### Priority 1: Core Technique Visualization (Interactive Candidate)
*   **Angling:**
    *   *View:* Side profile of pelvis/spine.
    *   *Action:* Slider to tilt pelvis (Anterior/Posterior tilt) showing how the internal angle changes.
*   **Rocking:**
    *   *View:* Abstract bodies in contact.
    *   *Action:* Animation showing "Grinding/Rocking" (circular contact) vs "Thrusting" (in/out).
*   **Shallowing:**
    *   *View:* Cross-section of vaginal canal.
    *   *Action:* Highlight "Entrance Only" zone versus "Deep" zone.
*   **Pairing:**
    *   *View:* Outline of body/genitals.
    *   *Action:* Highlight "Internal" source + "External" source activating simultaneously.

### Priority 2: Anatomy & Science (Static or Simple Build)
*   **The Iceberg (Clitoral Structure):**
    *   *View:* External view (Glans) -> Fade to transparent skin -> Reveal internal view (Crura/Bulbs).
*   **Nerve Density:**
    *   *View:* Clitoral Glans side-by-side with Penis Glans.
    *   *Visual:* "Dots" representing nerve endings (densely packed on clitoris).
*   **CUV Complex:**
    *   *View:* Internal cross-section.
    *   *Visual:* Highlight the specific intersection of Clitoris, Urethra, and Vagina.
*   **The Warm-Up Window:**
    *   *View:* A simple line graph.
    *   *Visual:* "Arousal" on Y-axis, "Time" on X-axis. Show the 20-min curve vs. immediate spike.

---

## 4. Gamification: "Building Your Vocabulary"
We are not building a game, but we are *gamifying mastery*.
*   **The Library:** Not just a list, but a grid of "Cards."
    *   *Locked:* Greyed out / Locked icon.
    *   *Unlocked:* Full color.
    *   *Mastered:* Gold border / Special indicator (after "Marking as Tried").
*   **The "Starter Pack":**
    *   User starts with 3 empty slots.
    *   Goal: "Unlock your first 3 concepts."

---

## 5. Implementation Roadmap
1.  **Refactor Concept Screen:** Create a `ConceptDeck` component that takes our existing content and renders it as swipeable slides.
2.  **Asset Generation:** Create placeholders for the diagrams (using `generate_image` or basic SVGs).
3.  **Gamification Logic:** Update `UserContext` to track `unlockedConcepts` and `masteredConcepts`.
