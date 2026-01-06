import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Text, ThemedView } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { getConceptById } from '@/data/vocabulary';
import { useUserConcepts } from '@/hooks/useDatabase';
import { ConceptCategory } from '@/types';

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing & Pacing',
  psychological: 'Psychological Factors',
  anatomy: 'Anatomy Understanding',
};

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts } = useUserConcepts();
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(
    new Set()
  );
  const [includeDefinitions, setIncludeDefinitions] = useState(true);

  // Get resonating concepts
  const resonatingConcepts = useMemo(() => {
    return userConcepts
      .filter((c) => c.status === 'resonates')
      .map((c) => ({
        ...c,
        concept: getConceptById(c.concept_id),
      }))
      .filter((c) => c.concept !== undefined);
  }, [userConcepts]);

  // Group by category
  const groupedConcepts = useMemo(() => {
    const groups: Record<string, typeof resonatingConcepts> = {};
    resonatingConcepts.forEach((c) => {
      if (c.concept) {
        const category = c.concept.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(c);
      }
    });
    return groups;
  }, [resonatingConcepts]);

  const toggleConcept = (conceptId: string) => {
    const newSelected = new Set(selectedConcepts);
    if (newSelected.has(conceptId)) {
      newSelected.delete(conceptId);
    } else {
      newSelected.add(conceptId);
    }
    setSelectedConcepts(newSelected);
  };

  const selectAll = () => {
    setSelectedConcepts(new Set(resonatingConcepts.map((c) => c.concept_id)));
  };

  const selectNone = () => {
    setSelectedConcepts(new Set());
  };

  const generateShareText = () => {
    const selected = resonatingConcepts.filter((c) =>
      selectedConcepts.has(c.concept_id)
    );

    if (selected.length === 0) return '';

    let text = "I've been exploring my pleasure vocabulary, and these concepts really resonate with me:\n\n";

    // Group selected by category for the share text
    const selectedByCategory: Record<string, typeof selected> = {};
    selected.forEach((c) => {
      if (c.concept) {
        const category = c.concept.category;
        if (!selectedByCategory[category]) {
          selectedByCategory[category] = [];
        }
        selectedByCategory[category].push(c);
      }
    });

    Object.entries(selectedByCategory).forEach(([category, concepts]) => {
      text += `${categoryLabels[category as ConceptCategory].toUpperCase()}:\n`;
      concepts.forEach((c) => {
        if (c.concept) {
          text += `• ${c.concept.name}`;
          if (includeDefinitions) {
            text += `: ${c.concept.definition}`;
          }
          text += '\n';
        }
      });
      text += '\n';
    });

    text += "I'd love to explore these together when we have time.";

    return text;
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (!text) return;

    try {
      await Share.share({
        message: text,
        title: 'My Pleasure Profile',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const previewText = generateShareText();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleRow}>
          <Text variant="h1">Export Profile</Text>
          <Text variant="body" color={colors.text.secondary}>Create a summary to share with a partner</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {resonatingConcepts.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-outline" size={48} color={colors.neutral[300]} />
            </View>
            <Text variant="h3" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
              Nothing here yet
            </Text>
            <Text variant="body" color={colors.text.secondary} style={{ textAlign: 'center', maxWidth: 300, marginBottom: spacing.xl }}>
              Mark concepts as "Resonates" in the library to see them appear here.
            </Text>
            <Button
              title="Explore Library"
              onPress={() => router.push('/(tabs)/library')}
              style={{ width: 200 }}
            />
          </View>
        ) : (
          <>
            {/* Selection Controls */}
            <View style={styles.selectionHeader}>
              <View>
                <Text variant="h4">Select Concepts</Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {selectedConcepts.size} selected
                </Text>
              </View>
              <View style={styles.actionLinks}>
                <TouchableOpacity onPress={selectAll}>
                  <Text variant="label" color={colors.primary[600]}>All</Text>
                </TouchableOpacity>
                <View style={styles.dividerVertical} />
                <TouchableOpacity onPress={selectNone}>
                  <Text variant="label" color={colors.primary[600]}>None</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Lists */}
            <View style={{ gap: spacing.lg }}>
              {Object.entries(groupedConcepts).map(([category, concepts]) => (
                <View key={category}>
                  <Text variant="labelSmall" color={colors.text.tertiary} style={styles.categoryTitle}>
                    {categoryLabels[category as ConceptCategory]}
                  </Text>

                  <View style={styles.grid}>
                    {concepts.map((c) => {
                      const isSelected = selectedConcepts.has(c.concept_id);
                      return (
                        <TouchableOpacity
                          key={c.concept_id}
                          style={[
                            styles.conceptCard,
                            isSelected && styles.conceptCardSelected
                          ]}
                          onPress={() => toggleConcept(c.concept_id)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.cardContent}>
                            <Text
                              variant="bodyBold"
                              color={isSelected ? colors.primary[900] : colors.text.primary}
                              numberOfLines={1}
                            >
                              {c.concept?.name}
                            </Text>
                            <Text
                              variant="caption"
                              color={colors.text.tertiary}
                              numberOfLines={2}
                              style={{ marginTop: 2 }}
                            >
                              {c.concept?.definition}
                            </Text>
                          </View>

                          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <Text variant="h4" style={{ marginBottom: spacing.md }}>Options</Text>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setIncludeDefinitions(!includeDefinitions)}
                activeOpacity={0.7}
              >
                <View style={[styles.switch, includeDefinitions && styles.switchActive]}>
                  <View style={[styles.switchKnob, includeDefinitions && styles.switchKnobActive]} />
                </View>
                <Text variant="body">Include definitions in text</Text>
              </TouchableOpacity>
            </View>

            {/* Preview */}
            {selectedConcepts.size > 0 && (
              <View style={styles.previewContainer}>
                <Text variant="h4" style={{ marginBottom: spacing.md }}>Preview</Text>
                <Card variant="filled" style={styles.previewBubble} padding="lg">
                  <Text variant="bodySmall" style={styles.previewText}>
                    {previewText}
                  </Text>
                  <View style={styles.bubbleTail} />
                </Card>
              </View>
            )}

            {/* Share FAB Substitute (Sticky-ish bottom) */}
            <View style={styles.shareActionContainer}>
              <Button
                title={selectedConcepts.size > 0 ? "Share Profile" : "Select concepts to share"}
                onPress={handleShare}
                disabled={selectedConcepts.size === 0}
                variant="primary"
                fullWidth
              />
              <Text variant="caption" color={colors.text.tertiary} style={{ textAlign: 'center', marginTop: spacing.sm }}>
                Exports as plain text to your favorite apps
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.surface,
    zIndex: 10,
  },
  headerTop: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  headerTitleRow: {
    gap: spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    marginTop: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  // Selection Header
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.background.surface,
    paddingVertical: spacing.sm,
  },
  actionLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  dividerVertical: {
    width: 1,
    height: 12,
    backgroundColor: colors.primary[200],
    marginHorizontal: spacing.md,
  },

  // Concept Grid & Cards
  categoryTitle: {
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  grid: {
    gap: spacing.sm,
  },
  conceptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  conceptCardSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },

  // Options
  optionsContainer: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[300],
    padding: 2,
  },
  switchActive: {
    backgroundColor: colors.primary[500],
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  switchKnobActive: {
    transform: [{ translateX: 20 }],
  },

  // Preview
  previewContainer: {
    marginTop: spacing.xl,
  },
  previewBubble: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: 4,
  },
  previewText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 20,
    fontSize: 13,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderTopColor: colors.neutral[100],
  },

  // Footer Action
  shareActionContainer: {
    marginTop: spacing['2xl'],
  },
});
