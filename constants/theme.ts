// Design system for Pleasure Vocabulary Builder
// Premium, warm, and approachable aesthetics.

export const colors = {
  // Primary - Rich Coral / Terracotta (Warmth, Human, skin-like tones)
  primary: {
    50: '#FFF5F2',
    100: '#FFE6DF',
    200: '#FFC5B5',
    300: '#FF9E85',
    400: '#FF7D5C',
    500: '#E8603C', // Main Brand Color
    600: '#C94524',
    700: '#A63318',
    800: '#872C18',
    900: '#702819',
  },

  // Secondary - Muted Sage / Olive (Calm, grounding, growth)
  secondary: {
    50: '#F4F7F4',
    100: '#E3EBE4',
    200: '#C5D8C8',
    300: '#A1BFa7',
    400: '#7FA388',
    500: '#60846A', // Main Semantic Color
    600: '#4A6953',
    700: '#3D5443',
    800: '#344539',
    900: '#2C3931',
  },

  // Accent - Deep Velvet / Night (Contrast, depth, premium feel)
  accent: {
    50: '#F0F0FF',
    100: '#E0E0FF',
    200: '#C2C2FF',
    300: '#9E9EFF',
    400: '#7A7AFF',
    500: '#5C5CFF',
    600: '#4242DB',
    700: '#3030A3', // Deep Blue/Purple for text contrast
    800: '#2A2A78',
    900: '#25255C',
    950: '#0F0F29', // Almost black
  },

  // Neutral - Sand / Paper (Organic background bases)
  neutral: {
    50: '#FCFAF9', // Main App Background (Paper)
    100: '#F5F2EF', // Secondary Background
    200: '#EBE8E3',
    300: '#DCD8D3',
    400: '#BDB9B4',
    500: '#9E9A95',
    600: '#75726E',
    700: '#5C5955',
    800: '#454340',
    900: '#2E2D2B',
    950: '#1C1B1A',
  },

  // Semantic
  success: '#60846A',
  warning: '#D99A41',
  error: '#C94524',
  info: '#5C5CFF',

  // Background aliases
  background: {
    primary: '#FCFAF9', // Cream/Paper
    secondary: '#F5F2EF', // Slightly darker cream
    tertiary: '#EBE8E3', // Borders/Separators
    surface: '#FFFFFF', // Card backgrounds (Pure white for pop)
    dark: '#1C1B1A',
  },

  // Text aliases
  text: {
    primary: '#1C1B1A', // Soft Black
    secondary: '#5C5955', // Dark Grey
    tertiary: '#9E9A95', // Light Grey
    inverse: '#FCFAF9',
    accent: '#A63318',
  },

  // Gradient definitions (for LinearGradient usage)
  gradients: {
    primary: ['#FFC5B5', '#E8603C'],
    secondary: ['#C5D8C8', '#60846A'],
    surface: ['#FFFFFF', '#FCFAF9'],
    dark: ['#2E2D2B', '#1C1B1A'],
  },

  status: {
    unexplored: '#EBE8E3',
    explored: '#C5D8C8',
    resonates: '#FFC5B5', // Light coral
    notForMe: '#DCD8D3',
    curious: '#FFE6DF',
  },
};

export const typography = {
  fontFamily: {
    heading: 'PlayfairDisplay_700Bold',
    headingItalic: 'PlayfairDisplay_700Bold_Italic',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_600SemiBold',
  },

  // Modular scale: 1.25 (Major Third)
  fontSize: {
    xs: 12,
    sm: 15, // Bumped up slightly for readability
    base: 17, // Standard body
    lg: 21,
    xl: 26,
    '2xl': 33, // H2
    '3xl': 41, // H1
    '4xl': 51, // Hero
  },

  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

export const borderRadius = {
  sm: 6,
  md: 12, // More rounded standard
  lg: 20, // Card standard
  xl: 32,
  full: 9999,
};

export const shadows = {
  // Soft, diffused shadows
  sm: {
    shadowColor: '#454340',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#454340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#454340',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

// Text style presets
export const textStyles = {
  h1: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h2: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h3: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg, // Intentional: H3 is often smaller but bold
    lineHeight: typography.fontSize.lg * typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h4: {
    fontFamily: typography.fontFamily.bodyBold, // H4 often transitions to Sans
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    color: colors.text.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    color: colors.text.secondary,
  },
  bodyBold: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    color: colors.text.primary,
  },
  caption: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: colors.text.tertiary,
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.tight,
    color: colors.text.secondary,
  },
};
