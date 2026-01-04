import { colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';

function TabBarIcon({
  color,
  source,
  focused
}: {
  color: string;
  source: ImageSourcePropType;
  focused: boolean;
}) {
  return (
    <Image
      source={source}
      style={{
        width: 24,
        height: 24,
        tintColor: color,
        opacity: focused ? 1 : 0.7,
        resizeMode: 'contain'
      }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.neutral[200],
          height: 88, // Taller editorial tab bar
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
          marginTop: -4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sanctuary',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/ui/tab-home.png')}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/ui/tab-library.png')}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/ui/tab-journal.png')}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Atelier',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={require('@/assets/images/ui/tab-profile.png')}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
