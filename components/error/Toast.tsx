// Toast Component
// Transient notification for mutation errors and warnings

import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms, default 4000
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ICON_MAP: Record<ToastType, string> = {
  error: '!',
  warning: '!',
  info: 'i',
  success: '\u2713',
};

const COLOR_MAP: Record<ToastType, { bg: string; border: string; icon: string }> = {
  error: {
    bg: colors.primary[50],
    border: colors.error,
    icon: colors.error,
  },
  warning: {
    bg: '#FFF8E1',
    border: colors.warning,
    icon: colors.warning,
  },
  info: {
    bg: colors.accent[50],
    border: colors.info,
    icon: colors.info,
  },
  success: {
    bg: colors.secondary[50],
    border: colors.success,
    icon: colors.success,
  },
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const colorScheme = COLOR_MAP[toast.type];
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme.bg,
          borderLeftColor: colorScheme.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colorScheme.icon }]}>
        <Text style={styles.icon}>{ICON_MAP[toast.type]}</Text>
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {toast.message}
      </Text>

      <TouchableOpacity onPress={dismiss} style={styles.closeButton}>
        <Text style={styles.closeIcon}>{'\u00D7'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    ...shadows.md,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
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
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.text.secondary,
    fontWeight: '300',
  },
});
