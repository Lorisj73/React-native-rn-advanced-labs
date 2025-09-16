import { router, useLocalSearchParams } from "expo-router"; // retrait notFound, ajout router
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Écran de détail dynamique avec validation de paramètre.
 * - ID requis, numérique positif.
 * - Si invalide: on affiche une vue 404 locale.
 */
export default function DetailScreen() {
  const params = useLocalSearchParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  const isValid = !!rawId && /^\d+$/.test(String(rawId));

  if (!isValid) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>ID invalide ou manquant.</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/home')}>
          <Text style={styles.buttonText}>Retour Home</Text>
        </Pressable>
      </View>
    );
  }

  const id = Number(rawId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail</Text>
      <Text style={styles.subtitle}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  button: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
