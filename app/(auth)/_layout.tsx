import React from 'react';
import { Stack } from 'expo-router';

// Layout placeholder pour la section (auth)
// Nécessaire car Expo Router requiert un export par défaut pour chaque _layout.tsx
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Vous pourrez ajouter vos écrans d'auth plus tard */}
    </Stack>
  );
}


