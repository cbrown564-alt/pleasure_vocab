import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, Text, ProgressBar } from '@/components/ui';
import { ConceptCard } from '@/components/ConceptCard';
import { colors, spacing } from '@/constants/theme';
import { useUserConcepts } from '@/hooks/useDatabase';
import { concepts } from '@/data/vocabulary';
import { ConceptStatus } from '@/types';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, getStatus, isLoading } = useUserConcepts();

  const exploredCount = userConcepts.filter(
    (c) => c.status !== 'unexplored'
  ).length;
  const totalCount = concepts.length;
  const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="h2">Vocabulary Library</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Explore techniques backed by research
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="label">Progress</Text>
            <Text variant="label" color={colors.primary[500]}>
              {exploredCount} of {totalCount} explored
            </Text>
          </View>
          <ProgressBar progress={progress} />
        </View>
      </View>

      <FlatList
        data={concepts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConceptCard concept={item} status={getStatus(item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  progressSection: {
    marginTop: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  list: {
    padding: spacing.md,
  },
});
