import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileCard } from '../components/ProfileCard';

/**
 * Écran principal du TP1 affichant une carte de profil centrée.
 * Utilise un SafeAreaView pour respecter les encoches et zones sûres.
 */
export function ProfileCardScreen() {
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
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

export default ProfileCardScreen;


