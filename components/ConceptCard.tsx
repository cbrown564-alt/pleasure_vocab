import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { Concept, ConceptStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from './ui/Typography';

interface ConceptCardProps {
  concept: Concept;
  status: ConceptStatus;
  isCollected?: boolean;
  onPress?: () => void;
}

export function ConceptCard({ concept, status, isCollected, onPress }: ConceptCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/concept/${concept.id}`);
    }
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

  // precise: Find the 'illustrate' slide to get the specific concept icon
  const illustrateSlide = concept.slides?.find(s => s.type === 'illustrate');
  const conceptIcon = illustrateSlide?.illustrationAsset;

  // Fallback to category icon if no specific icon found
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technique': return require('@/assets/images/ui/category-technique.png');
      case 'sensation': return require('@/assets/images/ui/category-sensation.png');
      case 'timing': return require('@/assets/images/ui/category-timing.png');
      case 'psychological': return require('@/assets/images/ui/category-psychological.png');
      case 'anatomy': return require('@/assets/images/ui/category-anatomy.png');
      default: return null;
    }
  };

  // Priority: 1. Specific Thumbnail, 2. Illustration Slide (Legacy), 3. Category Icon
  const displayIcon = concept.thumbnail || conceptIcon || getCategoryIcon(concept.category);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[
        styles.card,
        !isUnexplored && { borderLeftColor: statusColor, borderLeftWidth: 4 },
        isCollected && styles.collectedCard
      ]}
    >
      <View style={styles.container}>
        {/* Left: Icon */}
        <View style={styles.iconContainer}>
          {displayIcon && (
            <Image
              source={displayIcon}
              style={{ width: 72, height: 72, resizeMode: 'contain' }}
            />
          )}
        </View>

        {/* Right: Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="label" color={colors.text.tertiary} style={styles.category}>
              {concept.category}
            </Text>
            {isCollected ? (
              <Ionicons name="checkmark-circle" size={18} color={colors.primary[500]} />
            ) : status === 'resonates' && (
              <Ionicons name="heart" size={18} color={colors.primary[500]} />
            )}
          </View>

          <Text variant="h3" style={styles.name}>
            {concept.name}
          </Text>

          <Text variant="body" numberOfLines={3} style={styles.definition}>
            {concept.definition}
          </Text>

          {!isUnexplored && (
            <View style={styles.footer}>
              <Text variant="caption" color={colors.text.secondary}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
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
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    overflow: 'hidden',
  },
  collectedCard: {
    borderColor: colors.primary[300],
    borderWidth: 2,
    backgroundColor: colors.primary[50],
  },
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.md,
    justifyContent: 'center',
    width: 80,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  name: {
    marginBottom: 4,
    color: colors.text.primary,
  },
  definition: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
