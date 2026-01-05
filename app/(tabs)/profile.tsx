import { Card, Text, ThemedView } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { concepts, getConceptById } from '@/data/vocabulary';
import { useOnboarding, useStats, useUserConcepts } from '@/hooks/useDatabase';
import { ConceptCategory } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const goalLabels: Record<string, string> = {
  self_discovery: 'Self-discovery',
  partner_communication: 'Partner communication',
  expanding_knowledge: 'Expanding knowledge',
};

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing & Pacing',
  psychological: 'Psychological',
  anatomy: 'Anatomy',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts } = useUserConcepts();
  const { goal } = useOnboarding();
  const { exploredCount, resonatesCount } = useStats();

  const totalCount = concepts.length;
  const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  // Group concepts
  const resonatesConcepts = userConcepts.filter((c) => c.status === 'resonates');

  // Calculate pattern insights
  const patternInsights = useMemo(() => {
    if (resonatesConcepts.length < 2) return null;

    const categoryCounts: Record<string, number> = {};
    resonatesConcepts.forEach((uc) => {
      const concept = getConceptById(uc.concept_id);
      if (concept) {
        categoryCounts[concept.category] = (categoryCounts[concept.category] || 0) + 1;
      }
    });

    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count >= 1);

    if (sortedCategories.length === 0) return null;

    const topCategory = sortedCategories[0][0] as ConceptCategory;
    const topCategoryCount = sortedCategories[0][1];

    return { topCategory, topCategoryCount };
  }, [resonatesConcepts]);

  return (
    <ThemedView colorKey="secondary" style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Identity Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text variant="h2" color={colors.primary[600]}>YOU</Text>
          </View>
          <View style={styles.headerText}>
            <Text variant="h2">Your Atelier</Text>
            <Text variant="bodySmall" color={colors.text.tertiary}>Member since January 2025</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/modal')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* 2. Core Vitals (Bento Box) */}
        <View style={styles.bentoContainer}>
          {/* Left Column: Big Progress */}
          <Card variant="filled" style={styles.bentoBig}>
            <View style={styles.bentoIcon}>
              <Ionicons name="compass" size={24} color={colors.secondary[600]} />
            </View>
            <View>
              <Text variant="h1" color={colors.secondary[800]} style={{ fontSize: 42 }}>{exploredCount}</Text>
              <Text variant="bodyBold" color={colors.secondary[600]}>Explored</Text>
              <Text variant="caption" color={colors.text.tertiary} style={{ marginTop: 4 }}>
                {Math.round(progress * 100)}% of library
              </Text>
            </View>
          </Card>

          {/* Right Column: Stack */}
          <View style={styles.bentoStack}>
            {/* Resonates */}
            <Card variant="elevated" style={styles.bentoSmall}>
              <View style={styles.rowCentered}>
                <View style={[styles.bentoIconSmall, { backgroundColor: colors.primary[50] }]}>
                  <Ionicons name="heart" size={18} color={colors.primary[600]} />
                </View>
                <View>
                  <Text variant="h3" color={colors.primary[700]}>{resonatesCount}</Text>
                  <Text variant="caption">Resonates</Text>
                </View>
              </View>
            </Card>

            {/* Goal */}
            <Card variant="outlined" style={styles.bentoSmall}>
              <Text variant="labelSmall" color={colors.text.tertiary}>CURRENT GOAL</Text>
              <Text variant="bodyBold" style={{ marginTop: 4 }} numberOfLines={2}>
                {goalLabels[goal || 'self_discovery']}
              </Text>
            </Card>
          </View>
        </View>

        {/* 3. Insight Spotlight */}
        {patternInsights && (
          <TouchableOpacity style={styles.insightWrapper} activeOpacity={0.9} onPress={() => router.push('/(tabs)/library')}>
            <LinearGradient
              colors={[colors.primary[600], colors.primary[800]]}
              style={styles.insightBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.insightContent}>
                <View style={styles.insightHeader}>
                  <Ionicons name="sparkles" size={16} color={colors.primary[200]} />
                  <Text variant="labelSmall" color={colors.primary[200]}>PATTERN FOUND</Text>
                </View>
                <Text variant="h3" color={colors.text.inverse}>
                  You have a strong connection to <Text style={{ fontStyle: 'italic' }}>{categoryLabels[patternInsights.topCategory]}</Text>.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary[200]} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* 4. Action List (Tools) */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>Practice & Share</Text>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/communicate')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary[50] }]}>
              <Ionicons name="chatbubbles-outline" size={24} color={colors.secondary[700]} />
            </View>
            <View style={styles.actionContent}>
              <Text variant="bodyBold">Communication Toolkit</Text>
              <Text variant="caption" color={colors.text.tertiary}>Scripts for better conversations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/share')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primary[50] }]}>
              <Ionicons name="share-social-outline" size={24} color={colors.primary[600]} />
            </View>
            <View style={styles.actionContent}>
              <Text variant="bodyBold">Export Profile</Text>
              <Text variant="caption" color={colors.text.tertiary}>Share your summary</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
          </TouchableOpacity>
        </View>

        {/* 5. The Collection (Shelf) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="h4">Your Collection</Text>
            <Text variant="caption" color={colors.text.tertiary}>{resonatesConcepts.length} items</Text>
          </View>

          {resonatesConcepts.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
              {resonatesConcepts.map((uc) => {
                const concept = getConceptById(uc.concept_id);
                if (!concept) return null;
                return (
                  <TouchableOpacity
                    key={uc.concept_id}
                    style={styles.miniCard}
                    onPress={() => router.push(`/concept/${uc.concept_id}`)}
                  >
                    <View style={[styles.miniCardBadge, { backgroundColor: colors.primary[100] }]}>
                      <Text variant="labelSmall" color={colors.primary[800]}>{concept.category.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <Text variant="bodyBold" numberOfLines={1}>{concept.name}</Text>
                    <Text variant="caption" color={colors.text.tertiary} numberOfLines={1}>{concept.category}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyShelf}>
              <Image
                source={require('@/assets/images/ui/empty-collection.png')}
                style={styles.emptyShelfIllustration}
                resizeMode="contain"
              />
              <Text variant="bodySmall" style={{ fontStyle: 'italic', textAlign: 'center' }} color={colors.text.tertiary}>
                Your collection is empty. Explore concepts to start building your profile.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // 1. Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.background.primary,
    ...shadows.sm,
  },
  headerText: {
    flex: 1,
  },
  settingsButton: {
    padding: spacing.xs,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },

  // 2. Bento Grid
  bentoContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    height: 200, // Fixed total height for the Bento block
    marginBottom: spacing['2xl'],
  },
  bentoBig: { // Left Column
    flex: 1.2,
    backgroundColor: colors.background.primary,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  bentoStack: { // Right Column
    flex: 1,
    gap: spacing.md,
  },
  bentoSmall: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.primary,
  },
  bentoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 3. Insight
  insightWrapper: {
    marginBottom: spacing['2xl'],
    ...shadows.md,
  },
  insightBanner: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  // 4. Action List
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },

  // 5. Shelf
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shelfScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  miniCard: {
    width: 140,
    height: 140,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  miniCardBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyShelf: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  emptyShelfIllustration: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
    opacity: 0.6,
  },
});
