import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { Text } from './ui/Typography';
import { Badge } from './ui/Badge';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { ResearchExplainer } from '@/types';

interface ExplainerCardProps {
  explainer: ResearchExplainer;
  variant?: 'full' | 'compact';
}

export function ExplainerCard({ explainer, variant = 'full' }: ExplainerCardProps) {
  const handlePress = () => {
    router.push(`/explainer/${explainer.id}`);
  };

  if (variant === 'compact') {
    return (
      <Card
        onPress={handlePress}
        variant="elevated"
        padding="sm"
        style={styles.compactCard}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactIcon}>
            <Ionicons
              name={explainer.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={colors.secondary[500]}
            />
          </View>
          <View style={styles.compactTextContainer}>
            <Text variant="label" numberOfLines={1}>
              {explainer.title}
            </Text>
            <Text variant="caption" color={colors.text.tertiary} numberOfLines={1}>
              {explainer.readTime}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.neutral[400]}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card
      onPress={handlePress}
      variant="elevated"
      padding="md"
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={explainer.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={colors.secondary[500]}
          />
        </View>
        <Badge label={explainer.readTime} />
      </View>
      <Text variant="h4" style={styles.title}>
        {explainer.title}
      </Text>
      <Text variant="bodySmall" numberOfLines={2} color={colors.text.secondary} style={styles.subtitle}>
        {explainer.subtitle}
      </Text>
      <View style={styles.footer}>
        <View style={styles.takeawaysPreview}>
          <Ionicons name="bulb-outline" size={14} color={colors.text.tertiary} />
          <Text variant="caption" color={colors.text.tertiary}>
            {explainer.keyTakeaways.length} key takeaways
          </Text>
        </View>
        <Text variant="caption" color={colors.secondary[500]}>
          Read more
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
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  takeawaysPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  // Compact variant styles
  compactCard: {
    marginBottom: spacing.sm,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  compactTextContainer: {
    flex: 1,
  },
});
