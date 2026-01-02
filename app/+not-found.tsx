import { Link, Stack, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text variant="h3">Page not found</Text>
        <Text variant="bodySmall" color={colors.text.secondary} style={styles.subtitle}>
          This screen doesn't exist.
        </Text>
        <Button
          title="Go to home"
          variant="outline"
          onPress={() => router.replace('/')}
          style={styles.button}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
});
