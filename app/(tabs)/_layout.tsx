import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import "react-native-gesture-handler";



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: route.name === 'task-form' ? 'none' : 'flex',
        },
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
      })}
      backBehavior='history'
      >
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
        name="completed"
        options={{
          title: 'Wykonane',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkbox' : 'checkbox-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='task-form'
        options={{
          title: 'Dodaj',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle'} color={color} />
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
