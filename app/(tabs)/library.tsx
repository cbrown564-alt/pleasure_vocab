import { ConceptCard } from '@/components/ConceptCard';
import { ExplainerCard } from '@/components/ExplainerCard';
import { Card, ProgressBar, Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { getAllExplainers } from '@/data/explainers';
import { pathways } from '@/data/pathways';
import { concepts, getConceptsByCategory } from '@/data/vocabulary';
import { useUserConcepts } from '@/hooks/useDatabase';
import { useUserProgress } from '@/lib/user-store';
import { ConceptCategory, Pathway } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ViewMode = 'all' | 'pathways' | 'research';
type CategoryFilter = 'all' | ConceptCategory;

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing',
  psychological: 'Mindset',
  anatomy: 'Anatomy',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / 2; // 2 columns with padding

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, getStatus: getDatabaseStatus } = useUserConcepts();
  const { isMastered, masteredConcepts } = useUserProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const explainers = getAllExplainers();

  // Use "mastered" (Collected) count for progress
  const collectedCount = masteredConcepts.length;
  const totalCount = concepts.length;
  const progress = totalCount > 0 ? collectedCount / totalCount : 0;

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

  const renderPathwayCard = (pathway: Pathway) => {
    const completedInPathway = pathway.conceptIds.filter(
      (id) => getDatabaseStatus(id) !== 'unexplored'
    ).length;
    const pathwayProgress = completedInPathway / pathway.conceptIds.length;

    return (
      <Card
        key={pathway.id}
        variant="elevated"
        padding="md"
        style={styles.pathwayCard}
        onPress={() => router.push(`/pathway/${pathway.id}`)}
      >
        <View style={styles.pathwayIcon}>
          {pathway.image ? (
            <Image
              source={pathway.image}
              style={{ width: '100%', height: '100%', borderRadius: 20 }}
            />
          ) : (
            <Ionicons
              name={pathway.icon as keyof typeof Ionicons.glyphMap}
              size={28}
              color={colors.primary[500]}
            />
          )}
        </View>
        <View style={styles.pathwayContent}>
          <Text variant="h3" style={{ marginBottom: spacing.xs }}>{pathway.name}</Text>
          <Text variant="body" numberOfLines={2} style={{ marginBottom: spacing.sm }}>
            {pathway.description}
          </Text>

          <View style={styles.pathwayMeta}>
            <Text variant="caption">{pathway.estimatedTime}</Text>
            <Text variant="caption">•</Text>
            <Text variant="caption">{pathway.conceptIds.length} concepts</Text>
          </View>

          <View style={styles.pathwayProgressBar}>
            <ProgressBar progress={pathwayProgress} height={4} />
          </View>
        </View>
      </Card>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Category Filter - only show in 'all' mode */}
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
            All
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
            <Text
              variant="label"
              color={
                categoryFilter === category
                  ? colors.primary[600]
                  : colors.text.secondary
              }
            >
              {categoryLabels[category]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.pageTitle}>Library</Text>

        {/* Toggle Segmented Control */}
        <View style={styles.viewToggle}>
          {(['all', 'pathways', 'research'] as ViewMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewToggleButton,
                viewMode === mode && styles.viewToggleActive,
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Text
                variant="label"
                color={viewMode === mode ? colors.text.primary : colors.text.tertiary}
                style={{ fontWeight: viewMode === mode ? '600' : '400' }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {viewMode === 'all' && (
        <FlatList
          data={filteredConcepts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: '100%' }}>
              <ConceptCard
                concept={item}
                status={getDatabaseStatus(item.id) || 'unexplored'}
                isCollected={isMastered(item.id)}
                onPress={() =>
                  router.push({
                    pathname: `/concept/${item.id}`,
                    params: { pathway: categoryFilter === 'all' ? 'default' : categoryFilter },
                  })
                }
              />
            </View>
          )}
          numColumns={1}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
        />
      )}

      {viewMode === 'pathways' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {pathways.map(renderPathwayCard)}
        </ScrollView>
      )}

      {viewMode === 'research' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {explainers.map((explainer) => (
            <ExplainerCard key={explainer.id} explainer={explainer} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background.primary,
  },
  pageTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  viewToggleActive: {
    backgroundColor: colors.background.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryFilters: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
  },
  categoryChipActive: {
    backgroundColor: colors.primary[100],
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  // Pathway Card Styles
  pathwayCard: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.surface,
  },
  pathwayIcon: {
    marginRight: spacing.md,
    marginTop: spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathwayContent: {
    flex: 1,
  },
  pathwayMeta: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  pathwayProgressBar: {
    marginTop: spacing.xs,
  }
});
