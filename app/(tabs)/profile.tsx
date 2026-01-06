import { Card, Text, ThemedView } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { concepts, getConceptById } from '@/data/vocabulary';
import { useOnboarding, useStats, useUserConcepts } from '@/hooks/useDatabase';
import { ConceptCategory } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
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

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technique': return require('@/assets/images/ui/category-technique.png');
    case 'sensation': return require('@/assets/images/ui/category-sensation.png');
    case 'timing': return require('@/assets/images/ui/category-timing.png');
    case 'psychological': return require('@/assets/images/ui/category-psychological.png');
    case 'anatomy': return require('@/assets/images/ui/category-anatomy.png');
    default: return null;
  }
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, reload: reloadConcepts } = useUserConcepts();
  const { goal } = useOnboarding();
  const { exploredCount, resonatesCount, reload: reloadStats } = useStats();

  useFocusEffect(
    useCallback(() => {
      reloadConcepts();
      reloadStats();
    }, [reloadConcepts, reloadStats])
  );

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
    <ThemedView colorKey="background" style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="h1" style={styles.pageTitle}>Your Profile</Text>
            <Text variant="body" color={colors.text.secondary}>Your journey of discovery</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/modal')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* 2. Core Vitals (Bento Box) */}
        <View style={styles.bentoContainer}>
          {/* Left Column: Big Progress */}
          <Card variant="filled" style={styles.bentoBig}>
            <View style={styles.bentoIconWrapper}>
              <Image
                source={require('@/assets/images/ui/profile/stat-explored.png')}
                style={styles.bentoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.bentoContentBig}>
              <Text variant="h1" color={colors.secondary[800]} style={{ fontSize: 42 }}>{exploredCount}</Text>
              <Text variant="bodyBold" color={colors.secondary[600]}>Explored</Text>
              <Text variant="caption" color={colors.text.primary} style={{ marginTop: 4, opacity: 0.7 }}>
                {Math.round(progress * 100)}% of library
              </Text>
            </View>
          </Card>

          {/* Right Column: Stack */}
          <View style={styles.bentoStack}>
            {/* Resonates */}
            <Card variant="elevated" style={styles.bentoSmall}>
              <View style={styles.rowCentered}>
                <View style={styles.bentoIconWrapperSmall}>
                  <Image
                    source={require('@/assets/images/ui/profile/stat-resonates.png')}
                    style={styles.bentoImageSmall}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h3" color={colors.primary[700]}>{resonatesCount}</Text>
                  <Text variant="caption">resonates</Text>
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
                  You resonate with <Text style={{ fontStyle: 'italic' }}>{categoryLabels[patternInsights.topCategory]}</Text>.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary[200]} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* 4. The Collection (Shelf) */}
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

                const illustrationSlide = concept.slides?.find(s => s.type === 'illustrate');
                const imageSource = illustrationSlide?.illustrationAsset || getCategoryIcon(concept.category);

                return (
                  <TouchableOpacity
                    key={uc.concept_id}
                    style={styles.collectionCard}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/concept/${uc.concept_id}`)}
                  >
                    <View style={styles.collectionIconArea}>
                      {imageSource && (
                        <Image
                          source={imageSource}
                          style={styles.collectionImage}
                          resizeMode="contain"
                        />
                      )}
                    </View>

                    <View style={styles.collectionCardContent}>
                      <View style={styles.collectionCardBadge}>
                        <Text variant="labelSmall" style={{ fontSize: 10, color: colors.text.secondary }}>
                          {concept.category.toUpperCase()}
                        </Text>
                      </View>
                      <Text variant="bodyBold" color={colors.text.primary} numberOfLines={2} style={{ textAlign: 'center' }}>
                        {concept.name}
                      </Text>
                    </View>
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
                Concepts that resonate with you will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* 5. Tools Grid */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>Tools & Settings</Text>

          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/communicate')}>
              <View style={styles.toolIconWrapper}>
                <Image
                  source={require('@/assets/images/ui/profile/tool-communicate.png')}
                  style={styles.toolImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.toolContent}>
                <Text variant="bodyBold" style={{ textAlign: 'center' }}>Communication</Text>
                <Text variant="caption" color={colors.text.tertiary} style={{ textAlign: 'center' }}>Toolkit</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/share')}>
              <View style={styles.toolIconWrapper}>
                <Image
                  source={require('@/assets/images/ui/profile/tool-export.png')}
                  style={styles.toolImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.toolContent}>
                <Text variant="bodyBold" style={{ textAlign: 'center' }}>Export</Text>
                <Text variant="caption" color={colors.text.tertiary} style={{ textAlign: 'center' }}>Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 32,
    marginBottom: 4,
  },
  settingsButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.sm,
  },

  // 2. Bento Grid
  bentoContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    height: 190,
    marginBottom: spacing['2xl'],
  },
  bentoBig: { // Left Column
    flex: 1.2,
    backgroundColor: colors.background.surface, // WHITE
    justifyContent: 'space-between',
    padding: 0,
    overflow: 'hidden',
    ...shadows.sm, // Ensure it pops
    borderRadius: borderRadius.lg,
  },
  bentoIconWrapper: {
    width: '100%',
    height: '60%',
    overflow: 'hidden',
  },
  bentoImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  bentoContentBig: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  bentoStack: { // Right Column
    flex: 1,
    gap: spacing.md,
  },
  bentoSmall: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.surface, // WHITE
    overflow: 'hidden',
    ...shadows.sm,
    borderRadius: borderRadius.lg,
  },
  bentoIconWrapperSmall: {
    width: 56,
    height: 56,
    marginRight: spacing.xs,
  },
  bentoImageSmall: {
    width: '100%',
    height: '100%',
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

  // 4. Collection
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
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
  collectionCard: {
    width: 140,
    height: 190,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.primary, // CREAM/TRANSPARENT-LIKE
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  collectionIconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  collectionImage: {
    width: 90,
    height: 90,
  },
  collectionCardContent: {
    width: '100%',
    alignItems: 'center', // CENTERED
  },
  collectionCardBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'center', // CENTERED
    marginBottom: 4,
  },
  emptyShelf: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.xl,
  },
  emptyShelfIllustration: {
    width: 64,
    height: 64,
    marginBottom: spacing.md,
    opacity: 0.4,
  },

  // 5. Tools Grid
  toolsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toolCard: {
    flex: 1,
    backgroundColor: colors.background.surface, // WHITE
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  toolIconWrapper: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolImage: {
    width: '100%',
    height: '100%',
  },
  toolContent: {
    alignItems: 'center',
  },
});
