import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ProgressBar } from '@/components/ui';
import { ConceptCard } from '@/components/ConceptCard';
import { ExplainerCard } from '@/components/ExplainerCard';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcepts } from '@/hooks/useDatabase';
import { concepts, getConceptsByCategory } from '@/data/vocabulary';
import { pathways } from '@/data/pathways';
import { getAllExplainers } from '@/data/explainers';
import { ConceptCategory, Pathway } from '@/types';

type ViewMode = 'all' | 'pathways' | 'research';
type CategoryFilter = 'all' | ConceptCategory;

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing',
  psychological: 'Psychological',
  anatomy: 'Anatomy',
};

const categoryIcons: Record<ConceptCategory, keyof typeof Ionicons.glyphMap> = {
  technique: 'hand-left',
  sensation: 'pulse',
  timing: 'time',
  psychological: 'bulb',
  anatomy: 'body',
};

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, getStatus } = useUserConcepts();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const explainers = getAllExplainers();

  const exploredCount = userConcepts.filter(
    (c) => c.status !== 'unexplored'
  ).length;
  const totalCount = concepts.length;
  const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  const filteredConcepts = useMemo(() => {
    if (categoryFilter === 'all') {
      return concepts;
    }
    return getConceptsByCategory(categoryFilter);
  }, [categoryFilter]);

  const categories: ConceptCategory[] = [
    'technique',
    'sensation',
    'timing',
    'psychological',
    'anatomy',
  ];

  const getCategoryCount = (category: ConceptCategory) => {
    return getConceptsByCategory(category).length;
  };

  const getPathwayProgress = (pathway: Pathway) => {
    const completedInPathway = pathway.conceptIds.filter(
      (id) => getStatus(id) !== 'unexplored'
    ).length;
    return completedInPathway / pathway.conceptIds.length;
  };

  const renderPathwayCard = (pathway: Pathway) => {
    const pathwayProgress = getPathwayProgress(pathway);
    const completedCount = pathway.conceptIds.filter(
      (id) => getStatus(id) !== 'unexplored'
    ).length;

    return (
      <Card
        key={pathway.id}
        variant="elevated"
        padding="md"
        style={styles.pathwayCard}
        onPress={() => router.push(`/pathway/${pathway.id}`)}
      >
        <View style={styles.pathwayHeader}>
          <View style={styles.pathwayIcon}>
            <Ionicons
              name={pathway.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={colors.primary[500]}
            />
          </View>
          <View style={styles.pathwayInfo}>
            <Text variant="h4">{pathway.name}</Text>
            <Text variant="bodySmall" color={colors.text.secondary}>
              {pathway.estimatedTime} · {pathway.conceptIds.length} concepts
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.neutral[400]}
          />
        </View>
        <Text
          variant="bodySmall"
          style={styles.pathwayDescription}
          numberOfLines={2}
        >
          {pathway.description}
        </Text>
        <View style={styles.pathwayProgress}>
          <ProgressBar progress={pathwayProgress} height={4} />
          <Text
            variant="caption"
            color={colors.text.tertiary}
            style={styles.pathwayProgressText}
          >
            {completedCount} of {pathway.conceptIds.length} explored
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="h2">Vocabulary Library</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {totalCount} concepts across {categories.length} categories
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="label">Overall Progress</Text>
            <Text variant="label" color={colors.primary[500]}>
              {exploredCount} of {totalCount} explored
            </Text>
          </View>
          <ProgressBar progress={progress} />
        </View>

        {/* View Mode Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'all' && styles.viewToggleActive,
            ]}
            onPress={() => setViewMode('all')}
          >
            <Text
              variant="label"
              color={
                viewMode === 'all' ? colors.primary[600] : colors.text.secondary
              }
            >
              Concepts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'pathways' && styles.viewToggleActive,
            ]}
            onPress={() => setViewMode('pathways')}
          >
            <Text
              variant="label"
              color={
                viewMode === 'pathways'
                  ? colors.primary[600]
                  : colors.text.secondary
              }
            >
              Pathways
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'research' && styles.viewToggleActive,
            ]}
            onPress={() => setViewMode('research')}
          >
            <Text
              variant="label"
              color={
                viewMode === 'research'
                  ? colors.primary[600]
                  : colors.text.secondary
              }
            >
              Research
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'pathways' && (
        <ScrollView
          contentContainerStyle={styles.pathwaysList}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="bodySmall" color={colors.text.secondary} style={styles.pathwaysIntro}>
            Structured progressions through related concepts. Start with
            Foundations if you're new.
          </Text>
          {pathways.map(renderPathwayCard)}
        </ScrollView>
      )}

      {viewMode === 'research' && (
        <ScrollView
          contentContainerStyle={styles.researchList}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="bodySmall" color={colors.text.secondary} style={styles.researchIntro}>
            Evidence-based articles that explain the science behind pleasure and intimacy.
          </Text>
          {explainers.map((explainer) => (
            <ExplainerCard key={explainer.id} explainer={explainer} />
          ))}
        </ScrollView>
      )}

      {viewMode === 'all' && (
        <>
          {/* Category Filter */}
          <View style={styles.categoryFilterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryFilters}
            >
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  categoryFilter === 'all' && styles.categoryChipActive,
                ]}
                onPress={() => setCategoryFilter('all')}
              >
                <Text
                  variant="label"
                  color={
                    categoryFilter === 'all'
                      ? colors.primary[600]
                      : colors.text.secondary
                  }
                >
                  All ({totalCount})
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    categoryFilter === category && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategoryFilter(category)}
                >
                  <Ionicons
                    name={categoryIcons[category]}
                    size={14}
                    color={
                      categoryFilter === category
                        ? colors.primary[600]
                        : colors.text.secondary
                    }
                    style={styles.categoryChipIcon}
                  />
                  <Text
                    variant="label"
                    color={
                      categoryFilter === category
                        ? colors.primary[600]
                        : colors.text.secondary
                    }
                  >
                    {categoryLabels[category]} ({getCategoryCount(category)})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredConcepts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ConceptCard concept={item} status={getStatus(item.id)} />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
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
  subtitle: {
    marginTop: spacing.xs,
  },
  progressSection: {
    marginTop: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  viewToggle: {
    flexDirection: 'row',
    marginTop: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    padding: spacing.xs / 2,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  viewToggleActive: {
    backgroundColor: colors.background.primary,
  },
  categoryFilterContainer: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  categoryFilters: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
  },
  categoryChipActive: {
    backgroundColor: colors.primary[50],
  },
  categoryChipIcon: {
    marginRight: spacing.xs,
  },
  list: {
    padding: spacing.md,
  },
  pathwaysList: {
    padding: spacing.md,
  },
  pathwaysIntro: {
    marginBottom: spacing.md,
  },
  researchList: {
    padding: spacing.md,
  },
  researchIntro: {
    marginBottom: spacing.md,
  },
  pathwayCard: {
    marginBottom: spacing.md,
  },
  pathwayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathwayIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  pathwayInfo: {
    flex: 1,
  },
  pathwayDescription: {
    marginTop: spacing.sm,
  },
  pathwayProgress: {
    marginTop: spacing.md,
  },
  pathwayProgressText: {
    marginTop: spacing.xs,
  },
});
