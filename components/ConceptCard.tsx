import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { Concept, ConceptStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from './ui/Typography';

interface ConceptCardProps {
  concept: Concept;
  status: ConceptStatus;
}

export function ConceptCard({ concept, status }: ConceptCardProps) {
  const handlePress = () => {
    router.push(`/concept/${concept.id}`);
  };

  const getStatusColor = (s: ConceptStatus) => {
    switch (s) {
      case 'explored': return colors.status.explored;
      case 'resonates': return colors.status.resonates;
      case 'curious': return colors.status.curious;
      default: return colors.neutral[100];
    }
  };

  const isUnexplored = status === 'unexplored';
  const statusColor = getStatusColor(status);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.card, !isUnexplored && { borderLeftColor: statusColor, borderLeftWidth: 4 }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="label" color={colors.text.tertiary} style={styles.category}>
            {concept.category}
          </Text>
          {status === 'resonates' && (
            <Ionicons name="heart" size={16} color={colors.primary[500]} />
          )}
        </View>

        <Text variant="h3" style={styles.name}>
          {concept.name}
        </Text>

        <Text variant="body" numberOfLines={3} style={styles.definition}>
          {concept.definition}
        </Text>

        <View style={styles.footer}>
          {!isUnexplored ? (
            <Text variant="caption" color={colors.text.secondary}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          ) : (
            <Text variant="caption" color={colors.primary[500]}>
              Explore
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm, // Soft elegant shadow
    borderWidth: 1,
    borderColor: colors.neutral[100], // Very subtle border
    overflow: 'hidden',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  category: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  name: {
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  definition: {
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 24, // Relaxed reading
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
