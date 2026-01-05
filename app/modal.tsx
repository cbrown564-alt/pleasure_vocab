import { Card, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useClearData, useOnboarding } from '@/hooks/useDatabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const goalLabels: Record<string, string> = {
  self_discovery: 'Self-discovery',
  partner_communication: 'Partner communication',
  expanding_knowledge: 'Expanding knowledge',
};

export default function SettingsModal() {
  const insets = useSafeAreaInsets();
  const { clear, isClearing } = useClearData();
  const { goal, update } = useOnboarding();
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const performClear = async () => {
    try {
      await clear();
      router.replace('/onboarding/welcome');
      if (Platform.OS === 'web') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to clear data:', error);
      Alert.alert('Error', 'Failed to clear data. Please try again.');
    }
  };

  const handleToggleAppLock = (value: boolean) => {
    if (value) {
      Alert.alert(
        'App Lock',
        'App lock with biometrics will be available in a future update.',
        [{ text: 'OK' }]
      );
    }
    setAppLockEnabled(value);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="h3">Settings</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Preferences
          </Text>

          <Card variant="outlined" padding="none">
            <SettingRow
              icon="compass-outline"
              label="Your Goal"
              value={goal ? goalLabels[goal] : 'Not set'}
              onPress={() => router.push('/onboarding/goals')}
            />
          </Card>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Privacy & Security
          </Text>

          <Card variant="outlined" padding="none">
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color={colors.text.secondary}
                />
                <Text variant="body" style={styles.settingLabel}>
                  App Lock
                </Text>
              </View>
              <Switch
                value={appLockEnabled}
                onValueChange={handleToggleAppLock}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={appLockEnabled ? colors.primary[500] : colors.neutral[100]}
              />
            </View>
            <View style={styles.divider} />

            {showClearConfirm ? (
              <View style={styles.confirmContainer}>
                <Text variant="bodySmall" color={colors.error} style={{ marginBottom: spacing.sm }}>
                  Are you sure? This will delete all your data permanently.
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={[styles.confirmBtn, styles.cancelBtn]}
                    onPress={() => setShowClearConfirm(false)}
                  >
                    <Text variant="bodyBold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmBtn, styles.deleteBtn]}
                    onPress={performClear}
                  >
                    <Text variant="bodyBold" color="white">Yes, Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <SettingRow
                icon="trash-outline"
                label="Clear All Data"
                value=""
                onPress={() => setShowClearConfirm(true)}
                destructive
              />
            )}
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            About
          </Text>

          <Card variant="outlined" padding="none">
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={colors.text.secondary}
                />
                <Text variant="body" style={styles.settingLabel}>
                  Version
                </Text>
              </View>
              <Text variant="bodySmall" color={colors.text.tertiary}>
                1.0.0
              </Text>
            </View>
          </Card>
        </View>

        {/* Development Section (Hidden in prod usually, but useful here) */}
        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.sectionTitle}>
            Development
          </Text>

          <Card variant="outlined" padding="none">
            <SettingRow
              icon="refresh-outline"
              label="Reset Onboarding"
              value=""
              onPress={async () => {
                await update({ completed: false });
                router.replace('/onboarding/welcome');
              }}
            />
          </Card>
        </View>

        {/* Privacy Notice */}
        <Card variant="filled" padding="md" style={styles.privacyNotice}>
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.secondary[600]} />
            <Text variant="label" color={colors.secondary[600]} style={styles.privacyTitle}>
              Your Privacy
            </Text>
          </View>
          <Text variant="bodySmall" color={colors.text.secondary}>
            All your data is stored locally on this device only. Nothing is uploaded to
            any server. We don't track your usage or content preferences.
          </Text>
        </Card>
      </View>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  destructive,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colors.error : colors.text.secondary}
        />
        <Text
          variant="body"
          color={destructive ? colors.error : colors.text.primary}
          style={styles.settingLabel}
        >
          {label}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {value && (
          <Text variant="bodySmall" color={colors.text.tertiary}>
            {value}
          </Text>
        )}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.neutral[400]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    color: colors.text.tertiary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: spacing.md,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginLeft: spacing.md + 20 + spacing.md,
  },
  privacyNotice: {
    backgroundColor: colors.secondary[50],
    marginTop: spacing.md,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  privacyTitle: {
    marginLeft: spacing.xs,
  },
  confirmContainer: {
    padding: spacing.md,
    backgroundColor: colors.error + '10', // 10% opacity
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'flex-end',
  },
  confirmBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: colors.neutral[100],
  },
  deleteBtn: {
    backgroundColor: colors.error,
  },
});
