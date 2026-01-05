import { Button, Text, ThemedInput } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { getConceptById } from '@/data/vocabulary';
import { useJournal } from '@/hooks/useDatabase';
import { JournalEntryRow } from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { entries, create, remove } = useJournal();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryText, setNewEntryText] = useState('');

  const handleSave = async () => {
    if (newEntryText.trim()) {
      await create(newEntryText.trim());
      setNewEntryText('');
      setShowNewEntry(false);
    }
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const formatDateDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const formatDateMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { month: 'short' });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text variant="h2" style={styles.pageTitle}>Reflections</Text>
        {!showNewEntry && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowNewEntry(true)}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>

      {showNewEntry && (
        <View style={styles.composeContainer}>
          <ThemedInput
            style={styles.input}
            containerStyle={styles.inputContainer}
            placeholder="What's been on your mind regarding your journey?"
            placeholderTextColor={colors.text.tertiary}
            multiline
            value={newEntryText}
            onChangeText={setNewEntryText}
            autoFocus
          />
          <View style={styles.composeActions}>
            <Button
              title="Cancel"
              variant="ghost"
              size="sm"
              onPress={() => {
                setShowNewEntry(false);
                setNewEntryText('');
              }}
            />
            <Button
              title="Save Entry"
              size="sm"
              onPress={handleSave}
              disabled={!newEntryText.trim()}
            />
          </View>
        </View>
      )}

      {entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalEntryRowItem
              entry={item}
              onDelete={() => handleDelete(item.id)}
              formatDateDay={formatDateDay}
              formatDateMonth={formatDateMonth}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : !showNewEntry ? (
        <View style={styles.emptyState}>
          <Image
            source={require('@/assets/images/ui/empty-journal.png')}
            style={styles.emptyIllustration}
            resizeMode="contain"
          />
          <Text variant="h3" align="center" color={colors.text.secondary} style={{ marginBottom: spacing.sm }}>
            Your personal space
          </Text>
          <Text
            variant="bodySmall"
            align="center"
            color={colors.text.tertiary}
            style={styles.emptyText}
          >
            Use this space to record thoughts, discoveries, and feelings. These are private to you.
          </Text>
          <Button
            title="Write First Entry"
            variant="outline"
            onPress={() => setShowNewEntry(true)}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

function JournalEntryRowItem({
  entry,
  onDelete,
  formatDateDay,
  formatDateMonth
}: {
  entry: JournalEntryRow;
  onDelete: () => void;
  formatDateDay: (d: string) => number;
  formatDateMonth: (d: string) => string;
}) {
  const [showActions, setShowActions] = useState(false);
  const linkedConcept = entry.concept_id
    ? getConceptById(entry.concept_id)
    : null;

  return (
    <View style={styles.entryRow}>
      {/* Date Column */}
      <View style={styles.dateColumn}>
        <Text variant="h3" color={colors.text.primary} style={{ lineHeight: 28 }}>{formatDateDay(entry.created_at)}</Text>
        <Text variant="labelSmall" color={colors.text.tertiary}>{formatDateMonth(entry.created_at).toUpperCase()}</Text>
      </View>

      {/* Content Column */}
      <TouchableOpacity
        style={styles.entryContentBox}
        onLongPress={() => setShowActions(!showActions)}
        activeOpacity={0.9}
      >
        <Text variant="body" style={styles.entryText}>
          {entry.content}
        </Text>

        {(linkedConcept || showActions) && (
          <View style={styles.entryFooter}>
            {linkedConcept && (
              <View style={styles.conceptTag}>
                <Ionicons name="pricetag-outline" size={12} color={colors.primary[600]} />
                <Text variant="caption" color={colors.primary[600]}>{linkedConcept.name}</Text>
              </View>
            )}

            {showActions && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                <Text variant="caption" color={colors.error}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  pageTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
  },
  addButton: {
    padding: spacing.xs,
    backgroundColor: colors.primary[50], // light circle
    borderRadius: 20,
  },

  // Compose
  composeContainer: {
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 120,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: colors.text.primary,
    textAlignVertical: 'top',
    lineHeight: 28,
  },
  composeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },

  // List
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  entryRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  dateColumn: {
    width: 50,
    alignItems: 'center',
    paddingTop: 4,
    marginRight: spacing.md,
  },
  entryContentBox: {
    flex: 1,
    backgroundColor: colors.background.primary, // white paper
    padding: spacing.lg,
    borderRadius: borderRadius.md, // slightly rounded
    borderBottomLeftRadius: 0, // editorial look
    ...shadows.sm,
  },
  entryText: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.text.secondary,
  },
  entryFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conceptTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteBtn: {
    padding: 4,
  },

  // Empty
  emptyState: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyIllustration: {
    width: 160,
    height: 160,
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  emptyText: {
    marginBottom: spacing.lg,
    maxWidth: 260,
  },
});
