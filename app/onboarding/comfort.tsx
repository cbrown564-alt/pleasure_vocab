import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Container, Button, Text, Card } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useOnboarding } from '@/hooks/useDatabase';
import { ComfortLevel } from '@/types';

interface ComfortOption {
  id: ComfortLevel;
  title: string;
  description: string;
  example: string;
}

const comfortLevels: ComfortOption[] = [
  {
    id: 'clinical',
    title: 'Clinical',
    description: 'Medical and anatomical language',
    example: '"External clitoral stimulation during penetrative intercourse"',
  },
  {
    id: 'balanced',
    title: 'Balanced',
    description: 'Clear but not overly clinical',
    example: '"Adding clitoral touch during penetration"',
  },
  {
    id: 'direct',
    title: 'Warm & Direct',
    description: 'Approachable everyday language',
    example: '"Touching yourself while having sex"',
  },
];

export default function ComfortScreen() {
  const { update } = useOnboarding();
  const [selected, setSelected] = useState<ComfortLevel>('direct');

  const handleContinue = async () => {
    await update({ comfortLevel: selected });
    router.push('/onboarding/first-concept');
  };

  return (
    <Container style={styles.container} padding>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            Choose your comfort level
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            How would you like content to be written? You can adjust this anytime in settings.
          </Text>
        </View>

        <View style={styles.options}>
          {comfortLevels.map((level) => (
            <ComfortCard
              key={level.id}
              level={level}
              isSelected={selected === level.id}
              onSelect={() => setSelected(level.id)}
            />
          ))}
        </View>

        <Card variant="filled" padding="md" style={styles.previewCard}>
          <Text variant="labelSmall" style={styles.previewLabel}>
            Preview
          </Text>
          <Text variant="body">
            {comfortLevels.find((l) => l.id === selected)?.example}
          </Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
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

function ComfortCard({
  level,
  isSelected,
  onSelect,
}: {
  level: ComfortOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.comfortCard, isSelected && styles.comfortCardSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.radioContainer}>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
      <View style={styles.comfortText}>
        <Text
          variant="h4"
          color={isSelected ? colors.primary[700] : colors.text.primary}
        >
          {level.title}
        </Text>
        <Text variant="bodySmall">{level.description}</Text>
      </View>
    </TouchableOpacity>
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
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  options: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  comfortCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: colors.neutral[200],
  },
  comfortCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  radioContainer: {
    marginRight: spacing.md,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  comfortText: {
    flex: 1,
  },
  previewCard: {
    backgroundColor: colors.background.tertiary,
  },
  previewLabel: {
    marginBottom: spacing.xs,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
