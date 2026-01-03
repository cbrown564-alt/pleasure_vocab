// Learning pathways for Pleasure Vocabulary Builder
// Structured progressions through related concepts

import { Pathway } from '@/types';

export const pathways: Pathway[] = [
  {
    id: 'foundations',
    name: 'Foundations',
    description:
      'Start here. Core vocabulary and anatomy basics that inform everything else.',
    icon: 'compass',
    conceptIds: ['pairing', 'clitoral-structure', 'nerve-density', 'building'],
    estimatedTime: '15-20 min',
  },
  {
    id: 'solo-exploration',
    name: 'Solo Exploration',
    description:
      'Concepts for self-discovery and masturbation - understanding your own responses.',
    icon: 'flower',
    conceptIds: [
      'edging',
      'plateauing',
      'spreading',
      'pulsing',
      'embodied-presence',
    ],
    estimatedTime: '20-25 min',
  },
  {
    id: 'partner-communication',
    name: 'Partner Communication',
    description:
      'Understanding yourself to communicate better with partners.',
    icon: 'chatbubbles',
    conceptIds: [
      'responsive-desire',
      'warmup-window',
      'spectatoring',
      'sexual-self-esteem',
    ],
    estimatedTime: '15-20 min',
  },
  {
    id: 'expanding-repertoire',
    name: 'Expanding Repertoire',
    description:
      'Techniques for variety and experimentation in partnered experiences.',
    icon: 'sparkles',
    conceptIds: ['angling', 'rocking', 'shallowing', 'golden-trio'],
    estimatedTime: '15-20 min',
  },
  {
    id: 'mindful-presence',
    name: 'Mindful Presence',
    description:
      'Psychological factors that shape pleasure - getting out of your head and into sensation.',
    icon: 'leaf',
    conceptIds: [
      'spectatoring',
      'embodied-presence',
      'non-concordance',
      'body-appreciation',
    ],
    estimatedTime: '20-25 min',
  },
];

// Helper to get pathway by ID
export function getPathwayById(id: string): Pathway | undefined {
  return pathways.find((p) => p.id === id);
}

// Helper to check if a concept is in any pathway
export function getPathwaysForConcept(conceptId: string): Pathway[] {
  return pathways.filter((p) => p.conceptIds.includes(conceptId));
}

// Get the recommended starting pathway
export function getRecommendedPathway(): Pathway {
  return pathways[0]; // Foundations is always recommended first
}
