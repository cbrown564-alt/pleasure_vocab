import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Container, Button, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <Container style={styles.container} padding>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h1" align="center" style={styles.title}>
            Welcome
          </Text>
          <Text variant="body" align="center" color={colors.text.secondary} style={styles.subtitle}>
            A vocabulary builder for understanding and communicating about pleasure
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem
            title="Research-grounded"
            description="Built on peer-reviewed studies about what actually enhances pleasure"
          />
          <FeatureItem
            title="Build your vocabulary"
            description="Learn specific terms that make it easier to understand and discuss preferences"
          />
          <FeatureItem
            title="Private by design"
            description="All your data stays on your device. Nothing is ever uploaded."
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/onboarding/privacy')}
          fullWidth
          size="lg"
        />
      </View>
    </Container>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureDot} />
      <View style={styles.featureText}>
        <Text variant="h4">{title}</Text>
        <Text variant="bodySmall" style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing['2xl'],
  },
  header: {
    marginBottom: spacing['2xl'],
  },
  title: {
    marginBottom: spacing.md,
  },
  subtitle: {
    paddingHorizontal: spacing.lg,
  },
  features: {
    gap: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[500],
    marginTop: 8,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureDescription: {
    marginTop: spacing.xs,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
