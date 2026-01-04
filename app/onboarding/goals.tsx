import { Button, Text } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/useDatabase';
import { UserGoal } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GoalOption {
  id: UserGoal;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const goals: GoalOption[] = [
  {
    id: 'self_discovery',
    icon: 'compass',
    title: 'Self-discovery',
    description: 'I want to better understand my own preferences.',
  },
  {
    id: 'partner_communication',
    icon: 'chatbubbles',
    title: 'Partner communication',
    description: 'I want language to communicate clearly with my partner.',
  },
  {
    id: 'expanding_knowledge',
    icon: 'book',
    title: 'Expanding knowledge',
    description: "I'm curious to learn more about pleasure research.",
  },
];

export default function GoalsScreen() {
  const { update, completeOnboarding } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const insets = useSafeAreaInsets();

  const handleContinue = async () => {
    if (selectedGoal) {
      await update({ goal: selectedGoal });
      await completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            What brings you here?
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Select a focus to personalize your path.
          </Text>
        </View>

        <View style={styles.options}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isSelected={selectedGoal === goal.id}
              onSelect={() => setSelectedGoal(goal.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedGoal}
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

function GoalCard({
  goal,
  isSelected,
  onSelect,
}: {
  goal: GoalOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.goalCard, isSelected && styles.goalCardSelected]}
      onPress={onSelect}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
        <Ionicons
          name={goal.icon}
          size={28}
          color={isSelected ? colors.primary[600] : colors.neutral[500]}
        />
      </View>
      <View style={styles.goalText}>
        <Text
          variant="h4"
          style={{ fontSize: 18, marginBottom: 4 }}
          color={isSelected ? colors.primary[700] : colors.text.primary}
        >
          {goal.title}
        </Text>
        <Text variant="bodySmall" style={styles.goalDescription} color={colors.text.secondary}>
          {goal.description}
        </Text>
      </View>

      {isSelected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
        </View>
      )}
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
    marginBottom: spacing.xs,
  },
  options: {
    gap: spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  goalCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
    ...shadows.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.background.primary,
  },
  goalText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  goalDescription: {
    lineHeight: 20,
  },
  checkmark: {
    marginLeft: spacing.xs,
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
