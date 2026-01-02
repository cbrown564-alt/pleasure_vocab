import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/Typography';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { ConceptStatus } from '@/types';

interface ResonanceSelectorProps {
  currentStatus: ConceptStatus;
  onSelect: (status: ConceptStatus) => void;
}

interface ResonanceOption {
  status: ConceptStatus;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  activeColor: string;
}

const options: ResonanceOption[] = [
  {
    status: 'resonates',
    label: 'This resonates',
    description: 'I recognize this in my experience',
    icon: 'heart',
    color: colors.neutral[400],
    activeColor: colors.primary[500],
  },
  {
    status: 'curious',
    label: 'Curious to explore',
    description: "I'd like to try this",
    icon: 'sparkles',
    color: colors.neutral[400],
    activeColor: colors.warning,
  },
  {
    status: 'not_for_me',
    label: 'Not for me',
    description: "This doesn't resonate",
    icon: 'close-circle',
    color: colors.neutral[400],
    activeColor: colors.neutral[500],
  },
];

export function ResonanceSelector({
  currentStatus,
  onSelect,
}: ResonanceSelectorProps) {
  return (
    <View style={styles.container}>
      <Text variant="label" style={styles.title}>
        How does this resonate with you?
      </Text>
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = currentStatus === option.status;
          return (
            <TouchableOpacity
              key={option.status}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                isSelected && { borderColor: option.activeColor },
              ]}
              onPress={() => onSelect(option.status)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={isSelected ? option.activeColor : option.color}
                style={styles.icon}
              />
              <View style={styles.optionText}>
                <Text
                  variant="label"
                  color={isSelected ? option.activeColor : colors.text.primary}
                >
                  {option.label}
                </Text>
                <Text variant="caption" style={styles.description}>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    backgroundColor: colors.background.primary,
  },
  optionSelected: {
    backgroundColor: colors.background.secondary,
  },
  icon: {
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
});
