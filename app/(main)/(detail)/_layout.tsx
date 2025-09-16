import { HeaderBackButton } from "@react-navigation/elements"; // ajout
import { router, Stack } from "expo-router";
import React from "react";

// Layout du dossier detail: utilise une Stack avec header natif (retour automatique)
export default function DetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Detail",
          // Bouton retour personnalisé: renvoie toujours vers Home
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => {
                router.replace('/home');
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
