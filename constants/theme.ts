// Design system for Pleasure Vocabulary Builder
// Warm, approachable palette - not clinical, not explicit

export const colors = {
  // Primary - warm rose/coral tones
  primary: {
    50: '#FDF8F5',
    100: '#FCEEE8',
    200: '#F9DCD1',
    300: '#F4C4B0',
    400: '#EDA68A',
    500: '#E58B6D', // Main primary
    600: '#D4715A',
    700: '#B85A47',
    800: '#96483A',
    900: '#7A3B31',
  },

  // Secondary - soft sage/green for calm balance
  secondary: {
    50: '#F6F9F7',
    100: '#E8F0EB',
    200: '#D1E1D7',
    300: '#B3CCB9',
    400: '#8FB396',
    500: '#6B9A73', // Main secondary
    600: '#567D5E',
    700: '#46654C',
    800: '#3A513F',
    900: '#314435',
  },

  // Neutral - warm grays
  neutral: {
    50: '#FAFAF9',
    100: '#F5F4F2',
    200: '#E8E6E3',
    300: '#D6D3CF',
    400: '#B8B4AE',
    500: '#9A958D',
    600: '#7D7871',
    700: '#66625C',
    800: '#524F4A',
    900: '#3D3B38',
    950: '#262523',
  },

  // Semantic colors
  success: '#6B9A73',
  warning: '#E5A96D',
  error: '#D4715A',
  info: '#6D9DE5',

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FDF8F5',
    tertiary: '#F5F4F2',
  },

  // Text colors
  text: {
    primary: '#3D3B38',
    secondary: '#66625C',
    tertiary: '#9A958D',
    inverse: '#FFFFFF',
  },

  // Status colors for concept tracking
  status: {
    unexplored: '#E8E6E3',
    explored: '#D1E1D7',
    resonates: '#E58B6D',
    notForMe: '#B8B4AE',
    curious: '#E5A96D',
  },
};

export const typography = {
  // Font families (using system fonts for now)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
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
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Preset text styles
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h2: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h4: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.lg * typography.lineHeight.tight,
    color: colors.text.primary,
  },

  // Body text
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    color: colors.text.primary,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: colors.text.secondary,
  },

  // Labels
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: colors.text.secondary,
  },
  labelSmall: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    color: colors.text.tertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },

  // Caption
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    color: colors.text.tertiary,
  },
};
