# Asset Library & Visual Language

**Date:** January 2026  
**Status:** Updated January 6, 2026

> [!TIP]
> **Recent Progress:**
> - Video illustrations for concepts are being generated (3 per day) — see `IllustrateSlide.tsx`
> - Static concept illustrations (22) are complete
> - Lottie animations for feedback remain **pending**

---

## 1. Visual Language Overview

The visual language of the Pleasure Vocabulary Builder is designed to be **premium, warm, and educational**. It moves away from clinical or overtly sexual aesthetics towards a human-centric, "editorial" feel.

### Core Pillars
- **Warmth & Humanity:** Uses skin-like tones and organic shapes to feel inviting.
- **Editorial Polish:** Clean typography and high-quality imagery akin to a magazine.
- **Clarity & Education:** Visuals serve to explain complex concepts simply.

### Color Palette
- **Primary:** Rich Coral (`#E8603C`) — Warmth, human connection.
- **Secondary:** Muted Sage (`#60846A`) — Calm, grounding, growth.
- **Accent:** Deep Velvet (`#5C5CFF`) — Contrast, premium depth.
- **Neutral:** Sand (`#FCFAF9`) — Organic background base.

### Typography
- **Headings:** `Playfair Display` — Serif font for an editorial, sophisticated look.
- **Body:** `Inter` — Sans-serif for high readability on digital screens.

---

## 2. Current Asset Inventory

The asset library is organized by function within the `/assets/images/` directory.

### A. Concept Illustrations (`/assets/images/concepts/`)
Unique illustrations for each of the 22 defined concepts. These are key for the "Illustrate" slide type. All currently use `.png` format.

| ID | Status | Description |
|----|--------|-------------|
| `angling` | ✅ | Subtle pelvic tilts |
| `rocking` | ✅ | Wave-like motion |
| `shallowing` | ✅ | Entrance zone focus |
| `pairing` | ✅ | Internal + external touch |
| `building` | ✅ | Gradual intensity increase |
| `plateauing` | ✅ | Sustained arousal level |
| `edging` | ✅ | Approach and retreat |
| `spreading` | ✅ | Radiating sensation |
| `pulsing` | ✅ | Rhythmic waves |
| `warmup-window` | ✅ | Time to full arousal |
| `responsive-desire` | ✅ | Reaction-based desire |
| `spontaneous-desire` | ✅ | Internal urge |
| `golden-trio` | ✅ | Intercourse + oral + manual |
| `spectatoring` | ✅ | Watching self from outside |
| `embodied-presence` | ✅ | Fully in the body |
| `non-concordance` | ✅ | Mind/body disconnect |
| `sexual-self-esteem` | ✅ | Inner confidence |
| `body-appreciation` | ✅ | Function over form |
| `clitoral-structure` | ✅ | Internal anatomy |
| `nerve-density` | ✅ | Sensitivity concentration |
| `clitourethrovaginal` | ✅ | Integrated tissue cluster |
| `internal-stimulation` | ✅ | Through-the-wall contact |

### B. Explainer Thumbnails (`/assets/images/explainers/`)
Feature images for research articles.

| ID | Status | Description |
|----|--------|-------------|
| `orgasm-gap` | ✅ | Bar chart visualization |
| `anatomy-101` | ✅ | Clitoral structure highlights |
| `mind-body` | ✅ | Brain/body connection |
| `communication-science`| ✅ | Dialogue visualization |

### C. Pathway Covers (`/assets/images/pathways/`)
Visual identifiers for learning tracks.

| ID | Status | Description |
|----|--------|-------------|
| `foundations` | ✅ | Compass icon |
| `solo-exploration` | ✅ | Flower icon |
| `partner-communication`| ✅ | Chat bubbles |
| `expanding-repertoire` | ✅ | Sparkles |
| `mindful-presence` | ✅ | Leaf |

### D. UI Elements (`/assets/images/ui/`)
Interface assets for navigation, categories, and empty states.

