import { Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { getAllExplainers } from '@/data/explainers';
import { concepts } from '@/data/vocabulary';
import { useOnboarding, useStats, useUserConcepts } from '@/hooks/useDatabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const GREETINGS = {
  morning: 'Good morning.',
  afternoon: 'Good afternoon.',
  evening: 'Good evening.',
};

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts } = useUserConcepts();
  const { isOnboarded } = useOnboarding();
  const { exploredCount } = useStats();

  const totalCount = concepts.length;

  // Time-based greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? GREETINGS.morning
      : currentHour < 18
        ? GREETINGS.afternoon
        : GREETINGS.evening;

  // Daily suggestion (Mock logic: First non-explored or specific ID)
  // In a real app, this would be computed daily
  // For now, let's pick a random "Curious" one or fallback to the first one
  const suggestionId = 'plateauing'; // Hardcoded for demo stability as requested before
  const suggestion = concepts.find((c) => c.id === suggestionId) || concepts[0];

  // Science articles
  const articles = getAllExplainers().slice(0, 3);

  // Resume Concept (Most recently modified or just the last one in list)
  // Logic: Find the last concept the user interacted with.
  // For now, we'll maintain the mock behavior or pick one.
  const resumeConcept = userConcepts.length > 0
    ? concepts.find(c => c.id === userConcepts[0].concept_id)
    : null;

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header & Greeting */}
      <View style={styles.header}>
        <Text variant="label" color={colors.primary[600]} style={{ letterSpacing: 1.5 }}>
          UNDERSTANDING YOURSELF
        </Text>
        <Text variant="h1" style={styles.greetingTitle}>
          {greeting}
        </Text>
        <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing.xs }}>
          Ready to discover something new about yourself?
        </Text>
      </View>

      {/* 2. Daily Suggestion Hero */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>Daily Suggestion</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/concept/${suggestion.id}`)}
        >
          <LinearGradient
            colors={[colors.primary[600], colors.primary[700]]} // Rich Coral Gradient
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroHeader}>
              <View style={styles.categoryPill}>
                <Text variant="labelSmall" color={colors.text.inverse}>{suggestion.category}</Text>
              </View>
              <Ionicons name="sparkles" size={20} color={colors.text.inverse} />
            </View>

            <View style={styles.heroContent}>
              <Text variant="h1" color={colors.text.inverse} style={styles.heroTitle}>
                {suggestion.name}
              </Text>
              <Text variant="body" color={colors.text.inverse} style={styles.heroDescription} numberOfLines={3}>
                {suggestion.definition}
              </Text>
            </View>

            <View style={styles.heroFooter}>
              <Text variant="bodyBold" color={colors.text.inverse}>Start Exploring</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.text.inverse} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 3. Stats Row (Polished) */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="h2" color={colors.secondary[700]} style={styles.statNumber}>{exploredCount}</Text>
          <Text variant="caption" color={colors.text.tertiary}>Concepts Explored</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text variant="h2" color={colors.secondary[700]} style={styles.statNumber}>
            {Math.round((exploredCount / Math.max(totalCount, 1)) * 100)}%
          </Text>
          <Text variant="caption" color={colors.text.tertiary}>Journey Complete</Text>
        </View>
      </View>

      {/* 4. Journey Section (Bento Layout) */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>Continue Journey</Text>

        {/* Primary Action: Resume */}
        <TouchableOpacity
          style={styles.resumeCard}
          onPress={() => resumeConcept ? router.push(`/concept/${resumeConcept.id}`) : router.push('/(tabs)/library')}
        >
          <View style={styles.resumeIcon}>
            <Ionicons name={resumeConcept ? "time" : "play"} size={24} color={colors.secondary[700]} />
          </View>
          <View style={styles.resumeContent}>
            <Text variant="labelSmall" color={colors.secondary[600]}>
              {resumeConcept ? 'PICK UP WHERE YOU LEFT OFF' : 'START FRESH'}
            </Text>
            <Text variant="h3" color={colors.text.primary}>
              {resumeConcept ? resumeConcept.name : 'Start a new path'}
            </Text>
          </View>
          <View style={styles.resumeArrow}>
            <Ionicons name="chevron-forward" size={24} color={colors.neutral[300]} />
          </View>
        </TouchableOpacity>

        {/* Secondary Actions: Grid */}
        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(tabs)/library')}>
            <View style={[styles.featureIcon, { backgroundColor: colors.neutral[100] }]}>
              <Ionicons name="library" size={24} color={colors.text.primary} />
            </View>
            <Text variant="bodyBold">Library</Text>
            <Text variant="caption" color={colors.text.tertiary}>Browse all</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/(tabs)/library')}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary[50] }]}>
              <Ionicons name="shuffle" size={24} color={colors.primary[600]} />
            </View>
            <Text variant="bodyBold">Shuffle</Text>
            <Text variant="caption" color={colors.text.tertiary}>Discover</Text>
          </TouchableOpacity>
        </View>
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

  // Header
  header: {
    marginBottom: spacing['2xl'],
  },
  greetingTitle: {
    fontSize: 36,
    marginTop: spacing.xs,
  },

  // Hero
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.text.secondary,
  },
  heroCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    minHeight: 280,
    justifyContent: 'space-between',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  heroTitle: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[200],
  },

  // Journey (Action Grid)
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resumeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary[50], // light sage
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  resumeContent: {
    flex: 1,
  },
  resumeArrow: {
    marginLeft: spacing.md,
  },

  featuresGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.md, // slightly larger padding
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12, // soft square
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  // Articles
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    marginBottom: spacing.md,
  },
  articleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  articleContent: {
    flex: 1,
  },
});
