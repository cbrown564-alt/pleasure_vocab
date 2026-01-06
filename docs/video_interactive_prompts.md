# Video & Interactive Asset Strategy

This document catalogs the strategy, visual ideas, and generation prompts (or technical specs) for the application's dynamic assets (Videos and Interactive Diagrams).

## 🎬 Strategy Overview
**Type A: Motion Graphics (Video)**
*   **Format**: `.mov` or `.mp4` (looping).
*   **Use Case**: Abstract concepts (Psychology) or complex physiological changes (Sensation) where interaction isn't necessary.
*   **Style**: "Medical Luxury" in motion. Slow, fluid, bioluminescent or organic movement.

**Type B: Interactive Diagrams (Code)**
*   **Format**: React Native Components (Skia/SVG).
*   **Use Case**: Physical techniques where the *user's input* helps them understand the mechanic (e.g., rotation, pressure, depth).
*   **Style**: Clean lines, responsive to touch, physics-based feedback.

---

## ✅ Completed / Prototyped Assets

| Concept | Type | Idea | Implementation/Prompt |
| :--- | :--- | :--- | :--- |
| **Angling** | **Interactive** | Pelvic Tilt Simulator | **Tech Spec**: Rotating pelvis diagram controlled by a discrete slider or gesture. Shows angle of entry changing relative to internal anatomy. <br> **Status**: Prototyped (`AnglingDiagram.tsx`). |
| **Rocking** | **Interactive** | Friction/Pressure Visualizer | **Tech Spec**: Pubic bone contact point that emits heat/glow particles based on "rubbing" gesture intensity. <br> **Status**: Prototyped (`RockingDiagram.tsx`). |
| **Shallowing** | **Interactive** | Nerve Map Explorer | **Tech Spec**: Zoomable/Pannable map of the vestibule. High density of glowing "nerve nodes" at the entrance that light up on touch. <br> **Status**: Prototyped (`ShallowingDiagram.tsx`). |
| **Rocking** | **Video** | Motion Graphic (Backup) | **Prompt**: "A continuous, rhythmic side-view motion graphic of the pelvic region. The movement is circular/grinding rather than linear. Warm energy builds at the point of external contact (pubic bone)." <br> **Status**: `rocking.mov` exists. |
| **Responsive Desire** | **Video** | " The Spark" | **Prompt**: "An abstract, dormant biological landscape. A single point of light (the spark) lands, and slowly, a warm glow spreads outward from that contact point, illuminating the darkness. Cinematic, slow motion." <br> **Status**: `responsive-desire.mov` exists. |
| **Spontaneous Desire** | **Video** | "The Wellspring" | **Prompt**: "A similar biological landscape, but bubbles of golden light rise spontaneously from deep below, without any external touch. Like a geyser or champagne bubbles rising." <br> **Status**: Planned (File may exist or needs generation). |

---

## ⏳ Pending / Planned Assets

### 1. Building (Video/Animation)
**Type**: Motion Graphic
**Idea**: Rising Thermometer / Vascularity
**Prompt**:
> A high-end medical animation of pelvic tissue.
> Start: Pale, calm, low vascularity.
> Action: Slowly, capillaries fill with red/gold light. The tissue plumps and swells.
> Aesthetic: Like a time-lapse of a flower blooming, but biological.
> Focus: The slow *accumulation* of energy.

### 2. Edging (Video/Interactive)
**Type**: Motion Graphic (Loop)
**Idea**: The Sine Wave
**Prompt**:
> A continuous animated line graph or energy wave.
> Action: The wave rises steeply towards a glowing limit line ("The Peak").
> Just before touching it, it curves gently down, backing off.
> Then it rises again.
> Aesthetic: Golden light path on cream background. Hypnotic, rhythmic.

### 3. Spreading (Video)
**Type**: Motion Graphic
**Idea**: The Drop in the Pond
**Prompt**:
> Top-down view of the pelvic nerve network.
> Action: A single pulse starts at the center (clitoris).
> Rings of golden light ripple outward, moving through the nerves into the hips and thighs.
> The ripples get wider and softer as they travel.

### 4. Pulsing (Video)
**Type**: Motion Graphic
**Idea**: The Heartbeat
**Prompt**:
> View of the pelvic floor muscles.
> Action: Rhythmic, concentric contractions.
> They tighten (squeeze in/up) and release (expand out/down).
> Timed to a slow, deep heartbeat rhythm (approx 60bpm).
> Overlay: Subtle soundwave ripple effect.

### 5. Pairing (Interactive Idea)
**Type**: Interactive Map
**Idea**: The "Connect the Dots"
**Spec**:
> A cross-section showing Clitoris and Vagina.
> User can touch the external clitoris (lights up).
> User can touch the vaginal canal (lights up).
> When *both* are held simultaneously, a new "Bridge" of light connects them, and the glow intensifies x10.
> **Goal**: Teaches that combined stimulation creates a sum greater than the parts.

### 6. Golden Trio (Interactive Idea)
**Type**: Interactive Venn Diagram
**Idea**: The Trinity
**Spec**:
> Three distinct circles/zones: Penetration, Manual, Oral.
> Dragging them to overlap creates new colors.
> Overlapping all three in the center creates the "Golden State" (intense white/gold radiance).

### 7. Non-concordance (Video)
**Type**: Split-Screen Animation
**Idea**: Asynchronous Signaling
**Prompt**:
> Split screen: Top (Brain), Bottom (Pelvis).
> Scene 1: Brain is blue/cool (Thinking), Pelvis is red/warm (Aroused). Signals are mismatched.
> Scene 2: Brain is red/warm, Pelvis is blue/cool.
> Text overlay suggestion (optional): "Arousal ≠ Desire".
