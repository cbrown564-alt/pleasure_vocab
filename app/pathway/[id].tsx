import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ProgressBar } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcepts } from '@/hooks/useDatabase';
import { getPathwayById } from '@/data/pathways';
import { getConceptById } from '@/data/vocabulary';

export default function PathwayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getStatus } = useUserConcepts();

  const pathway = getPathwayById(id);

  if (!pathway) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="h3">Pathway not found</Text>
        </View>
      </View>
    );
  }

  const completedCount = pathway.conceptIds.filter(
    (cid) => getStatus(cid) !== 'unexplored'
  ).length;
  const progress = completedCount / pathway.conceptIds.length;

  // Find the first unexplored concept to continue
  const nextConceptId = pathway.conceptIds.find(
    (cid) => getStatus(cid) === 'unexplored'
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pathway Header */}
        <View style={styles.pathwayHeader}>
          <View style={styles.pathwayIcon}>
            <Ionicons
              name={pathway.icon as keyof typeof Ionicons.glyphMap}
              size={32}
              color={colors.primary[500]}
            />
          </View>
          <Text variant="h2" style={styles.pathwayName}>
            {pathway.name}
          </Text>
          <Text
            variant="body"
            color={colors.text.secondary}
            align="center"
            style={styles.pathwayDescription}
          >
            {pathway.description}
          </Text>
          <View style={styles.pathwayMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
              <Text variant="bodySmall" color={colors.text.tertiary}>
                {pathway.estimatedTime}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="library-outline" size={16} color={colors.text.tertiary} />
              <Text variant="bodySmall" color={colors.text.tertiary}>
                {pathway.conceptIds.length} concepts
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <Card variant="elevated" padding="md" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text variant="h4">Your Progress</Text>
            <Text variant="label" color={colors.primary[500]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <ProgressBar progress={progress} />
          <Text
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.progressText}
          >
            {completedCount} of {pathway.conceptIds.length} concepts explored
          </Text>

          {nextConceptId && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push(`/concept/${nextConceptId}`)}
            >
              <Text variant="label" color={colors.background.primary}>
                Continue Learning
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.background.primary}
              />
            </TouchableOpacity>
          )}

          {!nextConceptId && completedCount === pathway.conceptIds.length && (
            <View style={styles.completedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.secondary[500]}
              />
              <Text variant="label" color={colors.secondary[600]}>
                Pathway Complete!
              </Text>
            </View>
          )}
        </Card>

        {/* Concept List */}
        <View style={styles.conceptsSection}>
          <Text variant="h4" style={styles.sectionTitle}>
            Concepts in this Pathway
          </Text>

          {pathway.conceptIds.map((conceptId, index) => {
            const concept = getConceptById(conceptId);
            if (!concept) return null;

            const status = getStatus(conceptId);
            const isExplored = status !== 'unexplored';
            const isNext = conceptId === nextConceptId;

            return (
              <Card
                key={conceptId}
                variant={isNext ? 'elevated' : 'outlined'}
                padding="md"
                style={[
                  styles.conceptCard,
                  isNext ? styles.conceptCardNext : undefined,
                ]}
                onPress={() => router.push(`/concept/${conceptId}`)}
              >
                <View style={styles.conceptRow}>
                  <View
                    style={[
                      styles.conceptNumber,
                      isExplored && styles.conceptNumberCompleted,
                    ]}
                  >
                    {isExplored ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.background.primary}
                      />
                    ) : (
                      <Text
                        variant="label"
                        color={
                          isNext ? colors.primary[600] : colors.text.tertiary
                        }
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  <View style={styles.conceptContent}>
                    <Text variant="h4">{concept.name}</Text>
                    <Text
                      variant="bodySmall"
                      color={colors.text.secondary}
                      numberOfLines={2}
                    >
                      {concept.definition}
                    </Text>
                    {isNext && (
                      <View style={styles.upNextBadge}>
                        <Text variant="caption" color={colors.primary[600]}>
                          Up next
                        </Text>
                      </View>
                    )}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.neutral[400]}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.md,
  },
  content: {
    padding: spacing.md,
  },
  pathwayHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pathwayIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pathwayName: {
    marginBottom: spacing.sm,
  },
  pathwayDescription: {
    maxWidth: 300,
  },
  pathwayMeta: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressCard: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    marginTop: spacing.sm,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  conceptsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  conceptCard: {
    marginBottom: spacing.sm,
  },
  conceptCardNext: {
    borderColor: colors.primary[300],
    borderWidth: 1,
  },
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conceptNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  conceptNumberCompleted: {
    backgroundColor: colors.secondary[500],
  },
  conceptContent: {
    flex: 1,
  },
  upNextBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
