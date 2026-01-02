import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ProgressBar } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcepts, useOnboarding, useStats } from '@/hooks/useDatabase';
import { concepts, getConceptById } from '@/data/vocabulary';
import { ConceptStatus } from '@/types';

const goalLabels: Record<string, string> = {
  self_discovery: 'Self-discovery',
  partner_communication: 'Partner communication',
  expanding_knowledge: 'Expanding knowledge',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, getStatus } = useUserConcepts();
  const { goal } = useOnboarding();
  const { exploredCount, resonatesCount } = useStats();

  const totalCount = concepts.length;
  const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  // Group concepts by status
  const resonatesConcepts = userConcepts.filter((c) => c.status === 'resonates');
  const curiousConcepts = userConcepts.filter((c) => c.status === 'curious');
  const exploredConcepts = userConcepts.filter((c) => c.status === 'explored');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="h2">Your Profile</Text>
        {goal && (
          <Text variant="bodySmall" color={colors.text.secondary}>
            Goal: {goalLabels[goal]}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Stats Overview */}
        <Card variant="elevated" padding="lg" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatItem
              value={exploredCount}
              label="Explored"
              total={totalCount}
              color={colors.secondary[500]}
            />
            <View style={styles.statsDivider} />
            <StatItem
              value={resonatesCount}
              label="Resonates"
              color={colors.primary[500]}
            />
            <View style={styles.statsDivider} />
            <StatItem
              value={curiousConcepts.length}
              label="Curious"
              color={colors.warning}
            />
          </View>
          <View style={styles.progressSection}>
            <ProgressBar progress={progress} />
            <Text variant="caption" style={styles.progressLabel}>
              {Math.round(progress * 100)}% of vocabulary explored
            </Text>
          </View>
        </Card>

        {/* What Resonates */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            What Resonates With You
          </Text>
          {resonatesConcepts.length > 0 ? (
            <View style={styles.conceptList}>
              {resonatesConcepts.map((uc) => {
                const concept = getConceptById(uc.concept_id);
                if (!concept) return null;
                return (
                  <ConceptChip
                    key={uc.concept_id}
                    name={concept.name}
                    status="resonates"
                    onPress={() => router.push(`/concept/${uc.concept_id}`)}
                  />
                );
              })}
            </View>
          ) : (
            <Text variant="bodySmall" color={colors.text.tertiary}>
              Explore concepts in the Library and mark what resonates with you.
            </Text>
          )}
        </View>

        {/* Curious to Explore */}
        {curiousConcepts.length > 0 && (
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              Curious to Explore
            </Text>
            <View style={styles.conceptList}>
              {curiousConcepts.map((uc) => {
                const concept = getConceptById(uc.concept_id);
                if (!concept) return null;
                return (
                  <ConceptChip
                    key={uc.concept_id}
                    name={concept.name}
                    status="curious"
                    onPress={() => router.push(`/concept/${uc.concept_id}`)}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Explored but not categorized */}
        {exploredConcepts.length > 0 && (
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              Explored
            </Text>
            <View style={styles.conceptList}>
              {exploredConcepts.map((uc) => {
                const concept = getConceptById(uc.concept_id);
                if (!concept) return null;
                return (
                  <ConceptChip
                    key={uc.concept_id}
                    name={concept.name}
                    status="explored"
                    onPress={() => router.push(`/concept/${uc.concept_id}`)}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Empty state */}
        {exploredCount === 0 && (
          <Card variant="filled" padding="lg" style={styles.emptyCard}>
            <Ionicons
              name="compass-outline"
              size={48}
              color={colors.neutral[400]}
              style={styles.emptyIcon}
            />
            <Text variant="body" align="center" color={colors.text.secondary}>
              Start exploring concepts in the Library to build your preference
              profile.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/library')}
            >
              <Text variant="label" color={colors.primary[500]}>
                Go to Library
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary[500]} />
            </TouchableOpacity>
          </Card>
        )}
      </View>
    </View>
  );
}

function StatItem({
  value,
  label,
  total,
  color,
}: {
  value: number;
  label: string;
  total?: number;
  color: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text variant="h2" color={color}>
        {value}
        {total !== undefined && (
          <Text variant="body" color={colors.text.tertiary}>
            /{total}
          </Text>
        )}
      </Text>
      <Text variant="caption">{label}</Text>
    </View>
  );
}

function ConceptChip({
  name,
  status,
  onPress,
}: {
  name: string;
  status: ConceptStatus;
  onPress: () => void;
}) {
  const statusColors: Record<string, string> = {
    resonates: colors.primary[100],
    curious: colors.warning + '30',
    explored: colors.secondary[100],
  };

  return (
    <TouchableOpacity
      style={[styles.conceptChip, { backgroundColor: statusColors[status] || colors.neutral[100] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text variant="label" color={colors.text.primary}>
        {name}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    backgroundColor: colors.neutral[200],
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  progressLabel: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  conceptList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  conceptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
});
