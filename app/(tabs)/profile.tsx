import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ProgressBar } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcepts, useOnboarding, useStats } from '@/hooks/useDatabase';
import { concepts, getConceptById, getConceptsByCategory } from '@/data/vocabulary';
import { ConceptStatus, ConceptCategory } from '@/types';

const goalLabels: Record<string, string> = {
  self_discovery: 'Self-discovery',
  partner_communication: 'Partner communication',
  expanding_knowledge: 'Expanding knowledge',
};

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing & Pacing',
  psychological: 'Psychological Factors',
  anatomy: 'Anatomy Understanding',
};

const categoryDescriptions: Record<ConceptCategory, string> = {
  technique: 'You\'re drawn to specific physical techniques and movements.',
  sensation: 'You appreciate vocabulary for describing how pleasure feels.',
  timing: 'Understanding rhythm and pacing resonates with you.',
  psychological: 'The mental and emotional aspects of pleasure speak to you.',
  anatomy: 'You value understanding how your body works.',
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

  // Calculate pattern insights
  const patternInsights = useMemo(() => {
    if (resonatesConcepts.length < 2) return null;

    // Count resonating concepts by category
    const categoryCounts: Record<string, number> = {};
    resonatesConcepts.forEach((uc) => {
      const concept = getConceptById(uc.concept_id);
      if (concept) {
        categoryCounts[concept.category] = (categoryCounts[concept.category] || 0) + 1;
      }
    });

    // Find categories with the most resonating concepts
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count >= 1);

    if (sortedCategories.length === 0) return null;

    const topCategory = sortedCategories[0][0] as ConceptCategory;
    const topCategoryCount = sortedCategories[0][1];
    const totalInCategory = getConceptsByCategory(topCategory).length;

    return {
      topCategory,
      topCategoryCount,
      totalInCategory,
      allCategories: sortedCategories as [ConceptCategory, number][],
    };
  }, [resonatesConcepts]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text variant="h2">Your Profile</Text>
          <TouchableOpacity
            onPress={() => router.push('/modal')}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
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

        {/* Pattern Insights */}
        {patternInsights && (
          <Card variant="filled" padding="md" style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Ionicons name="sparkles" size={20} color={colors.primary[500]} />
              <Text variant="h4" style={styles.insightsTitle}>
                Pattern Insights
              </Text>
            </View>
            <Text variant="body" style={styles.insightsText}>
              You're drawn to <Text style={styles.bold}>{categoryLabels[patternInsights.topCategory]}</Text> -{' '}
              {patternInsights.topCategoryCount} of {patternInsights.totalInCategory} concepts resonate with you.
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary} style={styles.insightsDescription}>
              {categoryDescriptions[patternInsights.topCategory]}
            </Text>

            {patternInsights.allCategories.length > 1 && (
              <View style={styles.categoryBreakdown}>
                {patternInsights.allCategories.map(([category, count]) => (
                  <View key={category} style={styles.categoryRow}>
                    <Text variant="bodySmall">{categoryLabels[category]}</Text>
                    <View style={styles.categoryCount}>
                      <Text variant="label" color={colors.primary[500]}>
                        {count}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Tools Section */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Tools
          </Text>

          <Card
            variant="outlined"
            padding="md"
            style={styles.toolCard}
            onPress={() => router.push('/communicate')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="chatbubbles" size={24} color={colors.secondary[500]} />
            </View>
            <View style={styles.toolContent}>
              <Text variant="h4">Communication Toolkit</Text>
              <Text variant="bodySmall" color={colors.text.secondary}>
                Phrases and scripts for talking about pleasure
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </Card>

          <Card
            variant="outlined"
            padding="md"
            style={styles.toolCard}
            onPress={() => router.push('/share')}
          >
            <View style={[styles.toolIcon, { backgroundColor: colors.primary[50] }]}>
              <Ionicons name="share-social" size={24} color={colors.primary[500]} />
            </View>
            <View style={styles.toolContent}>
              <Text variant="h4">Share with Partner</Text>
              <Text variant="bodySmall" color={colors.text.secondary}>
                Create a summary of what resonates with you
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </Card>
        </View>

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
    </ScrollView>
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.md,
  },
  statsCard: {
    marginBottom: spacing.md,
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
  insightsCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  insightsTitle: {
    marginLeft: spacing.xs,
  },
  insightsText: {
    marginBottom: spacing.xs,
  },
  insightsDescription: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: '600',
  },
  categoryBreakdown: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primary[100],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  categoryCount: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  toolContent: {
    flex: 1,
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
