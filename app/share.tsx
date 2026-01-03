import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, Button } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcepts } from '@/hooks/useDatabase';
import { getConceptById } from '@/data/vocabulary';
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

    let text = "I've been learning about pleasure and intimacy, and I wanted to share some things that resonate with me:\n\n";

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
      text += `${categoryLabels[category as ConceptCategory]}:\n`;
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

    text += "I'd love to talk about these with you when you have time.";

    return text;
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (!text) return;

    try {
      await Share.share({
        message: text,
        title: 'What Resonates With Me',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const previewText = generateShareText();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text variant="h3">Share with Partner</Text>
          <Text variant="bodySmall" color={colors.text.secondary}>
            Create a summary to share what resonates with you
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {resonatingConcepts.length === 0 ? (
          <Card variant="filled" padding="lg" style={styles.emptyCard}>
            <Ionicons
              name="heart-outline"
              size={48}
              color={colors.neutral[400]}
              style={styles.emptyIcon}
            />
            <Text variant="body" align="center" color={colors.text.secondary}>
              You haven't marked any concepts as resonating yet. Explore the
              Library and mark what resonates with you to create a shareable
              summary.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/library')}
            >
              <Text variant="label" color={colors.primary[500]}>
                Go to Library
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.primary[500]}
              />
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {/* Selection Controls */}
            <View style={styles.selectionControls}>
              <Text variant="h4">Select concepts to share</Text>
              <View style={styles.selectButtons}>
                <TouchableOpacity onPress={selectAll}>
                  <Text variant="label" color={colors.primary[500]}>
                    Select All
                  </Text>
                </TouchableOpacity>
                <Text variant="bodySmall" color={colors.text.tertiary}>
                  |
                </Text>
                <TouchableOpacity onPress={selectNone}>
                  <Text variant="label" color={colors.primary[500]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Concept Selection */}
            {Object.entries(groupedConcepts).map(([category, concepts]) => (
              <View key={category} style={styles.categorySection}>
                <Text
                  variant="label"
                  color={colors.text.tertiary}
                  style={styles.categoryLabel}
                >
                  {categoryLabels[category as ConceptCategory]}
                </Text>
                {concepts.map((c) => {
                  const isSelected = selectedConcepts.has(c.concept_id);
                  return (
                    <TouchableOpacity
                      key={c.concept_id}
                      style={[
                        styles.conceptItem,
                        isSelected && styles.conceptItemSelected,
                      ]}
                      onPress={() => toggleConcept(c.concept_id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.background.primary}
                          />
                        )}
                      </View>
                      <View style={styles.conceptInfo}>
                        <Text variant="body">{c.concept?.name}</Text>
                        <Text
                          variant="bodySmall"
                          color={colors.text.secondary}
                          numberOfLines={1}
                        >
                          {c.concept?.definition}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Options */}
            <View style={styles.optionsSection}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setIncludeDefinitions(!includeDefinitions)}
              >
                <View
                  style={[
                    styles.checkbox,
                    includeDefinitions && styles.checkboxSelected,
                  ]}
                >
                  {includeDefinitions && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.background.primary}
                    />
                  )}
                </View>
                <Text variant="body">Include definitions</Text>
              </TouchableOpacity>
            </View>

            {/* Preview */}
            {selectedConcepts.size > 0 && (
              <View style={styles.previewSection}>
                <Text variant="h4" style={styles.previewTitle}>
                  Preview
                </Text>
                <Card variant="outlined" padding="md" style={styles.previewCard}>
                  <Text variant="bodySmall" style={styles.previewText}>
                    {previewText}
                  </Text>
                </Card>
              </View>
            )}

            {/* Share Button */}
            <Button
              title={`Share ${selectedConcepts.size} concept${selectedConcepts.size !== 1 ? 's' : ''}`}
              onPress={handleShare}
              disabled={selectedConcepts.size === 0}
              style={styles.shareButton}
            />

            {/* Tip */}
            <Card variant="filled" padding="md" style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons
                  name="bulb-outline"
                  size={18}
                  color={colors.secondary[600]}
                />
                <Text
                  variant="label"
                  color={colors.secondary[600]}
                  style={styles.tipLabel}
                >
                  Tip
                </Text>
              </View>
              <Text variant="bodySmall">
                Sharing what resonates with you is an act of trust and openness.
                Consider sharing this during a calm, relaxed moment when you
                both have time to talk.
              </Text>
            </Card>
          </>
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
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyCard: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  selectionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categorySection: {
    marginBottom: spacing.md,
  },
  categoryLabel: {
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  conceptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  conceptItemSelected: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  conceptInfo: {
    flex: 1,
  },
  optionsSection: {
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[200],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewSection: {
    marginBottom: spacing.md,
  },
  previewTitle: {
    marginBottom: spacing.sm,
  },
  previewCard: {
    backgroundColor: colors.neutral[50],
  },
  previewText: {
    lineHeight: 20,
  },
  shareButton: {
    marginBottom: spacing.md,
  },
  tipCard: {
    backgroundColor: colors.secondary[50],
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipLabel: {
    marginLeft: spacing.xs,
  },
});
