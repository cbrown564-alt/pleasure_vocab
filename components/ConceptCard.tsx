import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card } from './ui/Card';
import { Text } from './ui/Typography';
import { StatusBadge } from './ui/Badge';
import { colors, spacing } from '@/constants/theme';
import { Concept, ConceptStatus } from '@/types';

interface ConceptCardProps {
  concept: Concept;
  status: ConceptStatus;
}

export function ConceptCard({ concept, status }: ConceptCardProps) {
  const handlePress = () => {
    router.push(`/concept/${concept.id}`);
  };

  return (
    <Card
      onPress={handlePress}
      variant="elevated"
      padding="md"
      style={styles.card}
    >
      <View style={styles.header}>
        <Text variant="h4" style={styles.name}>
          {concept.name}
        </Text>
        <StatusBadge status={status} />
      </View>
      <Text variant="bodySmall" numberOfLines={2} style={styles.definition}>
        {concept.definition}
      </Text>
      <View style={styles.footer}>
        <Text variant="caption" color={colors.text.tertiary}>
          {concept.category.charAt(0).toUpperCase() + concept.category.slice(1)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  definition: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
