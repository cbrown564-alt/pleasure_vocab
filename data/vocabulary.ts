// Vocabulary content for Pleasure Vocabulary Builder
// Based on research from Hensel et al., 2021 (PLOS ONE)

import { Concept } from '@/types';

export const concepts: Concept[] = [
  {
    id: 'angling',
    name: 'Angling',
    category: 'technique',
    definition:
      'Rotating, raising, or lowering the pelvis during penetration to adjust where internal stimulation occurs.',
    description: `Angling involves making subtle adjustments to pelvic position during penetrative activity. By tilting, raising, or lowering your pelvis, you can change the angle of penetration to target different areas of internal sensation.

Many people discover this technique intuitively - you might notice yourself naturally shifting position to find an angle that feels better. Naming this movement makes it easier to recognize when you're doing it and to communicate about it.

The adjustment can be small - even a slight change in pelvic tilt can shift sensations significantly. Some find certain angles consistently feel better, while others enjoy varying the angle throughout an experience.`,
    researchBasis:
      'Identified in the OMGyes Pleasure Report research as one of four named techniques associated with enhanced pleasure. The research found that having language for this movement helped women recognize and replicate what works for them.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you ever noticed yourself tilting your hips to change how something feels?',
      'Do certain positions feel better because of the angle they create?',
      'Have you found yourself adjusting your body position to intensify or change sensations?',
    ],
    relatedConcepts: ['rocking', 'pairing'],
    tier: 'free',
  },
  {
    id: 'rocking',
    name: 'Rocking',
    category: 'technique',
    definition:
      'A grinding or rocking motion that keeps consistent contact with external areas during penetration.',
    description: `Rocking refers to a grinding, circular, or back-and-forth motion during penetrative activity that maintains continuous contact between bodies - particularly at the point where external sensitive areas meet a partner's body.

Unlike thrusting motions that create movement in and out, rocking keeps bodies close together with a rhythmic motion that provides consistent external stimulation alongside any internal sensations.

This technique can be particularly relevant because it allows for simultaneous internal and external stimulation without needing hands. The motion comes from the hips and pelvis, creating a wave-like or circular movement rather than linear motion.`,
    researchBasis:
      'Research shows that consistent external stimulation is important for pleasure for many women. Rocking was identified as a specific named technique that facilitates this during partnered penetrative activity.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you noticed a difference between grinding/rocking motions versus thrusting?',
      'Do you find that staying close and moving rhythmically feels different than more separated movement?',
      'Have you experienced how certain motions maintain more consistent contact with sensitive areas?',
    ],
    relatedConcepts: ['angling', 'pairing'],
    tier: 'free',
  },
  {
    id: 'shallowing',
    name: 'Shallowing',
    category: 'technique',
    definition:
      'Focusing stimulation at or just inside the vaginal entrance rather than deeper penetration.',
    description: `Shallowing describes pleasurable touch that focuses on the vaginal entrance and the area just inside - using fingertips, tongue, or the tip of a toy or partner rather than deeper penetration.

The entrance area has a high concentration of nerve endings, and many people find stimulation here to be particularly sensitive and pleasurable. Shallowing treats this area as a destination rather than just a passage to somewhere else.

This technique can involve gentle circling, light pressure, teasing movements, or simply pausing to appreciate sensations in this area. It reframes shallow penetration as intentional and pleasurable rather than incomplete.`,
    researchBasis:
      'The vaginal entrance (introitus) contains a high density of nerve endings. Research identified shallowing as a distinct technique that many women find pleasurable, challenging assumptions that deeper always means better.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you noticed that the entrance area can feel especially sensitive?',
      'Do you sometimes enjoy the beginning moments of penetration most?',
      'Have you experienced pleasure from gentle, shallow touch rather than deeper stimulation?',
    ],
    relatedConcepts: ['pairing'],
    tier: 'free',
  },
  {
    id: 'pairing',
    name: 'Pairing',
    category: 'technique',
    definition:
      'Adding external clitoral stimulation during penetration, either solo or with a partner.',
    description: `Pairing means combining internal penetration with external clitoral stimulation - using your own hand, a partner's hand, a toy, or body positioning to add external touch during penetrative activity.

This technique directly addresses what research consistently shows: most women need clitoral stimulation for orgasm, and penetration alone often doesn't provide sufficient clitoral contact. Pairing treats this not as a problem but as useful information about how bodies work.

Pairing can happen in many ways - reaching down yourself, guiding a partner's hand, using a small vibrator, or choosing positions that naturally create external contact. The key insight is that adding this stimulation is normal, common, and makes physiological sense.`,
    researchBasis:
      'Extensive research shows that the clitoris, not the vagina, is the primary site of orgasmic sensation for most women. Studies find that adding clitoral stimulation during penetration significantly increases likelihood of orgasm.',
    source: 'Hensel et al., 2021, PLOS ONE; Frederick et al., 2018',
    recognitionPrompts: [
      'Do you find that penetration feels better when combined with external touch?',
      'Have you added your own touch during partnered experiences?',
      'Do you notice a difference in intensity when both internal and external stimulation happen together?',
    ],
    relatedConcepts: ['angling', 'rocking', 'shallowing'],
    tier: 'free',
  },
];

// Helper to get concept by ID
export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

// Helper to get concepts by category
export function getConceptsByCategory(category: Concept['category']): Concept[] {
  return concepts.filter((c) => c.category === category);
}

// Helper to get concepts by tier
export function getConceptsByTier(tier: Concept['tier']): Concept[] {
  return concepts.filter((c) => c.tier === tier);
}

// Get all free concepts (for Phase 1)
export function getFreeConcepts(): Concept[] {
  return concepts.filter((c) => c.tier === 'free');
}
