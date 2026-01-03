import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, Badge } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { getExplainerById } from '@/data/explainers';
import { getConceptById } from '@/data/vocabulary';

export default function ExplainerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [expandedMisconception, setExpandedMisconception] = useState<number | null>(null);

  const explainer = getExplainerById(id);

  if (!explainer) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="h3">Explainer not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <Ionicons
                name={explainer.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <Badge label={explainer.readTime} />
          </View>
          <Text variant="h2" style={styles.title}>{explainer.title}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text variant="h4" color={colors.text.secondary} style={styles.subtitle}>
          {explainer.subtitle}
        </Text>

        {/* Overview */}
        <Text variant="body" style={styles.overview}>
          {explainer.overview}
        </Text>

        {/* Key Takeaways */}
        <Card variant="elevated" padding="md" style={styles.takeawaysCard}>
          <View style={styles.takeawaysHeader}>
            <Ionicons name="bulb" size={20} color={colors.secondary[500]} />
            <Text variant="h4" style={styles.takeawaysTitle}>Key Takeaways</Text>
          </View>
          {explainer.keyTakeaways.map((takeaway, index) => (
            <View key={index} style={styles.takeawayRow}>
              <View style={styles.takeawayBullet}>
                <Ionicons name="checkmark" size={14} color={colors.secondary[500]} />
              </View>
              <Text variant="bodySmall" style={styles.takeawayText}>
                {takeaway}
              </Text>
            </View>
          ))}
        </Card>

        {/* Content Sections */}
        {explainer.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              {section.title}
            </Text>
            <Text variant="body" style={styles.sectionContent}>
              {section.content}
            </Text>
            {section.statistic && (
              <Card variant="filled" padding="md" style={styles.statisticCard}>
                <Text variant="h2" color={colors.primary[500]} align="center">
                  {section.statistic.value}
                </Text>
                <Text variant="bodySmall" align="center" style={styles.statisticLabel}>
                  {section.statistic.label}
                </Text>
                <Text variant="caption" color={colors.text.tertiary} align="center">
                  — {section.statistic.source}
                </Text>
              </Card>
            )}
          </View>
        ))}

        {/* Misconceptions */}
        <View style={styles.misconceptionsSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Common Misconceptions
          </Text>
          {explainer.misconceptions.map((misconception, index) => {
            const isExpanded = expandedMisconception === index;
            return (
              <Card
                key={index}
                variant="outlined"
                padding="md"
                style={styles.misconceptionCard}
                onPress={() => setExpandedMisconception(isExpanded ? null : index)}
              >
                <View style={styles.misconceptionHeader}>
                  <View style={styles.mythRow}>
                    <View style={styles.mythIcon}>
                      <Ionicons name="close" size={14} color={colors.error} />
                    </View>
                    <Text variant="body" style={styles.mythText}>
                      "{misconception.myth}"
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.neutral[400]}
                  />
                </View>
                {isExpanded && (
                  <View style={styles.factContainer}>
                    <View style={styles.factRow}>
                      <View style={styles.factIcon}>
                        <Ionicons name="checkmark" size={14} color={colors.secondary[500]} />
                      </View>
                      <Text variant="bodySmall" style={styles.factText}>
                        {misconception.fact}
                      </Text>
                    </View>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Key Sources */}
        <View style={styles.sourcesSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Research Sources
          </Text>
          {explainer.keySources.map((source, index) => (
            <Card key={index} variant="filled" padding="sm" style={styles.sourceCard}>
              <Text variant="caption" color={colors.text.tertiary} style={styles.sourceCitation}>
                {source.citation}
              </Text>
              <Text variant="bodySmall">
                {source.finding}
              </Text>
            </Card>
          ))}
        </View>

        {/* Related Concepts */}
        {explainer.relatedConceptIds.length > 0 && (
          <View style={styles.relatedSection}>
            <Text variant="h4" style={styles.sectionTitle}>
              Related Concepts
            </Text>
            <View style={styles.chipContainer}>
              {explainer.relatedConceptIds.map((conceptId) => {
                const concept = getConceptById(conceptId);
                if (!concept) return null;
                return (
                  <TouchableOpacity
                    key={conceptId}
                    style={styles.chip}
                    onPress={() => router.push(`/concept/${conceptId}`)}
                  >
                    <Text variant="label" color={colors.primary[600]}>
                      {concept.name}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary[600]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Related Explainers */}
        {explainer.relatedExplainerIds.length > 0 && (
          <View style={styles.relatedSection}>
            <Text variant="h4" style={styles.sectionTitle}>
              Related Research
            </Text>
            <View style={styles.chipContainer}>
              {explainer.relatedExplainerIds.map((explainerId) => {
                const related = getExplainerById(explainerId);
                if (!related) return null;
                return (
                  <TouchableOpacity
                    key={explainerId}
                    style={[styles.chip, styles.chipSecondary]}
                    onPress={() => router.push(`/explainer/${explainerId}`)}
                  >
                    <Ionicons
                      name={related.icon as keyof typeof Ionicons.glyphMap}
                      size={16}
                      color={colors.secondary[600]}
                    />
                    <Text variant="label" color={colors.secondary[600]}>
                      {related.title}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.secondary[600]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
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
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  subtitle: {
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  overview: {
    marginBottom: spacing.lg,
    lineHeight: 26,
  },
  takeawaysCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.secondary[50],
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  takeawaysTitle: {
    marginLeft: spacing.sm,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  takeawayBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  takeawayText: {
    flex: 1,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionContent: {
    lineHeight: 26,
  },
  statisticCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primary[50],
  },
  statisticLabel: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  misconceptionsSection: {
    marginBottom: spacing.xl,
  },
  misconceptionCard: {
    marginBottom: spacing.sm,
  },
  misconceptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mythRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: spacing.sm,
  },
  mythIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  mythText: {
    flex: 1,
    fontStyle: 'italic',
  },
  factContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  factIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    lineHeight: 22,
  },
  sourcesSection: {
    marginBottom: spacing.xl,
  },
  sourceCard: {
    marginBottom: spacing.sm,
  },
  sourceCitation: {
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  relatedSection: {
    marginBottom: spacing.lg,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  chipSecondary: {
    backgroundColor: colors.secondary[50],
  },
});
