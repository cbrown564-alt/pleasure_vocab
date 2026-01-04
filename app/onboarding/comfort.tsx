import { Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/useDatabase';
import { ComfortLevel } from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    await update({ comfortLevel: selected });
    router.push('/onboarding/first-concept');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
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
          <Text variant="labelSmall" style={styles.previewLabel} color={colors.text.tertiary}>
            PREVIEW
          </Text>
          <Text variant="body" style={{ fontStyle: 'italic', lineHeight: 24 }}>
            {comfortLevels.find((l) => l.id === selected)?.example}
          </Text>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
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
    </View>
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
      activeOpacity={0.8}
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
        <Text variant="bodySmall" color={colors.text.secondary}>
          {level.description}
        </Text>
      </View>
    </TouchableOpacity>
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
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  options: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  comfortCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  comfortCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  radioContainer: {
    marginRight: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  comfortText: {
    flex: 1,
  },
  previewCard: {
    backgroundColor: colors.background.tertiary,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[300],
  },
  previewLabel: {
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
