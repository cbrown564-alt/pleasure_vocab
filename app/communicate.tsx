import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/theme';
import {
  conversationStarters,
  scriptExamples,
  communicationBarriers,
  getScriptCategories,
} from '@/data/communication';
import { ConversationStarter } from '@/types';

type TabType = 'starters' | 'scripts' | 'barriers';

export default function CommunicateScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('starters');
  const [expandedStarter, setExpandedStarter] = useState<string | null>(null);
  const [expandedBarrier, setExpandedBarrier] = useState<string | null>(null);

  const scriptCategories = getScriptCategories();

  const renderTab = (tab: TabType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={18}
        color={activeTab === tab ? colors.primary[600] : colors.text.secondary}
      />
      <Text
        variant="label"
        color={activeTab === tab ? colors.primary[600] : colors.text.secondary}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderStarters = () => (
    <View>
      <Text variant="bodySmall" color={colors.text.secondary} style={styles.sectionIntro}>
        Phrases for common situations. Use these as-is or tweak to sound like you.
      </Text>

      {conversationStarters.map((starter: ConversationStarter) => {
        const isExpanded = expandedStarter === starter.id;

        return (
          <Card
            key={starter.id}
            variant="outlined"
            padding="md"
            style={styles.starterCard}
            onPress={() => setExpandedStarter(isExpanded ? null : starter.id)}
          >
            <View style={styles.starterHeader}>
              <Text variant="h4">{starter.situation}</Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.neutral[400]}
              />
            </View>

            <View style={styles.phraseContainer}>
              <Text variant="body" style={styles.phrase}>
                "{starter.phrase}"
              </Text>
            </View>

            {isExpanded && (
              <View style={styles.starterExpanded}>
                <Text variant="label" style={styles.tipsHeader}>
                  Tips:
                </Text>
                {starter.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <View style={styles.tipBullet} />
                    <Text variant="bodySmall" color={colors.text.secondary}>
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );

  const renderScripts = () => (
    <View>
      <Text variant="bodySmall" color={colors.text.secondary} style={styles.sectionIntro}>
        Opening phrases for different situations. Use these as starting points for your own words.
      </Text>

      {scriptCategories.map((category) => (
        <View key={category} style={styles.scriptCategory}>
          <Text variant="label" color={colors.text.tertiary} style={styles.categoryLabel}>
            {category}
          </Text>
          {scriptExamples
            .filter((s) => s.category === category)
            .map((script) => (
              <Card
                key={script.id}
                variant="filled"
                padding="md"
                style={styles.scriptCard}
              >
                <Text variant="body" style={styles.scriptText}>
                  "{script.opening}"
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {script.context}
                </Text>
              </Card>
            ))}
        </View>
      ))}
    </View>
  );

  const renderBarriers = () => (
    <View>
      <Text variant="bodySmall" color={colors.text.secondary} style={styles.sectionIntro}>
        Common fears about sexual communication - and research-backed reassurance.
      </Text>

      {communicationBarriers.map((barrier) => {
        const isExpanded = expandedBarrier === barrier.id;

        return (
          <Card
            key={barrier.id}
            variant="outlined"
            padding="md"
            style={styles.barrierCard}
            onPress={() => setExpandedBarrier(isExpanded ? null : barrier.id)}
          >
            <View style={styles.barrierHeader}>
              <View style={styles.barrierTitleRow}>
                <Text variant="h4" style={styles.barrierTitle}>
                  {barrier.fear}
                </Text>
                <View style={styles.percentBadge}>
                  <Text variant="caption" color={colors.primary[600]}>
                    {barrier.percentage}% report this
                  </Text>
                </View>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.neutral[400]}
              />
            </View>

            {isExpanded && (
              <View style={styles.barrierExpanded}>
                <Text variant="body" style={styles.reassurance}>
                  {barrier.reassurance}
                </Text>

                <Text variant="label" style={styles.tipsHeader}>
                  What helps:
                </Text>
                {barrier.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={colors.secondary[500]}
                    />
                    <Text variant="bodySmall" style={styles.tipText}>
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );

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
          <Text variant="h3">Communication Toolkit</Text>
          <Text variant="bodySmall" color={colors.text.secondary}>
            Words and phrases for talking about pleasure
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        {renderTab('starters', 'Starters', 'chatbubbles')}
        {renderTab('scripts', 'Scripts', 'document-text')}
        {renderTab('barriers', 'Barriers', 'shield-checkmark')}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'starters' && renderStarters()}
        {activeTab === 'scripts' && renderScripts()}
        {activeTab === 'barriers' && renderBarriers()}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionIntro: {
    marginBottom: spacing.md,
  },
  starterCard: {
    marginBottom: spacing.sm,
  },
  starterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phraseContainer: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  phrase: {
    fontStyle: 'italic',
  },
  starterExpanded: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  tipsHeader: {
    marginBottom: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral[400],
    marginTop: 6,
  },
  tipText: {
    flex: 1,
  },
  scriptCategory: {
    marginBottom: spacing.lg,
  },
  categoryLabel: {
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scriptCard: {
    marginBottom: spacing.sm,
  },
  scriptText: {
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  barrierCard: {
    marginBottom: spacing.sm,
  },
  barrierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  barrierTitleRow: {
    flex: 1,
    marginRight: spacing.sm,
  },
  barrierTitle: {
    marginBottom: spacing.xs,
  },
  percentBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  barrierExpanded: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  reassurance: {
    marginBottom: spacing.md,
  },
});
