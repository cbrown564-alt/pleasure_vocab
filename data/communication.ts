// Communication toolkit content for Pleasure Vocabulary Builder
// Conversation starters, scripts, and barrier reassurance

import { ConversationStarter, ScriptExample, CommunicationBarrier } from '@/types';

export const conversationStarters: ConversationStarter[] = [
  {
    id: 'introduce-preference',
    situation: 'Introducing a new preference',
    comfortLevels: {
      clinical:
        'I\'ve been learning about different types of stimulation, and I\'d like to explore incorporating more [specific type] into our intimate experiences.',
      balanced:
        'I\'ve been thinking about something I\'d like to try. Would you be open to exploring [specific thing] together?',
      direct:
        'There\'s something that really turns me on that I want to share with you. I\'d love to try [specific thing].',
    },
    tips: [
      'Choose a relaxed, non-sexual moment to bring this up',
      'Frame it as something to explore together, not a criticism',
      'Be specific about what you want to try',
    ],
  },
  {
    id: 'ask-for-more',
    situation: 'Asking for more of something',
    comfortLevels: {
      clinical:
        'The type of touch you were doing earlier was very pleasurable for me. I would appreciate more of that.',
      balanced:
        'That thing you were doing earlier felt really good. Can we do more of that?',
      direct:
        'I love when you do that. More of that, please.',
    },
    tips: [
      'Positive feedback encourages repetition',
      'Be specific about what felt good',
      'In-the-moment feedback is often most effective',
    ],
  },
  {
    id: 'positive-feedback',
    situation: 'Giving positive feedback',
    comfortLevels: {
      clinical:
        'That technique is highly effective for my arousal. The pressure and rhythm are exactly right.',
      balanced:
        'That feels amazing. The way you\'re doing that is perfect.',
      direct:
        'Oh god, yes. Right there. That\'s exactly it.',
    },
    tips: [
      'Positive reinforcement makes good things happen more often',
      'Sound and words both communicate pleasure',
      'Specific praise is more helpful than general',
    ],
  },
  {
    id: 'request-change-mid',
    situation: 'Requesting a change mid-encounter',
    comfortLevels: {
      clinical:
        'Could we adjust the stimulation? I think I need something different at this point.',
      balanced:
        'Can we try something a little different? I think I need more/less [speed, pressure, etc.].',
      direct:
        'Let\'s switch it up. I want you to [specific request].',
    },
    tips: [
      'Changes aren\'t criticism - bodies need variety',
      'Guide rather than criticize: "like this" vs "not that"',
      'Your partner wants to please you; help them do it',
    ],
  },
  {
    id: 'discuss-timing',
    situation: 'Discussing timing and pacing',
    comfortLevels: {
      clinical:
        'Research suggests that arousal takes time to build fully. I\'d like us to spend more time on the initial phases before moving to penetration.',
      balanced:
        'I find I really enjoy things more when we take our time at the beginning. Can we slow down and build up more gradually?',
      direct:
        'I want more foreplay. Let\'s not rush - I love when we take our time getting there.',
    },
    tips: [
      'Framing around pleasure (not obligation) helps',
      'Share what you\'ve learned about your body',
      'Suggest specific activities for the warm-up phase',
    ],
  },
];