- **Categories:** `anatomy`, `psychological`, `sensation`, `technique`, `timing`
- **Tabs:** `home`, `journal`, `library`, `profile`
- **Slide Graphics:** `explore`, `name`, `understand`
- **States:** `empty-collection`, `empty-journal`
- **Decor:** `daily-discovery`, `home-welcome`, `insight-pattern`, `aura-background`

### E. Fonts (`/assets/fonts/`)
- `SpaceMono-Regular.ttf` (Note: `Inter` and `Playfair Display` likely loaded via Google Fonts or Expo Google Fonts package, not present as local assets).

---

## 3. Gap Analysis & Needs

While the current inventory provides complete coverage for existing content, several opportunities for improvement exist.

### 1. File Format Efficiency
- **Current:** mostly high-res PNGs.
- **Issue:** Increased bundle size (documented challenge in Phase 3).
- **Need:** Convert vector-suitable assets (icons, simple diagrams) to SVG (`react-native-svg`). Optimize raster images (concept art) to WebP or compressed PNG.

### 2. Interactive Visualizations
- **Current:** Static PNGs found in `concepts`.
- **Need:** The documentation mentions a goal for "Interactive Diagrams". The current PNGs for `clitoral-structure`, etc., are static. We need a plan to replace strictly educational diagrams with interactive components (e.g., tap to reveal labels).

### 3. Missing Vector Icons
- **Current:** Tab icons and Category chips are PNGs (`tab-home.png`, `category-technique.png`).
- **Need:** These should ideally be SVGs or icon font glyphs for sharper scaling and theme adaptability. *Note: Functional PNGs are acceptable if migration is high-effort, but Vectors are preferred for the premium feel.*

### 4. Animation Assets (High Priority)
- **Current:** None.
- **Need:** Lottie files (JSON) for "Resonates" feedback and Success states.
- **Goal:** Significant investment in "delight" details. *Note: "Collect" action removed.*

### 5. Explainer Visual Enrichment
- **Current:** Text-heavy 5-minute reads with only one header image.
- **Need:** Inline assets (diagrams, pull quotes, icons, mini-illustrations) to break up text and improve readability, similar to editorial magazine layouts.

---

## 4. Implementation Plan

### Phase 1: Optimization (Immediate)
- [ ] **Backup:** Move original uncompressed assets to `assets/images/_originals/` or similar archive folder to ensure easy rollback.
- [ ] **Audit:** Check resolution and file size of all PNGs.
- [ ] **Compress:** Run all PNGs through optimization tools (e.g., TinyPNG) to reduce bundle size.
- [ ] **Verify:** Ensure no visual degradation against backups.

### Phase 2: Vector Migration (Short-term / As Feasible)
- [ ] **Evaluate:** Identify which icons are easy replacements.
- [ ] **UI Icons:** Replace `assets/images/ui/tab-*.png` and `category-*.png` with SVG components or Lucide icons where possible without major refactoring.

### Phase 3: High Engagement Features (Medium-term)
- [ ] **Explainer Layouts:** Identify points in `data/explainers.ts` for inserting new inline visuals. Source/create these assets.
- [ ] **Micro-animations:** Research and implement high-quality Lottie animations for "Resonates" and general success feedback.
- [ ] **Concept Diagrams:** Create a detailed design spec for converting static diagrams to interactive components.

### Phase 4: Asset Pipeline
- [x] **Automation:** Asset optimization script is available via `npm run compress-assets`.
- [ ] **Documentation:** Update `CONTRIBUTING.md` with guidelines for new assets.

## 5. How to Add New Assets

1.  **Place newly created assets** (PNGs) into the appropriate folder in `assets/images/`.
2.  **Run the compression script** to optimize them:
    ```bash
    npm run compress-assets
    ```
    *Note: The script uses `sharp` to apply lossy compression (palette quantization) to reduce file size. Originals are NOT automatically backed up by this script, so ensure you have copies if needed.*
3.  **Verify** the visual quality in the simulator.

