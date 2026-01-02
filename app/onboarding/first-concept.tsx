import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Container, Button, Text, Card } from '@/components/ui';
import { ResonanceSelector } from '@/components/ResonanceSelector';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useOnboarding, useUserConcept } from '@/hooks/useDatabase';
import { concepts } from '@/data/vocabulary';
import { ConceptStatus } from '@/types';

// Start with "Pairing" as it's often the most immediately recognizable
const firstConcept = concepts.find((c) => c.id === 'pairing')!;

export default function FirstConceptScreen() {
  const { completeOnboarding } = useOnboarding();
  const { setStatus } = useUserConcept(firstConcept.id);
  const [selectedStatus, setSelectedStatus] = useState<ConceptStatus>('explored');

  const handleComplete = async () => {
    await setStatus(selectedStatus);
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <Container style={styles.container} padding={false}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={16} color={colors.primary[600]} />
            <Text variant="labelSmall" color={colors.primary[600]} style={styles.badgeText}>
              Your First Concept
            </Text>
          </View>
          <Text variant="h1" style={styles.title}>
            {firstConcept.name}
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            {firstConcept.definition}
          </Text>
        </View>

        <Card variant="elevated" padding="lg" style={styles.descriptionCard}>
          <Text variant="body" style={styles.description}>
            {firstConcept.description}
          </Text>
        </Card>

        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Research Basis
          </Text>
          <Text variant="bodySmall">{firstConcept.researchBasis}</Text>
          <Text variant="caption" style={styles.source}>
            Source: {firstConcept.source}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Reflection Prompts
          </Text>
          {firstConcept.recognitionPrompts.map((prompt, index) => (
            <View key={index} style={styles.prompt}>
              <View style={styles.promptDot} />
              <Text variant="body" style={styles.promptText}>
                {prompt}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.resonanceSection}>
          <ResonanceSelector
            currentStatus={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </View>

        <View style={styles.encouragement}>
          <Ionicons name="heart" size={20} color={colors.primary[400]} />
          <Text variant="bodySmall" color={colors.text.secondary} style={styles.encouragementText}>
            There are no wrong answers. This is about discovering what resonates with your experience.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          fullWidth
          size="lg"
        />
        <Text variant="caption" align="center" style={styles.footerNote}>
          You can explore more concepts in the Library
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    marginLeft: spacing.xs,
  },
  title: {
    marginBottom: spacing.sm,
  },
  descriptionCard: {
    marginBottom: spacing.lg,
  },
  description: {
    lineHeight: 26,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    color: colors.text.tertiary,
  },
  source: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  prompt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  promptDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[400],
    marginTop: 8,
    marginRight: spacing.sm,
  },
  promptText: {
    flex: 1,
  },
  resonanceSection: {
    marginBottom: spacing.md,
  },
  encouragement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  encouragementText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  footerNote: {
    marginTop: spacing.sm,
  },
});
