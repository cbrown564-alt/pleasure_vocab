import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Container, Button, Text, Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

export default function PrivacyScreen() {
  return (
    <Container style={styles.container} padding scroll>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={48} color={colors.secondary[500]} />
          </View>
          <Text variant="h2" align="center" style={styles.title}>
            Your privacy is protected
          </Text>
          <Text variant="body" align="center" color={colors.text.secondary}>
            We designed this app with privacy as a core principle, not an afterthought.
          </Text>
        </View>

        <View style={styles.features}>
          <PrivacyFeature
            icon="phone-portrait-outline"
            title="Local-only storage"
            description="All your preferences, journal entries, and progress are stored only on this device. Nothing is uploaded to any server."
          />
          <PrivacyFeature
            icon="eye-off-outline"
            title="No tracking"
            description="We don't track what content you view or which concepts resonate with you. Your exploration is completely private."
          />
          <PrivacyFeature
            icon="lock-closed-outline"
            title="App lock available"
            description="You can enable biometric or PIN protection to keep the app private even if someone else uses your phone."
          />
          <PrivacyFeature
            icon="trash-outline"
            title="Easy data deletion"
            description="You can clear all your data at any time from the settings. It's permanently removed—we don't keep backups."
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.push('/onboarding/goals')}
          fullWidth
          size="lg"
        />
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="ghost"
          fullWidth
          style={styles.backButton}
        />
      </View>
    </Container>
  );
}

function PrivacyFeature({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <Card variant="filled" padding="md" style={styles.feature}>
      <View style={styles.featureHeader}>
        <Ionicons name={icon} size={24} color={colors.secondary[600]} />
        <Text variant="h4" style={styles.featureTitle}>
          {title}
        </Text>
      </View>
      <Text variant="bodySmall">{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  features: {
    gap: spacing.md,
  },
  feature: {
    marginBottom: 0,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureTitle: {
    marginLeft: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
