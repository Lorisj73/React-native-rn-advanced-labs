import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

/**
 * Page d'accueil très simple.
 * Placée dans app/(main)/ pour devenir un onglet automatiquement.
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue 👋</Text>
      <Text style={styles.subtitle}>Ceci est l'onglet Home du groupe (main).</Text>
      {/* Lien typé vers la route dynamique avec params */}
      <Link href={{ pathname: '/(detail)/42'}} style={styles.link}>
        Voir le détail #42
      </Link>
      <Link href={{ pathname: '/(detail)/43'}} style={styles.link}>
        Voir le détail #43
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    marginTop: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
});


