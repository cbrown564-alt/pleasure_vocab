# Animation Development Journey & Future Roadmap

**Date**: January 6, 2026
**Status**: 3 Core Prototypes Completed (Angling, Shallowing, Rocking)

## I. The Journey So Far

We set out to move beyond static illustrations to create "explorable explanations" — interactive diagrams that allow users to feel the concepts.

### 1. Angling (Pelvic Tilt)
*   **Concept**: Modifying pelvic angle changes sensation "sweet spots."
*   **Tech Stack**: `react-native-svg` + `reanimated`.
*   **Victory**: The rotational physics feel effectively heavy and grounded. The color interpolation (Grey -> Hot Coral) clearly communicates the "finding the spot" mechanic.
*   **Learning**: SVG paths are great for rigid body rotation but struggle with organic "squish."

### 2. Shallowing (Nerve Density)
*   **Concept**: Sensitivity is highest at the entrance, not depth.
*   **Tech Stack**: `@shopify/react-native-skia` + `Turbulence` Shader + `BlurMask`.
*   **Challenge**: Initial attempt with complex Perlin noise shaders caused a crash (`Expected arraybuffer...`).
*   **Fix**: We simplified the rendering pipeline, verified stability with a basic "Red Square" test, then re-architected the visual stack layer-by-layer (Anatomy -> Texture -> Glow).
*   **Victory**: The "Reverse Heatmap" (hot at start, cold deep) effectively counteracts the intuitive "deeper is better" assumption.

### 3. Rocking (Coital Alignment)
*   **Concept**: Constant pubic bone contact creates grinding friction.
*   **Tech Stack**: Skia `Circles`, `Paths`, and `BlurMask`.
*   **Mechanic**: "Proximity Heat." We calculate the Euclidean distance between the user-dragged "Partner Bone" and the "Receiver Bone."
*   **Victory**: The visual feedback loop — where "Grinding" (small circular motions) maintains high heat while "Thrusting" (in-out) loses it — perfectly gamifies the technique.

---

## II. Future Animation Roadmap

Initial concepts for visualizing the remaining vocabulary terms.

### A. Technique Animations
| Concept | Interaction Idea | Visual Metaphor |
| :--- | :--- | :--- |
| **Pairing** | **Multi-touch**: User must hold "Internal" node (penetration) AND tap/rub "External" node (clitoris) simultaneously. | **Circuit**: When both are active, a "connection" line sparks and glows brighter than the sum of parts. |
| **Golden Trio** | **Builder**: Drag 3 icons (Intercourse, Manual, Oral) into a circle. | **Harmony**: As each is added, the central "pleasure frequency" wave becomes richer/higher amplitude. |

### B. Sensation Animations
| Concept | Interaction Idea | Visual Metaphor |
| :--- | :--- | :--- |
| **Building** | **Hold to Charge**: Long-press button to build intensity. Releasing drops it slightly. | **Avalanche/Wave**: A wave gathering height. Shows that it takes *time* to accumulate potential energy. |
| **Plateauing** | **Drag Path**: User drags a character up a hill, then walks along a flat ridge. | **Altitude Graph**: Visualizes "High Altitude" without "Climbing." |
| **Edging** | **Throttle**: Drag "Intensity" up to a Red Line, then release to drop back to Green. Repeat. | **Tachometer**: Revving an engine. Visualizes the "Approach & Retreat" cycle. |
| **Spreading** | **Ripple Tap**: Tapping a center point sends ripples outward to limbs. | **Water Surface**: Shows how localized sensation can become systemic. |
| **Pulsing** | **Rhythm Tap**: User taps in time with a visual heartbeat. | **Sine Wave**: Visualizing the 0.8s contraction rhythm of orgasm. |

### C. Timing & Psychological
| Concept | Interaction Idea | Visual Metaphor |
| :--- | :--- | :--- |
| **Warm-up Window** | **Slow Cooker**: Rapid tapping does nothing. Slow, sustained dragging fills the bar. | **Blooming Flower**: Visualizes that "Fast ≠ Better." Time is the key ingredient. |
| **Responsive Desire** | **Spark**: A dormant coal that only glows *after* you rub it (friction/context). | **Ember**: Shows that desire follows action, rather than preceding it. |
| **Spectatoring** | **Focus Lens**: Screen is blurry/split. User swipes to "Align" the ghost image with the body. | **Out-of-Body**: Visualizes the disconnect vs. the "snap" of Embodied Presence. |

## III. Technical Standard (The "Antigravity Layout")
For all future diagrams, we will standardize on:
1.  **Engine**: `react-native-skia` (Performance + Effects).
2.  **Container**: Fixed aspect ratio box (`300px` height) with standardized `neutral[50]` background.
3.  **Color Language**:
    *   **Neutral/Anatomy**: `neutral[300]` (Stroke).
    *   **User/Active**: `primary[500]` (Hot Coral).
    *   **Feedback/Text**: `text.secondary` overlay at `top: 10`.
