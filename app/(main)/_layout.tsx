import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";

/**
 * Layout du groupe (main): tabs + routes masquées
 */
export default function MainTabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp1-profile-card"
        options={{
          title: "TP1",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TP3-forms"
        options={{
          title: "TP3-forms",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.and.pencil" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp4A-robots"
        options={{
          title: 'Robots (Zustand)',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.2" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp4b-robots-rtk"
        options={{
          title: 'Robots RTK',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TP5-robots-db"
        options={{
          title: 'Robots DB',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="externaldrive" color={color} />
          ),
        }}
      />

      {/* Routes internes masquées des onglets */}
      <Tabs.Screen name="tp2-navigation" options={{ href: null }} />
      <Tabs.Screen name="tp4A-robots/create" options={{ href: null }} />
      <Tabs.Screen name="tp4A-robots/edit/[id]" options={{ href: null }} />
      <Tabs.Screen name="tp4b-robots-rtk/create" options={{ href: null }} />
      <Tabs.Screen name="tp4b-robots-rtk/edit/[id]" options={{ href: null }} />
      <Tabs.Screen name="TP5-robots-db/create" options={{ href: null }} />
      <Tabs.Screen name="TP5-robots-db/edit/[id]" options={{ href: null }} />
      <Tabs.Screen name="(detail)" options={{ href: null }} />
    </Tabs>
  );
}
