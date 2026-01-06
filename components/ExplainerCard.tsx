import { colors, spacing } from '@/constants/theme';
import { ResearchExplainer } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card } from './ui/Card';
import { Text } from './ui/Typography';

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
      <View style={styles.cardInner}>
        <View style={styles.iconContainer}>
          {explainer.image ? (
            // @ts-ignore
            <Image
              source={explainer.image}
              style={{ width: '100%', height: '100%', borderRadius: 20 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name={explainer.icon as keyof typeof Ionicons.glyphMap}
              size={32}
              color={colors.secondary[500]}
            />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text variant="h3" style={styles.title}>
              {explainer.title}
            </Text>
          </View>

          <Text variant="bodySmall" color={colors.text.secondary} style={styles.subtitle}>
            {explainer.subtitle}
          </Text>

          <View style={styles.footer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
              <Text variant="label" color={colors.text.tertiary}>{explainer.readTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.surface,
    padding: 0,
  },
  cardInner: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    marginBottom: 2,
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: colors.neutral[300],
  },
  takeawaysPreview: {
    // Deprecated
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
