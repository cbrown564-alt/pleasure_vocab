// Full Screen Error Component
// Displayed for critical errors like database init or migration failures

import { borderRadius, colors, shadows, spacing, textStyles, typography } from '@/constants/theme';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FullScreenErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function FullScreenError({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
}: FullScreenErrorProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>!</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {onRetry && (
          <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.7}>
            <Text style={styles.buttonText}>{retryLabel}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.hint}>
          If this problem persists, try restarting the app.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.error,
  },
  title: {
    ...textStyles.h2,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...textStyles.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  buttonText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text.inverse,
  },
  hint: {
    ...textStyles.caption,
    textAlign: 'center',
  },
});
