import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Card } from '@/components/ui';
import { ResonanceSelector } from '@/components/ResonanceSelector';
import { StatusBadge } from '@/components/ui/Badge';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useUserConcept, useJournal } from '@/hooks/useDatabase';
import { getConceptById } from '@/data/vocabulary';
import { getExplainersForConcept } from '@/data/explainers';

export default function ConceptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const concept = getConceptById(id);
  const relatedExplainers = getExplainersForConcept(id);
  const { status, setStatus, markExplored } = useUserConcept(id);
  const { entries, create } = useJournal(id);
  const [showJournalInput, setShowJournalInput] = useState(false);
  const [journalText, setJournalText] = useState('');

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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text variant="h3" numberOfLines={1}>
            {concept.name}
          </Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Definition */}
        <Text variant="body" color={colors.text.secondary} style={styles.definition}>
          {concept.definition}
        </Text>

        {/* Description */}
        <Card variant="elevated" padding="lg" style={styles.section}>
          <Text variant="body" style={styles.description}>
            {concept.description}
          </Text>
        </Card>

        {/* Recognition Prompts */}
        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Reflection Prompts
          </Text>
          {concept.recognitionPrompts.map((prompt, index) => (
            <View key={index} style={styles.prompt}>
              <View style={styles.promptDot} />
              <Text variant="body" style={styles.promptText}>
                {prompt}
              </Text>
            </View>
          ))}
        </View>

        {/* Resonance Selector */}
        <View style={styles.section}>
          <ResonanceSelector currentStatus={status} onSelect={setStatus} />
        </View>

        {/* Research Basis */}
        <Card variant="filled" padding="md" style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Research Basis
          </Text>
          <Text variant="bodySmall">{concept.researchBasis}</Text>
          <Text variant="caption" style={styles.source}>
            Source: {concept.source}
          </Text>
        </Card>

        {/* Related Research */}
        {relatedExplainers.length > 0 && (
          <View style={styles.section}>
            <Text variant="labelSmall" style={styles.sectionTitle}>
              Learn the Science
            </Text>
            {relatedExplainers.map((explainer) => (
              <TouchableOpacity
                key={explainer.id}
                style={styles.explainerCard}
                onPress={() => router.push(`/explainer/${explainer.id}`)}
              >
                <View style={styles.explainerIcon}>
                  <Ionicons
                    name={explainer.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={colors.secondary[500]}
                  />
                </View>
                <View style={styles.explainerContent}>
                  <Text variant="label">{explainer.title}</Text>
                  <Text variant="caption" color={colors.text.secondary} numberOfLines={1}>
                    {explainer.subtitle}
                  </Text>
                </View>
                <View style={styles.explainerBadge}>
                  <Text variant="caption" color={colors.text.tertiary}>
                    {explainer.readTime}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.neutral[400]}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Journal Section */}
        <View style={styles.section}>
          <View style={styles.journalHeader}>
            <Text variant="labelSmall" style={styles.sectionTitle}>
              Your Notes
            </Text>
            {!showJournalInput && (
              <TouchableOpacity
                onPress={() => setShowJournalInput(true)}
                style={styles.addButton}
              >
                <Ionicons name="add" size={20} color={colors.primary[500]} />
                <Text variant="label" color={colors.primary[500]}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {showJournalInput && (
            <Card variant="outlined" padding="md" style={styles.journalInputCard}>
              <TextInput
                style={styles.journalInput}
                placeholder="Write your thoughts..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                value={journalText}
                onChangeText={setJournalText}
                autoFocus
              />
              <View style={styles.journalActions}>
                <Button
                  title="Cancel"
                  variant="ghost"
                  size="sm"
                  onPress={() => {
                    setShowJournalInput(false);
                    setJournalText('');
                  }}
                />
                <Button
                  title="Save"
                  size="sm"
                  onPress={handleSaveJournal}
                  disabled={!journalText.trim()}
                />
              </View>
            </Card>
          )}

          {entries.length > 0 ? (
            entries.map((entry) => (
              <Card key={entry.id} variant="outlined" padding="md" style={styles.journalEntry}>
                <Text variant="body">{entry.content}</Text>
                <Text variant="caption" style={styles.journalDate}>
                  {new Date(entry.created_at).toLocaleDateString()}
                </Text>
              </Card>
            ))
          ) : !showJournalInput ? (
            <Text variant="bodySmall" color={colors.text.tertiary}>
              No notes yet. Tap Add to record your thoughts.
            </Text>
          ) : null}
        </View>

        {/* Related Concepts */}
        {concept.relatedConcepts.length > 0 && (
          <View style={styles.section}>
            <Text variant="labelSmall" style={styles.sectionTitle}>
              Related Concepts
            </Text>
            <View style={styles.relatedList}>
              {concept.relatedConcepts.map((relatedId) => {
                const related = getConceptById(relatedId);
                if (!related) return null;
                return (
                  <TouchableOpacity
                    key={relatedId}
                    style={styles.relatedChip}
                    onPress={() => router.push(`/concept/${relatedId}`)}
                  >
                    <Text variant="label" color={colors.primary[600]}>
                      {related.name}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.primary[600]}
                    />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: spacing.sm,
  },
  headerTitle: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  definition: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    color: colors.text.tertiary,
  },
  description: {
    lineHeight: 26,
  },
  prompt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  promptDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[400],
    marginTop: 8,
    marginRight: spacing.sm,
  },
  promptText: {
    flex: 1,
  },
  source: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  journalInputCard: {
    marginBottom: spacing.md,
  },
  journalInput: {
    minHeight: 100,
    fontSize: 16,
    color: colors.text.primary,
    textAlignVertical: 'top',
  },
  journalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  journalEntry: {
    marginBottom: spacing.sm,
  },
  journalDate: {
    marginTop: spacing.sm,
  },
  relatedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relatedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  explainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  explainerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  explainerContent: {
    flex: 1,
  },
  explainerBadge: {
    marginRight: spacing.sm,
  },
});
