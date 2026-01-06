import { Text } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { getExplainerById } from '@/data/explainers';
import { getConceptById } from '@/data/vocabulary';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExplainerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [expandedMisconception, setExpandedMisconception] = useState<number | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
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
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text variant="labelSmall" style={styles.headerLabel}>SCIENCE & INSIGHT</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 60 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Editorial Header */}
        <View style={styles.articleHeader}>
          {explainer.image && (
            <View style={styles.heroImageContainer}>
              <Image source={explainer.image} style={styles.heroImage} resizeMode="cover" />
            </View>
          )}

          <View style={styles.metaRow}>
            {/* Context Badge */}
            <View style={styles.iconBadge}>
              <Ionicons
                name={explainer.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={colors.primary[600]}
              />
            </View>
            <Text variant="label" color={colors.text.tertiary}>
              {explainer.readTime.toUpperCase()} READ
            </Text>
          </View>

          <Text variant="h1" style={styles.title}>
            {explainer.title}
          </Text>
          <Text variant="h3" style={styles.subtitle}>
            {explainer.subtitle}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Overview (Lead Paragraph) */}
        <Text variant="body" style={styles.leadParagraph}>
          {explainer.overview}
        </Text>

        {/* Key Takeaways - Styled as "In Brief" box */}
        <View style={styles.takeawaysBox}>
          <View style={styles.takeawaysHeader}>
            <Text variant="h4" style={styles.takeawaysTitle}>In Brief</Text>
          </View>
          {explainer.keyTakeaways.map((takeaway, index) => (
            <View key={index} style={styles.takeawayRow}>
              <Text variant="h4" color={colors.secondary[600]} style={{ marginRight: spacing.sm, marginTop: -4 }}>•</Text>
              <Text variant="body" style={styles.takeawayText} color={colors.secondary[900]}>
                {takeaway}
              </Text>
            </View>
          ))}
        </View>

        {/* Content Sections */}
        {explainer.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text variant="h2" style={styles.sectionTitle}>
              {section.title}
            </Text>

            {typeof section.content === 'string' ? (
              <Text variant="body" style={styles.sectionContent}>
                {section.content}
              </Text>
            ) : (
              <View style={{ gap: spacing.md }}>
                {section.content.map((block, i) => {
                  if (block.type === 'text') {
                    return (
                      <Text key={i} variant="body" style={styles.sectionContent}>
                        {block.content}
                      </Text>
                    );
                  }
                  if (block.type === 'image') {
                    return (
                      <View key={i} style={styles.inlineImageContainer}>
                        <Image source={block.source} style={[styles.inlineImage, { height: block.height || 200 }]} resizeMode="cover" />
                        {block.caption && <Text variant="caption" style={styles.imageCaption}>{block.caption}</Text>}
                      </View>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <View key={i} style={styles.quoteBlock}>
                        <Text variant="h3" style={styles.quoteText}>“{block.content}”</Text>
                        {block.author && <Text variant="caption" style={styles.quoteAuthor}>— {block.author}</Text>}
                      </View>
                    );
                  }
                  if (block.type === 'callout') {
                    return (
                      <View key={i} style={styles.calloutBlock}>
                        <Text variant="h4" style={styles.calloutTitle} color={colors.primary[700]}>{block.title}</Text>
                        <Text variant="body" style={styles.calloutContent}>{block.content}</Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            )}

            {section.statistic && (
              <View style={styles.pullQuoteContainer}>
                <Text variant="h1" color={colors.primary[500]} align="center" style={styles.statValue}>
                  {section.statistic.value}
                </Text>
                <Text variant="bodyBold" align="center" style={styles.statLabel}>
                  {section.statistic.label}
                </Text>
                <Text variant="caption" align="center" color={colors.text.tertiary} style={{ marginTop: spacing.xs }}>
                  — {section.statistic.source}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Myth Busting Section */}
        <View style={styles.section}>
          <Text variant="h2" style={styles.sectionTitle}>Common Misconceptions</Text>

          {explainer.misconceptions.map((misconception, index) => {
            const isExpanded = expandedMisconception === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => setExpandedMisconception(isExpanded ? null : index)}
                style={styles.mythCard}
              >
                <View style={styles.mythHeader}>
                  <View style={styles.mythBadge}>
                    <Text variant="labelSmall" color={colors.error}>MYTH</Text>
                  </View>
                  <Text variant="bodyBold" style={styles.mythText}>"{misconception.myth}"</Text>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.neutral[400]} />
                </View>

                {isExpanded && (
                  <View style={styles.factBody}>
                    <View style={styles.factBadge}>
                      <Text variant="labelSmall" color={colors.secondary[700]}>FACT</Text>
                    </View>
                    <Text variant="body" style={styles.factText}>{misconception.fact}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Related Concepts */}
        {explainer.relatedConceptIds.length > 0 && (
          <View style={styles.relatedSection}>
            <View style={styles.divider} />
            <Text variant="label" style={styles.relatedLabel}>RELATED CONCEPTS</Text>
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
                    <Text variant="bodyBold" color={colors.primary[700]}>
                      {concept.name}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary[700]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // Cream paper background
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerLabel: {
    letterSpacing: 1,
    color: colors.text.tertiary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  // Editorial Header
  articleHeader: {
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.text.secondary,
    fontFamily: 'PlayfairDisplay_700Bold_Italic', // Italic for subtitle
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral[200],
    width: '40%',
    marginBottom: spacing.lg,
  },
  heroImageContainer: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.primary[50],
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    height: undefined,
  },

  // Content
  leadParagraph: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: spacing.xl,
    color: colors.text.primary,
  },

  // Takeaways Box
  takeawaysBox: {
    backgroundColor: colors.secondary[50],
    padding: spacing.xl,
    borderRadius: 0, // Editorial style box
    borderTopWidth: 4,
    borderTopColor: colors.secondary[500],
    marginBottom: spacing.xl,
  },
  takeawaysHeader: {
    marginBottom: spacing.md,
  },
  takeawaysTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 14,
    color: colors.secondary[700],
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  takeawayText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: spacing.md,
  },
  sectionContent: {
    fontSize: 17,
    lineHeight: 28,
    color: colors.text.secondary,
  },

  // Pull Quote / Stat
  pullQuoteContainer: {
    marginVertical: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
  },
  statValue: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 18,
    textAlign: 'center',
  },

  // Myth Busting
  mythCard: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  mythHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mythBadge: {
    backgroundColor: colors.error + '15', // very light red
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  mythText: {
    flex: 1,
    fontStyle: 'italic',
    marginRight: spacing.sm,
  },
  factBody: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  factBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  factText: {
    lineHeight: 24,
  },

  // Related
  relatedSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.neutral[300],
    marginBottom: spacing.lg,
  },
  relatedLabel: {
    marginBottom: spacing.md,
    color: colors.text.tertiary,
    letterSpacing: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  inlineImageContainer: {
    marginVertical: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.neutral[50],
  },
  inlineImage: {
    width: '100%',
  },
  imageCaption: {
    padding: spacing.sm,
    textAlign: 'center',
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  quoteBlock: {
    marginVertical: spacing.md,
    paddingLeft: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[300],
  },
  quoteText: {
    fontStyle: 'italic',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  quoteAuthor: {
    color: colors.text.tertiary,
  },
  calloutBlock: {
    backgroundColor: colors.primary[50],
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  calloutTitle: {
    marginBottom: spacing.xs,
  },
  calloutContent: {
    color: colors.text.secondary,
  },
});
