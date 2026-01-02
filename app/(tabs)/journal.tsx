import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, Button } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useJournal } from '@/hooks/useDatabase';
import { getConceptById } from '@/data/vocabulary';
import { JournalEntryRow } from '@/lib/database';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { entries, create, remove, isLoading } = useJournal();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text variant="h2">Reflection Journal</Text>
          {!showNewEntry && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowNewEntry(true)}
            >
              <Ionicons name="add" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          )}
        </View>
        <Text variant="bodySmall" color={colors.text.secondary}>
          A private space for your thoughts and discoveries
        </Text>
      </View>

      {showNewEntry && (
        <Card variant="elevated" padding="md" style={styles.newEntryCard}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.text.tertiary}
            multiline
            value={newEntryText}
            onChangeText={setNewEntryText}
            autoFocus
          />
          <View style={styles.newEntryActions}>
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
        </Card>
      )}

      {entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalEntryCard
              entry={item}
              onDelete={() => handleDelete(item.id)}
              formatDate={formatDate}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : !showNewEntry ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="book-outline"
            size={64}
            color={colors.neutral[300]}
            style={styles.emptyIcon}
          />
          <Text variant="h4" align="center" color={colors.text.secondary}>
            Your journal is empty
          </Text>
          <Text
            variant="bodySmall"
            align="center"
            color={colors.text.tertiary}
            style={styles.emptyText}
          >
            Use this space to record thoughts, observations, and discoveries as
            you explore vocabulary concepts.
          </Text>
          <Button
            title="Write First Entry"
            variant="outline"
            onPress={() => setShowNewEntry(true)}
            style={styles.emptyButton}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

function JournalEntryCard({
  entry,
  onDelete,
  formatDate,
}: {
  entry: JournalEntryRow;
  onDelete: () => void;
  formatDate: (date: string) => string;
}) {
  const [showActions, setShowActions] = useState(false);
  const linkedConcept = entry.concept_id
    ? getConceptById(entry.concept_id)
    : null;

  return (
    <Card variant="elevated" padding="md" style={styles.entryCard}>
      <TouchableOpacity
        onLongPress={() => setShowActions(!showActions)}
        activeOpacity={0.9}
      >
        <Text variant="body" style={styles.entryContent}>
          {entry.content}
        </Text>

        <View style={styles.entryFooter}>
          <View style={styles.entryMeta}>
            <Text variant="caption">{formatDate(entry.created_at)}</Text>
            {linkedConcept && (
              <View style={styles.linkedConcept}>
                <Ionicons
                  name="link"
                  size={12}
                  color={colors.primary[500]}
                  style={styles.linkIcon}
                />
                <Text variant="caption" color={colors.primary[500]}>
                  {linkedConcept.name}
                </Text>
              </View>
            )}
          </View>

          {showActions && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
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
    paddingBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    padding: spacing.xs,
  },
  newEntryCard: {
    margin: spacing.md,
    marginBottom: 0,
  },
  input: {
    minHeight: 120,
    fontSize: 16,
    color: colors.text.primary,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  newEntryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: spacing.md,
  },
  list: {
    padding: spacing.md,
  },
  entryCard: {
    marginBottom: spacing.md,
  },
  entryContent: {
    lineHeight: 24,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  linkedConcept: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    marginRight: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
});
