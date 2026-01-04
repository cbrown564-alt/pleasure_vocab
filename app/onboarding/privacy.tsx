import { Button, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {/* Shield Visual */}
          <View style={styles.shieldContainer}>
            <View style={styles.shieldRing}>
              <Ionicons name="shield-checkmark" size={48} color={colors.secondary[600]} />
            </View>
          </View>

          <Text variant="h2" align="center" style={styles.title}>
            Your privacy is protected
          </Text>
          <Text variant="body" align="center" color={colors.text.secondary} style={styles.subtitle}>
            We designed this app with privacy as a core principle, not an afterthought.
          </Text>
        </View>

        <View style={styles.features}>
          <PrivacyFeature
            icon="server-outline"
            title="Local-only storage"
            description="All your preferences and journal entries are stored only on this device."
          />
          <PrivacyFeature
            icon="eye-off-outline"
            title="No tracking"
            description="We don't track what content you view or which concepts resonate with you."
          />
          <PrivacyFeature
            icon="lock-closed-outline"
            title="App lock ready"
            description="You will be able to enable biometric protection in settings."
          />
          <PrivacyFeature
            icon="trash-outline"
            title="Easy deletion"
            description="Clear all your data at any time. It's permanently removed."
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Return to Welcome"
          onPress={() => router.back()}
          variant="outline"
          fullWidth
          size="lg"
        />
      </View>
    </View>
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
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color={colors.secondary[700]} />
      </View>
      <View style={styles.featureContent}>
        <Text variant="h4" style={styles.featureTitle}>
          {title}
        </Text>
        <Text variant="bodySmall" color={colors.text.secondary}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  shieldContainer: {
    marginBottom: spacing.lg,
  },
  shieldRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    maxWidth: 300,
  },
  features: {
    gap: spacing.lg,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 4,
  },
  spacer: {
    height: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.background.secondary,
  }
});
