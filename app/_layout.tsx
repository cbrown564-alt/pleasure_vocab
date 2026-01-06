import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
  useFonts,
} from '@expo-google-fonts/playfair-display';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundaryProvider } from '@/components/error';
import { colors } from '@/constants/theme';
import { DataProvider, useData } from '@/lib/contexts';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const { isDbReady, onboarding, onboardingLoading } = useData();
  const onboardingCompleted = onboarding?.completed === 1;

  useEffect(() => {
    if (!isDbReady || onboardingLoading) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!onboardingCompleted && !inOnboarding) {
      // User hasn't completed onboarding, redirect to welcome
      // Use setTimeout to ensure navigation happens after mount/update
      setTimeout(() => router.replace('/onboarding/welcome'), 0);
    } else if (onboardingCompleted && inOnboarding) {
      // User completed onboarding but is in onboarding flow, redirect to main
      setTimeout(() => router.replace('/(tabs)'), 0);
    }
  }, [isDbReady, onboardingLoading, onboardingCompleted, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen
        name="concept/[id]"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundaryProvider>
          <DataProvider>
            <RootLayoutNav />
          </DataProvider>
        </ErrorBoundaryProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}



const styles = {
  loading: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background.primary,
  },
};
