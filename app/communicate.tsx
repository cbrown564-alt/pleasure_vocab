import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Text, ThemedView } from '@/components/ui';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import {
  communicationBarriers,
  conversationStarters,
  getScriptCategories,
  scriptExamples,
} from '@/data/communication';
import { ConversationStarter } from '@/types';

type TabType = 'starters' | 'scripts' | 'barriers';

export default function CommunicateScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('starters');
  const [expandedStarter, setExpandedStarter] = useState<string | null>(null);
  const [expandedBarrier, setExpandedBarrier] = useState<string | null>(null);

  const scriptCategories = getScriptCategories();

  const renderTab = (tab: TabType, label: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <Text
        variant="label"
        color={activeTab === tab ? colors.primary[700] : colors.text.secondary}
        style={{ textAlign: 'center' }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderStarters = () => (
    <View style={styles.tabContent}>
      <View style={styles.introRow}>
        <Image
          source={require('@/assets/images/ui/communicate/communicate-starters.png')}
          style={styles.introImage}
          resizeMode="contain"
        />
        <Text variant="body" color={colors.text.secondary} style={styles.introText}>
          Simple phrases for common situations. Feel free to tweak these to sound more like you.
        </Text>
      </View>

      <View style={styles.listContainer}>
        {conversationStarters.map((starter: ConversationStarter) => {
          const isExpanded = expandedStarter === starter.id;

          return (
            <Card
              key={starter.id}
              variant={isExpanded ? 'elevated' : 'outlined'}
              style={[styles.cardItem, isExpanded && styles.cardItemActive]}
              padding="md"
              onPress={() => setExpandedStarter(isExpanded ? null : starter.id)}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <Text variant="bodyBold" color={isExpanded ? colors.primary[700] : colors.text.primary}>
                    {starter.situation}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={isExpanded ? colors.primary[600] : colors.neutral[400]}
                />
              </View>

              <View style={styles.phraseBox}>
                <Text variant="body" style={styles.phraseText}>
                  "{starter.phrase}"
                </Text>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text variant="labelSmall" color={colors.text.tertiary} style={{ marginBottom: spacing.sm, textTransform: 'uppercase' }}>
                    Why this works
                  </Text>
                  {starter.tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <View style={styles.bulletPoint} />
                      <Text variant="bodySmall" color={colors.text.secondary} style={{ flex: 1 }}>
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
    </View>
  );

  const renderScripts = () => (
    <View style={styles.tabContent}>
      <View style={styles.introRow}>
        <Image
          source={require('@/assets/images/ui/communicate/communicate-scripts.png')}
          style={styles.introImage}
          resizeMode="contain"
        />
        <Text variant="body" color={colors.text.secondary} style={styles.introText}>
          Opening phrases for deeper discussions. Use these as a starting point.
        </Text>
      </View>

      <View style={styles.listContainer}>
        {scriptCategories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text variant="h4" color={colors.text.primary} style={styles.categoryTitle}>
                {category}
              </Text>
              <View style={styles.categoryLine} />
            </View>

            <View style={{ gap: spacing.md }}>
              {scriptExamples
                .filter((s) => s.category === category)
                .map((script) => (
                  <Card
                    key={script.id}
                    variant="filled"
                    style={styles.scriptCard}
                    padding="lg"
                  >
                    <View style={styles.quoteIcon}>
                      <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.primary[300]} />
                    </View>
                    <Text variant="body" style={styles.scriptText}>
                      "{script.opening}"
                    </Text>
                    <View style={styles.scriptContext}>
                      <Text variant="caption" color={colors.text.tertiary} style={{ fontStyle: 'italic' }}>
                        Best for: {script.context}
                      </Text>
                    </View>
                  </Card>
                ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBarriers = () => (
    <View style={styles.tabContent}>
      <View style={styles.introRow}>
        <Image
          source={require('@/assets/images/ui/communicate/communicate-barriers.png')}
          style={styles.introImage}
          resizeMode="contain"
        />
        <Text variant="body" color={colors.text.secondary} style={styles.introText}>
          Common fears about sexual communication—and how to overcome them.
        </Text>
      </View>

      <View style={styles.listContainer}>
        {communicationBarriers.map((barrier) => {
          const isExpanded = expandedBarrier === barrier.id;

          return (
            <Card
              key={barrier.id}
              variant={isExpanded ? 'elevated' : 'outlined'}
              style={[styles.cardItem, isExpanded && styles.cardItemActive]}
              padding="md"
              onPress={() => setExpandedBarrier(isExpanded ? null : barrier.id)}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <Text variant="bodyBold" color={colors.text.primary} style={{ marginBottom: 4 }}>
                    {barrier.fear}
                  </Text>
                  <View style={styles.statBadge}>
                    <Text variant="labelSmall" color={colors.primary[700]}>
                      {Math.round(barrier.percentage)}% of people feel this
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={isExpanded ? colors.primary[600] : colors.neutral[400]}
                />
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.reassuranceBox}>
                    <Text variant="body" color={colors.text.primary}>
                      {barrier.reassurance}
                    </Text>
                  </View>

                  <Text variant="labelSmall" color={colors.text.tertiary} style={{ marginBottom: spacing.sm, marginTop: spacing.md, textTransform: 'uppercase' }}>
                    Try this instead
                  </Text>
                  {barrier.tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.secondary[500]} />
                      <Text variant="bodySmall" color={colors.text.secondary} style={{ flex: 1 }}>
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
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleRow}>
          <Text variant="h1">Communicate</Text>
          <Text variant="body" color={colors.text.secondary}>Your toolkit for better conversations</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.bgWrapper}>
        <View style={styles.tabContainer}>
          <View style={styles.tabTrack}>
            {renderTab('starters', 'Starters')}
            {renderTab('scripts', 'Scripts')}
            {renderTab('barriers', 'Barriers')}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'starters' && renderStarters()}
          {activeTab === 'scripts' && renderScripts()}
          {activeTab === 'barriers' && renderBarriers()}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.surface,
    zIndex: 10,
  },
  headerTop: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  headerTitleRow: {
    gap: spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },

  // Tabs
  bgWrapper: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  tabContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    padding: 4,
    borderRadius: borderRadius.full,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    // Fix layout shift by setting minHeight
    height: 36,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.background.surface,
    ...shadows.sm,
  },

  // Content
  scrollContent: {
    padding: spacing.lg,
  },
  tabContent: {
    gap: spacing.xl,
  },
  introRow: {
    flexDirection: 'row', // Left-right layout
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  introImage: {
    width: 80,
    height: 80,
    marginRight: spacing.md,
  },
  introText: {
    flex: 1,
  },
  listContainer: {
    gap: spacing.md,
  },

  // Cards (Starters & Barriers)
  cardItem: {
    backgroundColor: colors.background.surface,
    borderColor: colors.neutral[200],
  },
  cardItemActive: {
    borderColor: colors.primary[200],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phraseBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[300],
  },
  phraseText: {
    fontSize: 16,
    color: colors.primary[900],
    fontStyle: 'italic',
    lineHeight: 24,
  },
  expandedContent: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[300],
    marginTop: 8,
  },

  // Scripts specific
  categorySection: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  categoryTitle: {
    color: colors.text.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  categoryLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  scriptCard: {
    backgroundColor: colors.background.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[400],
  },
  quoteIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    opacity: 0.5,
  },
  scriptText: {
    fontSize: 17,
    marginBottom: spacing.md,
    lineHeight: 26,
    paddingRight: spacing.lg,
  },
  scriptContext: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },

  // Barrier specific
  statBadge: {
    backgroundColor: colors.primary[50],
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: 4,
  },
  reassuranceBox: {
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
});
