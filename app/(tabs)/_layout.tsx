import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Terminarz',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Wykonane',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkbox' : 'checkbox-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="undone"
        options={{
          title: 'Niewykonane',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'ban' : 'ban-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ustawienia',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings-sharp' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
