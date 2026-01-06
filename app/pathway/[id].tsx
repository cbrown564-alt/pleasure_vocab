import { ConceptCard } from '@/components/ConceptCard';
import { Card, ProgressBar, Text, ThemedView } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { getPathwayById } from '@/data/pathways';
import { getConceptById } from '@/data/vocabulary';
import { useUserConcepts } from '@/hooks/useDatabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PathwayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getStatus, isMastered } = useUserConcepts();

  const pathway = getPathwayById(id);

  if (!pathway) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="h3">Pathway not found</Text>
        </View>
      </ThemedView>
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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h4" style={styles.headerTitle}>{pathway.name}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pathway Header */}
        <View style={styles.pathwayHeader}>
          <View style={styles.pathwayIcon}>
            {pathway.image ? (
              <Image
                source={pathway.image}
                style={{ width: '100%', height: '100%', borderRadius: 32 }}
              />
            ) : (
              <Ionicons
                name={pathway.icon as keyof typeof Ionicons.glyphMap}
                size={32}
                color={colors.primary[500]}
              />
            )}
          </View>
          <Text variant="h2" style={styles.pathwayName} align="center">
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
              <Text variant="label" color={colors.text.tertiary}>
                {pathway.estimatedTime}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={16} color={colors.text.tertiary} />
              <Text variant="label" color={colors.text.tertiary}>
                {pathway.conceptIds.length} Concepts
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <Card variant="elevated" padding="lg" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text variant="h4">Your Progress</Text>
            <Text variant="h4" color={colors.primary[500]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <ProgressBar progress={progress} height={8} />

          <Text
            variant="bodySmall"
            color={colors.text.secondary}
            style={styles.progressText}
          >
            {completedCount} of {pathway.conceptIds.length} concepts explored
          </Text>

          {nextConceptId ? (
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.9}
              onPress={() => router.push({
                pathname: '/concept/[id]',
                params: { id: nextConceptId, pathway: pathway.id }
              })}
            >
              <Text variant="label" color={colors.background.primary} style={{ fontSize: 16 }}>
                Continue Pathway
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={colors.background.primary}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.completedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.secondary[500]}
              />
              <Text variant="label" color={colors.secondary[600]}>
                Pathway Completed!
              </Text>
            </View>
          )}
        </Card>

        {/* Concept List */}
        <View style={styles.conceptsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="h4">Pathway Steps</Text>
          </View>

          {pathway.conceptIds.map((conceptId, index) => {
            const concept = getConceptById(conceptId);
            if (!concept) return null;

            const status = getStatus(conceptId);
            const isNext = conceptId === nextConceptId;

            return (
              <View key={conceptId} style={styles.conceptWrapper}>
                {/* Connector Line */}
                {index !== pathway.conceptIds.length - 1 && (
                  <View style={styles.connectorLine} />
                )}

                <View style={styles.stepContainer}>
                  <View style={[
                    styles.stepIndicator,
                    status !== 'unexplored' && styles.stepIndicatorCompleted,
                    isNext && styles.stepIndicatorActive
                  ]}>
                    {status !== 'unexplored' ? (
                      <Ionicons name="checkmark" size={14} color="white" />
                    ) : (
                      <Text variant="label" style={{ color: isNext ? 'white' : colors.text.tertiary, fontSize: 12 }}>
                        {index + 1}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.cardWrapper}>
                  {isNext && (
                    <View style={styles.upNextLabel}>
                      <Text variant="label" color={colors.primary[600]} style={{ fontSize: 10 }}>UP NEXT</Text>
                    </View>
                  )}
                  <ConceptCard
                    concept={concept}
                    status={status}
                    isCollected={isMastered(conceptId)}
                    onPress={() => router.push({
                      pathname: '/concept/[id]',
                      params: { id: conceptId, pathway: pathway.id }
                    })}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    padding: spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  pathwayHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  pathwayIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pathwayName: {
    marginBottom: spacing.sm,
  },
  pathwayDescription: {
    maxWidth: '90%',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  pathwayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.neutral[200],
  },
  progressCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressText: {
    marginTop: spacing.sm,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
        shadowColor: colors.primary[500],
      },
    }),
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary[50],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  conceptsSection: {
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  conceptWrapper: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 14,
    top: 30,
    bottom: -10, // Extend to next item
    width: 2,
    backgroundColor: colors.neutral[200],
    zIndex: -1,
  },
  stepContainer: {
    width: 30,
    marginRight: spacing.md,
    alignItems: 'center',
    paddingTop: spacing.lg, // Align with card center somewhat
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.secondary,
  },
  stepIndicatorCompleted: {
    backgroundColor: colors.secondary[500],
    borderColor: colors.secondary[500],
  },
  stepIndicatorActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    transform: [{ scale: 1.1 }],
  },
  cardWrapper: {
    flex: 1,
  },
  upNextLabel: {
    marginBottom: 4,
    marginLeft: 4,
  }
});



