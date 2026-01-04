import { Text } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { getAllExplainers } from '@/data/explainers';
import { concepts, getConceptById } from '@/data/vocabulary';
import { useOnboarding, useStats, useUserConcepts } from '@/hooks/useDatabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const goalMessages: Record<string, string> = {
  self_discovery: 'Understanding yourself',
  partner_communication: 'Better communication',
  expanding_knowledge: 'Expanding horizons',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, getStatus } = useUserConcepts();
  const { goal } = useOnboarding();
  const { exploredCount } = useStats();

  const totalCount = concepts.length;
  // const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  // Find next unexplored concept
  const unexploredConcepts = concepts.filter(
    (c) => getStatus(c.id) === 'unexplored'
  );
  const nextConcept = unexploredConcepts[0];

  // Find recently explored concept to continue
  const recentlyExplored = userConcepts
    .filter((c) => c.status !== 'unexplored')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  const explainers = getAllExplainers();

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Greeting */}
      <View style={styles.header}>
        <Text variant="label" color={colors.text.accent} style={styles.greetingLabel}>
          {goal ? goalMessages[goal] : 'Your Journey'}
        </Text>
        <Text variant="h1" style={styles.greetingTitle}>
          Good evening.
        </Text>
        <Text variant="body" style={styles.greetingSubtitle}>
          Ready to discover something new about yourself?
        </Text>
      </View>

      {/* Primary Action / Featured Card */}
      {nextConcept ? (
        <View style={styles.featuredSection}>
          <Text variant="label" style={styles.sectionLabel}>Daily Suggestion</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.featuredCard}
            onPress={() => router.push(`/concept/${nextConcept.id}`)}
          >
            <View style={styles.featuredCardContent}>
              <View style={styles.featuredCardHeader}>
                <View style={styles.categoryTag}>
                  <Text variant="labelSmall" color={colors.text.inverse}>
                    {nextConcept.category}
                  </Text>
                </View>
                <Ionicons name="sparkles" size={20} color={colors.text.inverse} />
              </View>

              <View style={styles.featuredCardText}>
                <Text variant="h2" color={colors.text.inverse} style={styles.featuredTitle}>
                  {nextConcept.name}
                </Text>
                <Text variant="body" color="rgba(255,255,255,0.9)" numberOfLines={2}>
                  {nextConcept.definition}
                </Text>
              </View>

              <View style={styles.featuredCardFooter}>
                <Text variant="label" color={colors.text.inverse}>Start Exploring</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.text.inverse} />
              </View>
            </View>
            <View style={styles.featuredCardBackground} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.completedHero}>
          <Text variant="h3">All concepts explored!</Text>
          <Text variant="body">Time to reflect and deepen your practice.</Text>
        </View>
      )}

      {/* Progress / stats strip */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="h2" style={styles.statValue}>{exploredCount}</Text>
          <Text variant="caption">Concepts Explored</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text variant="h2" style={styles.statValue}>
            {Math.round((exploredCount / totalCount) * 100)}%
          </Text>
          <Text variant="caption">Journey Complete</Text>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>Continue</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScroll}>

          {/* Resume Previous */}
          {recentlyExplored && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(`/concept/${recentlyExplored.concept_id}`)}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary[100] }]}>
                <Ionicons name="time" size={24} color={colors.secondary[700]} />
              </View>
              <Text variant="bodyBold" style={styles.actionText}>Resume</Text>
              <Text variant="caption" numberOfLines={1}>
                {getConceptById(recentlyExplored.concept_id)?.name}
              </Text>
            </TouchableOpacity>
          )}

          {/* Library Shortcut */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/library')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.neutral[100] }]}>
              <Ionicons name="library" size={24} color={colors.neutral[700]} />
            </View>
            <Text variant="bodyBold" style={styles.actionText}>Library</Text>
            <Text variant="caption">Browse all</Text>
          </TouchableOpacity>

          {/* Random / Surprise Me (Future feature) */}
          <TouchableOpacity
            style={styles.actionCard}
          // onPress={() => router.push('/random')} 
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary[100] }]}>
              <Ionicons name="shuffle" size={24} color={colors.primary[600]} />
            </View>
            <Text variant="bodyBold" style={styles.actionText}>Shuffle</Text>
            <Text variant="caption">Discover random</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* Research / Science Teaser */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h4">Science & Insight</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/library?view=research')}>
            <Text variant="label" color={colors.primary[600]}>See All</Text>
          </TouchableOpacity>
        </View>

        {explainers.slice(0, 2).map((explainer) => (
          <TouchableOpacity
            key={explainer.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/explainer/${explainer.id}`)}
            style={styles.explainerRow}
          >
            <View style={styles.explainerIcon}>
              <Ionicons name={explainer.icon as any} size={20} color={colors.secondary[600]} />
            </View>
            <View style={styles.explainerContent}>
              <Text variant="bodyBold">{explainer.title}</Text>
              <Text variant="caption">{explainer.readTime} read</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greetingLabel: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  greetingTitle: {
    marginBottom: spacing.xs,
  },
  greetingSubtitle: {
    color: colors.text.secondary,
    maxWidth: '80%',
  },

  // Featured Section
  featuredSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  featuredCard: {
    height: 320,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.lg,
    backgroundColor: colors.primary[500], // Fallback
  },
  featuredCardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary[600], // Simulate gradient or image
    zIndex: -1,
  },
  featuredCardContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  featuredCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  featuredCardText: {
    marginBottom: spacing.md,
  },
  featuredTitle: {
    fontSize: 32, // Custom large size
    marginBottom: spacing.sm,
  },
  featuredCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  completedHero: {
    padding: spacing.xl,
    backgroundColor: colors.secondary[100],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary, // Light cream strip
    borderRadius: borderRadius.lg,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.primary[600],
    marginBottom: -4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[200],
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionScroll: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  actionCard: {
    width: 110,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.surface,
    ...shadows.sm,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    marginBottom: 2,
  },

  // Explainer Rows
  explainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  explainerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  explainerContent: {
    flex: 1,
  },
});
