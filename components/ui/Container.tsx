import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  padding?: boolean;
  safeArea?: boolean;
  center?: boolean;
}

export function Container({
  children,
  style,
  scroll = false,
  padding = true,
  safeArea = true,
  center = false,
}: ContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    padding && styles.padding,
    safeArea && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    center && styles.center,
    style,
  ];

  if (scroll) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          containerStyle,
          styles.scrollContent,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: spacing.md,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
