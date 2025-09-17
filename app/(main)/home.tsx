import { Colors } from '@/constants/theme';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

/**
 * Page d'accueil très simple.
 * Placée dans app/(main)/ pour devenir un onglet automatiquement.
 */
export default function HomeScreen() {
  const scheme = useColorScheme();
  const palette = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.title, { color: palette.text }]}>Bienvenue 👋</Text>
      <Text style={[styles.subtitle, { color: scheme === 'dark' ? '#9CA3AF' : '#6B7280' }]}>Ceci est l'onglet Home du groupe (main).</Text>
      <Link href={{ pathname: '/(detail)/42'}} style={[styles.link, { color: palette.tint }]}>
        Voir le détail #42
      </Link>
      <Link href={{ pathname: '/(detail)/43'}} style={[styles.link, { color: palette.tint }]}>
        Voir le détail #43
      </Link>
      <Link href={{ pathname: '/(main)/tp4A-robots'}} style={[styles.link, { color: palette.tint }]}>
        TP Robots (liste)
      </Link>
      <Link href={{ pathname: '/(main)/tp4b-robots-rtk'}} style={[styles.link, { color: palette.tint }]}>
        TP Robots RTK
      </Link>
      {/* Boutons TP3 retirés */}
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


