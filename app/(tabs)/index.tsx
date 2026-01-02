import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ProgressBar } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcepts, useOnboarding, useStats } from '@/hooks/useDatabase';
import { concepts, getConceptById } from '@/data/vocabulary';

const goalMessages: Record<string, string> = {
  self_discovery: 'understanding your preferences',
  partner_communication: 'communicating with partners',
  expanding_knowledge: 'expanding your knowledge',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, getStatus } = useUserConcepts();
  const { goal } = useOnboarding();
  const { exploredCount, resonatesCount } = useStats();

  const totalCount = concepts.length;
  const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  // Find next unexplored concept
  const unexploredConcepts = concepts.filter(
    (c) => getStatus(c.id) === 'unexplored'
  );
  const nextConcept = unexploredConcepts[0];

  // Find recently explored concept to continue
  const recentlyExplored = userConcepts
    .filter((c) => c.status !== 'unexplored')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text variant="h2">Welcome back</Text>
          <TouchableOpacity
            onPress={() => router.push('/modal')}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        {goal && (
          <Text variant="body" color={colors.text.secondary} style={styles.goalText}>
            You're focused on {goalMessages[goal] || 'your journey'}
          </Text>
        )}
      </View>

      {/* Progress Card */}
      <Card variant="elevated" padding="lg" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text variant="h4">Your Progress</Text>
            <Text variant="bodySmall" color={colors.text.secondary}>
              {exploredCount} of {totalCount} concepts explored
            </Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="heart" size={16} color={colors.primary[500]} />
            <Text variant="label" color={colors.primary[500]}>
              {resonatesCount}
            </Text>
          </View>
        </View>
        <ProgressBar progress={progress} style={styles.progressBar} />
        <TouchableOpacity
          style={styles.viewProfileLink}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text variant="label" color={colors.primary[500]}>
            View your profile
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary[500]} />
        </TouchableOpacity>
      </Card>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Quick Actions
        </Text>

        {/* Next Concept to Explore */}
        {nextConcept && (
          <Card
            variant="elevated"
            padding="md"
            style={styles.actionCard}
            onPress={() => router.push(`/concept/${nextConcept.id}`)}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="sparkles" size={24} color={colors.primary[500]} />
            </View>
            <View style={styles.actionContent}>
              <Text variant="label" color={colors.text.secondary}>
                Next to explore
              </Text>
              <Text variant="h4">{nextConcept.name}</Text>
              <Text variant="bodySmall" numberOfLines={1}>
                {nextConcept.definition}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </Card>
        )}

        {/* Continue Where You Left Off */}
        {recentlyExplored && (
          <Card
            variant="outlined"
            padding="md"
            style={styles.actionCard}
            onPress={() => router.push(`/concept/${recentlyExplored.concept_id}`)}
          >
            <View style={[styles.actionIcon, styles.actionIconSecondary]}>
              <Ionicons name="refresh" size={24} color={colors.secondary[500]} />
            </View>
            <View style={styles.actionContent}>
              <Text variant="label" color={colors.text.secondary}>
                Continue exploring
              </Text>
              <Text variant="h4">
                {getConceptById(recentlyExplored.concept_id)?.name}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </Card>
        )}

        {/* Journal Prompt */}
        <Card
          variant="filled"
          padding="md"
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/journal')}
        >
          <View style={[styles.actionIcon, styles.actionIconTertiary]}>
            <Ionicons name="create" size={24} color={colors.neutral[600]} />
          </View>
          <View style={styles.actionContent}>
            <Text variant="label" color={colors.text.secondary}>
              Reflection
            </Text>
            <Text variant="h4">Write in your journal</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
        </Card>
      </View>

      {/* All Explored State */}
      {unexploredConcepts.length === 0 && (
        <Card variant="elevated" padding="lg" style={styles.completedCard}>
          <Ionicons
            name="checkmark-circle"
            size={48}
            color={colors.secondary[500]}
            style={styles.completedIcon}
          />
          <Text variant="h4" align="center">
            You've explored all concepts!
          </Text>
          <Text
            variant="bodySmall"
            align="center"
            color={colors.text.secondary}
            style={styles.completedText}
          >
            Visit your Profile to review what resonates with you, or use the
            Journal to reflect on your discoveries.
          </Text>
        </Card>
      )}

      {/* Tip Card */}
      <Card variant="filled" padding="md" style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Ionicons name="bulb-outline" size={20} color={colors.secondary[600]} />
          <Text variant="label" color={colors.secondary[600]} style={styles.tipLabel}>
            Tip
          </Text>
        </View>
        <Text variant="bodySmall">
          Take your time with each concept. There's no rush—the goal is to build
          understanding and vocabulary at your own pace.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    padding: spacing.xs,
  },
  goalText: {
    marginTop: spacing.xs,
  },
  progressCard: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  progressBar: {
    marginBottom: spacing.md,
  },
  viewProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionIconSecondary: {
    backgroundColor: colors.secondary[100],
  },
  actionIconTertiary: {
    backgroundColor: colors.neutral[200],
  },
  actionContent: {
    flex: 1,
  },
  completedCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  completedIcon: {
    marginBottom: spacing.md,
  },
  completedText: {
    marginTop: spacing.sm,
  },
  tipCard: {
    backgroundColor: colors.secondary[50],
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipLabel: {
    marginLeft: spacing.xs,
  },
});
