import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    padding !== 'none' && styles[`padding_${padding}`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  // Variants
  elevated: {
    backgroundColor: colors.background.primary,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  filled: {
    backgroundColor: colors.background.secondary,
  },

  // Padding
  padding_sm: {
    padding: spacing.sm,
  },
  padding_md: {
    padding: spacing.md,
  },
  padding_lg: {
    padding: spacing.lg,
  },
});
