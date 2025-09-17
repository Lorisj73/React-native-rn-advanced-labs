import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";

/**
 * Layout du groupe (main): utilise un Stack global.
 * - L'écran (tabs) contient les onglets Home et TP1
 * - L'écran detail/[id] est poussé au-dessus avec un bouton retour automatique
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
      {/* Masquer tout le dossier detail/ des Tabs; le header sera géré par detail/_layout.tsx */}
      <Tabs.Screen name="(detail)" options={{ href: null }} />
    </Tabs>
  );
}