export const scriptExamples: ScriptExample[] = [
  {
    id: 'learning-about',
    category: 'Sharing discoveries',
    opening: 'I\'ve been learning about something called [concept name]...',
    context:
      'When you want to introduce vocabulary or research you\'ve encountered.',
  },
  {
    id: 'like-to-try',
    category: 'Suggesting something new',
    opening: 'Something I\'d like to try is...',
    context: 'When proposing a new activity or technique to explore together.',
  },
  {
    id: 'feels-good-when',
    category: 'Positive feedback',
    opening: 'This feels really good when you...',
    context:
      'When giving in-the-moment feedback about what\'s working.',
  },
  {
    id: 'slow-down',
    category: 'Adjusting pace',
    opening: 'Can we slow down and...',
    context: 'When you want to extend a particular activity or phase.',
  },
  {
    id: 'noticed-enjoy',
    category: 'Sharing self-knowledge',
    opening: 'I noticed I really enjoy...',
    context:
      'When sharing something you\'ve discovered about your preferences.',
  },
  {
    id: 'what-if-we',
    category: 'Collaborative exploration',
    opening: 'What if we tried...',
    context: 'When suggesting an experiment or variation together.',
  },
  {
    id: 'more-less',
    category: 'Fine-tuning',
    opening: 'A little more/less [pressure, speed, etc.]...',
    context: 'When making small adjustments to what\'s happening.',
  },
  {
    id: 'keep-doing',
    category: 'Encouragement',
    opening: 'Keep doing exactly that...',
    context: 'When something is working well and you don\'t want it to change.',
  },
  {
    id: 'want-to-feel',
    category: 'Expressing desire',
    opening: 'I want to feel your...',
    context: 'When expressing what you want next.',
  },
  {
    id: 'show-you',
    category: 'Demonstrating',
    opening: 'Let me show you how I like...',
    context: 'When guiding through demonstration rather than words.',
  },
];

export const communicationBarriers: CommunicationBarrier[] = [
  {
    id: 'hurt-feelings',
    fear: 'Fear of hurting partner\'s feelings',
    percentage: 42.4,
    reassurance:
      'Most partners genuinely want to know what feels good. Sharing preferences is an act of trust and intimacy, not criticism. Research shows that couples who communicate about sex have higher satisfaction - your guidance helps your partner succeed.',
    tips: [
      'Frame as "more of this" rather than "less of that"',
      'Share what you\'ve learned about yourself, not what they\'re doing wrong',
      'Remember: they can\'t read your mind, and they want you to feel good',
    ],
  },
  {
    id: 'discomfort-explicit',
    fear: 'Discomfort with explicit discussion',
    percentage: 40.2,
    reassurance:
      'You can start gradually - even small communications make a difference. Using this app\'s vocabulary gives you neutral, specific words. Many people find that starting with text messages or notes feels easier than face-to-face.',
    tips: [
      'Start with less vulnerable topics and build up',
      'Use vocabulary terms - they\'re designed to be speakable',
      'Consider sharing written notes or texts if speaking feels hard',
    ],
  },
  {
    id: 'embarrassment',
    fear: 'Embarrassment about desires',
    percentage: 37.7,
    reassurance:
      'The things you want are almost certainly more normal than you think. Research on sexual preferences reveals enormous diversity - you are not alone in what turns you on. Shame fades when desires are met with acceptance.',
    tips: [
      'Remember that partners are often curious and welcoming',
      'Start with lower-stakes preferences to build confidence',
      'Your desires are valid, even if they feel unusual to you',
    ],
  },
  {
    id: 'seeming-demanding',
    fear: 'Worry about seeming demanding',
    percentage: 35.1,
    reassurance:
      'Knowing what you want and asking for it is a gift to your partner, not a burden. Clear communication takes guesswork out of pleasing you. Most partners appreciate directness far more than trying to read subtle signals.',
    tips: [
      'Asking for pleasure benefits both of you',
      'Vague hints are actually harder to respond to than clear requests',
      'Confidence about your desires is often experienced as sexy',
    ],
  },
];

// Helper to get starter by situation
export function getStarterBySituation(situation: string): ConversationStarter | undefined {
  return conversationStarters.find((s) => s.situation === situation);
}

// Helper to get scripts by category
export function getScriptsByCategory(category: string): ScriptExample[] {
  return scriptExamples.filter((s) => s.category === category);
}

// Get all unique script categories
export function getScriptCategories(): string[] {
  return [...new Set(scriptExamples.map((s) => s.category))];
}
