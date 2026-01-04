import { Button, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Rich, warm gradient background */}
      <LinearGradient
        colors={[colors.primary[50], '#FFF0EA', colors.background.primary]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative element - large organic shape */}
      <View style={styles.orbitContainer}>
        <View style={styles.orbitCircle} />
      </View>

      <View style={[styles.content, { paddingTop: insets.top + spacing['4xl'] }]}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="sparkles" size={28} color={colors.primary[600]} />
          </View>

          <Text variant="h1" align="center" style={styles.title}>
            Find the words for what feels good.
          </Text>

          <Text variant="body" align="center" color={colors.text.secondary} style={styles.subtitle}>
            A vocabulary builder for understanding and communicating your pleasure.
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button
          title="Begin"
          onPress={() => router.push('/onboarding/goals')}
          fullWidth
          size="lg"
          style={styles.beginButton}
        />

        <TouchableOpacity
          onPress={() => router.push('/onboarding/privacy')}
          style={styles.privacyLink}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.text.tertiary} />
          <Text variant="caption" color={colors.text.tertiary} style={styles.privacyText}>
            Our Privacy Promise
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  orbitContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitCircle: {
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    borderWidth: 1,
    borderColor: 'rgba(232, 96, 60, 0.1)', // Primary color very faint
    top: -height * 0.15,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    maxWidth: 340,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    marginBottom: spacing.lg,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 280,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  beginButton: {
    marginBottom: spacing.lg,
    height: 56, // Taller button for emphasis
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  privacyText: {
    marginLeft: spacing.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
});
