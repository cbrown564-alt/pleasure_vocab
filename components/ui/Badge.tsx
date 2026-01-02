import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { Text } from './Typography';
import { ConceptStatus } from '@/types';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function Badge({
  label,
  color = colors.text.inverse,
  backgroundColor = colors.primary[500],
  style,
}: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text
        variant="labelSmall"
        color={color}
        style={styles.text}
      >
        {label}
      </Text>
    </View>
  );
}

// Specialized badge for concept status
interface StatusBadgeProps {
  status: ConceptStatus;
  style?: ViewStyle;
}

const statusConfig: Record<ConceptStatus, { label: string; bg: string; color: string }> = {
  unexplored: {
    label: 'New',
    bg: colors.neutral[200],
    color: colors.text.secondary,
  },
  explored: {
    label: 'Explored',
    bg: colors.secondary[100],
    color: colors.secondary[700],
  },
  resonates: {
    label: 'Resonates',
    bg: colors.primary[100],
    color: colors.primary[700],
  },
  not_for_me: {
    label: 'Not for me',
    bg: colors.neutral[200],
    color: colors.text.tertiary,
  },
  curious: {
    label: 'Curious',
    bg: colors.warning,
    color: colors.neutral[900],
  },
};

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      label={config.label}
      backgroundColor={config.bg}
      color={config.color}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
