// Inline Error Banner Component
// Displayed for section data load failures within a page

import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InlineErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function InlineErrorBanner({
  message,
  onRetry,
  onDismiss,
}: InlineErrorBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>!</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>

      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.actionButton}>
            <Text style={styles.actionText}>Retry</Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.inverse,
  },
  message: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.sm,
  },
  actionText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.text.inverse,
  },
  dismissButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  dismissText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});
