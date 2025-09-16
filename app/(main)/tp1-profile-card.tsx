import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { ProfileCard } from '../../components/ProfileCard';

/**
 * Onglet TP1 intégré à la navigation par onglets du groupe (main).
 * Réutilise le composant ProfileCard existant.
 */
export default function TP1TabScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ProfileCard />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});


