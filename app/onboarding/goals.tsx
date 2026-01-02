import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Container, Button, Text } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useOnboarding } from '@/hooks/useDatabase';
import { UserGoal } from '@/types';

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
    description: 'I want to better understand my own preferences and what feels good to me',
  },
  {
    id: 'partner_communication',
    icon: 'chatbubbles',
    title: 'Partner communication',
    description: 'I want language to communicate more clearly with my partner',
  },
  {
    id: 'expanding_knowledge',
    icon: 'book',
    title: 'Expanding knowledge',
    description: "I'm curious to learn more about pleasure research and vocabulary",
  },
];

export default function GoalsScreen() {
  const { update } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);

  const handleContinue = async () => {
    if (selectedGoal) {
      await update({ goal: selectedGoal });
      router.push('/onboarding/comfort');
    }
  };

  return (
    <Container style={styles.container} padding>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            What brings you here?
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            This helps us personalize your experience. You can always change this later.
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
      </View>

      <View style={styles.footer}>
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
    </Container>
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
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
        <Ionicons
          name={goal.icon}
          size={24}
          color={isSelected ? colors.primary[600] : colors.neutral[500]}
        />
      </View>
      <View style={styles.goalText}>
        <Text
          variant="h4"
          color={isSelected ? colors.primary[700] : colors.text.primary}
        >
          {goal.title}
        </Text>
        <Text variant="bodySmall" style={styles.goalDescription}>
          {goal.description}
        </Text>
      </View>
      <View style={styles.checkContainer}>
        {isSelected ? (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
        ) : (
          <View style={styles.unchecked} />
        )}
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
    gap: spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: colors.neutral[200],
  },
  goalCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary[100],
  },
  goalText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  goalDescription: {
    marginTop: spacing.xs,
  },
  checkContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
