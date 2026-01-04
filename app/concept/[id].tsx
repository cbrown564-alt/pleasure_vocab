import { ResonanceSelector } from '@/components/ResonanceSelector';
import { Button, Card, Text } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { getExplainersForConcept } from '@/data/explainers';
import { getConceptById, getNextConcept } from '@/data/vocabulary';
import { useJournal, useUserConcept } from '@/hooks/useDatabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ConceptDetailScreen() {
  const { id, pathway } = useLocalSearchParams<{ id: string; pathway?: string }>();
  const insets = useSafeAreaInsets();
  const concept = getConceptById(id);
  const nextConcept = getNextConcept(id, pathway);
  const relatedExplainers = getExplainersForConcept(id);
  const { status, setStatus, markExplored } = useUserConcept(id);
  const { entries, create } = useJournal(id);
  const [showJournalInput, setShowJournalInput] = useState(false);
  const [journalText, setJournalText] = useState('');

  // Animation value for scroll
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (concept) {
      markExplored();
    }
  }, [concept, markExplored]);

  if (!concept) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text variant="body">Concept not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="ghost" />
      </View>
    );
  }

  const handleSaveJournal = async () => {
    if (journalText.trim()) {
      await create(journalText.trim());
      setJournalText('');
      setShowJournalInput(false);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Fixed Sticky Header (appears on scroll) */}
      <Animated.View style={[styles.stickyHeader, { paddingTop: insets.top, opacity: headerOpacity }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonFixed}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h4" style={styles.stickyTitle} numberOfLines={1}>{concept.name}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButtonFixed}>
          <Ionicons name="home-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Back Button (visible initially) */}
      <Animated.View style={[styles.floatingBack, { top: insets.top + spacing.sm, opacity: scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0] }) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.roundBackBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Home Button (visible initially) */}
      <Animated.View style={[styles.floatingHome, { top: insets.top + spacing.sm, opacity: scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0] }) }]}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.roundBackBtn}>
          <Ionicons name="home-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Immersive Hero */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.heroBackground, { transform: [{ scale: heroScale }] }]}>
            <LinearGradient
              colors={[colors.primary[50], colors.background.primary]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.decorationCircle} />
          </Animated.View>

          <View style={[styles.heroContent, { paddingTop: insets.top + spacing.xl * 2 }]}>
            <View style={styles.categoryBadge}>
              <Text variant="labelSmall" color={colors.text.secondary} style={{ letterSpacing: 2 }}>{concept.category.toUpperCase()}</Text>
            </View>
            <Text variant="h1" style={styles.heroTitle}>{concept.name}</Text>
            <Text variant="h3" style={styles.heroDefinition} color={colors.text.secondary}>
              {concept.definition}
            </Text>
            <View style={styles.heroStatus}>
              <StatusBadge status={status} />
            </View>
          </View>
        </View>

        <View style={styles.contentBody}>
          {/* Action Bar / Resonance */}
          <Card variant="elevated" padding="lg" style={styles.resonanceCard}>
            <Text variant="bodyBold" align="center" style={{ marginBottom: spacing.md }}>How does this feel to you?</Text>
            <ResonanceSelector currentStatus={status} onSelect={setStatus} />
          </Card>

          {/* Insight Sections */}
          <View style={styles.section}>
            <Text variant="h2" style={styles.sectionHeader}>The Insight</Text>
            <Text variant="body" style={styles.longText}>
              {concept.description}
            </Text>
          </View>

          {/* Reflection Prompts - Styled as "Pause" cards */}
          <View style={styles.section}>
            <Text variant="label" style={styles.labelDivider}>Pause & Reflect</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
              {concept.recognitionPrompts.map((prompt, index) => (
                <View key={index} style={styles.promptCard}>
                  <Ionicons name="help-buoy-outline" size={24} color={colors.primary[400]} style={{ marginBottom: spacing.md }} />
                  <Text variant="body" style={{ fontStyle: 'italic', lineHeight: 24 }}>"{prompt}"</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Research Basis - Accordion style look */}
          <View style={styles.section}>
            <View style={styles.researchBox}>
              <View style={styles.researchHeader}>
                <Ionicons name="library-outline" size={20} color={colors.secondary[600]} />
                <Text variant="h4" color={colors.secondary[700]}>Research Basis</Text>
              </View>
              <Text variant="bodySmall" style={{ marginBottom: spacing.sm }}>{concept.researchBasis}</Text>
              <Text variant="caption" color={colors.text.tertiary}>Source: {concept.source}</Text>
            </View>
          </View>

          {/* Related Research */}
          {relatedExplainers.length > 0 && (
            <View style={styles.section}>
              <Text variant="h4" style={{ marginBottom: spacing.md }}>Science & Insight</Text>
              {relatedExplainers.map((explainer) => (
                <TouchableOpacity
                  key={explainer.id}
                  style={styles.explainerRow}
                  onPress={() => router.push(`/explainer/${explainer.id}`)}
                >
                  <View style={styles.explainerIcon}>
                    <Ionicons
                      name={explainer.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={colors.text.inverse}
                    />
                  </View>
                  <View style={styles.explainerContent}>
                    <Text variant="bodyBold">{explainer.title}</Text>
                    <Text variant="caption" color={colors.text.tertiary}>
                      {explainer.readTime} • {explainer.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Journal Section */}
          <View style={styles.section}>
            <View style={styles.journalHeader}>
              <Text variant="h2">Your Notes</Text>
              {!showJournalInput && (
                <Button title="Add Note" onPress={() => setShowJournalInput(true)} size="sm" variant="outline" />
              )}
            </View>

            {showJournalInput && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.journalInput}
                  placeholder="What's coming up for you?"
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  value={journalText}
                  onChangeText={setJournalText}
                  autoFocus
                />
                <View style={styles.inputActions}>
                  <Button title="Cancel" variant="ghost" size="sm" onPress={() => setShowJournalInput(false)} />
                  <Button title="Save" size="sm" onPress={handleSaveJournal} disabled={!journalText.trim()} />
                </View>
              </View>
            )}

            {entries.map((entry) => (
              <View key={entry.id} style={styles.journalEntry}>
                <View style={styles.entryTimeline}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineLine} />
                </View>
                <View style={styles.entryContent}>
                  <Text variant="caption" color={colors.text.tertiary} style={{ marginBottom: 4 }}>
                    {new Date(entry.created_at).toLocaleDateString()}
                  </Text>
                  <Text variant="body">{entry.content}</Text>
                </View>
              </View>
            ))}

            {entries.length === 0 && !showJournalInput && (
              <Text variant="bodySmall" color={colors.text.tertiary} style={{ fontStyle: 'italic', marginTop: spacing.sm }}>
                No notes yet. Capture your thoughts to deepen your understanding.
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Navigation Footer */}
      {/* Navigation Footer */}
      {nextConcept ? (
        <View style={[styles.navFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              router.push({
                pathname: '/concept/[id]',
                params: { id: nextConcept.id, pathway },
              })
            }
          >
            <View>
              <Text variant="labelSmall" color={colors.primary[200]} style={{ marginBottom: 4 }}>
                UP NEXT
              </Text>
              <Text variant="h3" color={colors.text.inverse}>
                {nextConcept.name}
              </Text>
            </View>
            <View style={styles.nextIcon}>
              <Ionicons name="arrow-forward" size={24} color={colors.primary[600]} />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.navFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.secondary[500] }]}
            onPress={() => router.push('/(tabs)')}
          >
            <View>
              <Text variant="labelSmall" color={colors.secondary[100]} style={{ marginBottom: 4 }}>
                COMPLETE
              </Text>
              <Text variant="h3" color={colors.text.inverse}>
                Return Home
              </Text>
            </View>
            <View style={[styles.nextIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="home" size={24} color={colors.text.inverse} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)', // Glass effect
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  backButtonFixed: {
    padding: spacing.xs,
  },
  stickyTitle: {
    flex: 1,
    textAlign: 'center',
  },
  floatingBack: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 10,
  },
  floatingHome: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 10,
  },
  roundBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },

  // Hero
  heroContainer: {
    minHeight: 400,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  decorationCircle: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary[100],
    opacity: 0.5,
  },
  heroContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  categoryBadge: {
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 48,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  heroDefinition: {
    fontSize: 22,
    lineHeight: 32,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  heroStatus: {
    flexDirection: 'row',
  },

  contentBody: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl, // Overlap effect
  },

  resonanceCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.surface,
  },

  section: {
    marginBottom: spacing['2xl'],
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  longText: {
    fontSize: 18,
    lineHeight: 30,
    color: colors.text.secondary,
  },

  // Prompts
  labelDivider: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  promptsScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  promptCard: {
    width: 260,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },

  // Research
  researchBox: {
    backgroundColor: colors.secondary[50], // Sage wash
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary[500],
  },
  researchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  // Explainers
  explainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  explainerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  explainerContent: {
    flex: 1,
  },

  // Journal
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  journalInput: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    minHeight: 80,
    marginBottom: spacing.md,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  journalEntry: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  entryTimeline: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 20,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[300],
    marginBottom: 4,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: colors.neutral[200],
  },
  entryContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  // Navigation Footer
  navFooter: {
    marginTop: spacing['2xl'],
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[600],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  nextIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
