import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Composant de carte de profil autonome.
 * Contient l'état "isFollowing" et "followersCount" pour gérer le bouton Follow
 * et l'affichage du compteur de followers.
 */
export function ProfileCard() {
  // Etat booléen indiquant si l'utilisateur est suivi
  const [isFollowing, setIsFollowing] = useState(false);
  // Compteur de followers; valeur initiale arbitraire pour la démo
  const [followersCount, setFollowersCount] = useState(1234);

  // Texte du bouton selon l'état
  const buttonLabel = useMemo(() => (isFollowing ? 'Following' : 'Follow'), [isFollowing]);

  // Gestion du clic sur le bouton Follow
  const onToggleFollow = () => {
    // Si on passe à "Following", on incrémente; sinon on décrémente avec un plancher à 0
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowersCount((count) => {
        const delta = next ? 1 : -1;
        const nextCount = count + delta;
        return nextCount < 0 ? 0 : nextCount;
      });
      return next;
    });
  };

  // URL d'image publique pour la photo de profil
  const avatarUri = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces&q=80&auto=format';

  // Effet: incrémente automatiquement le nombre de followers toutes les 5 secondes
  // Nettoyage: on supprime le timer quand le composant est démonté
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFollowersCount((count) => count + 1);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.card}>
      {/* Image d'avatar */}
      <Image source={{ uri: avatarUri }} style={styles.avatar} />

      {/* Nom et fonction */}
      <Text style={styles.name}>Jane Doe</Text>
      <Text style={styles.role}>Product Designer</Text>

      {/* Statistiques simples */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{followersCount.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>128</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Bouton Follow */}
      <Pressable
        accessibilityRole="button"
        onPress={onToggleFollow}
        style={({ pressed }) => [styles.button, isFollowing ? styles.buttonFollowing : styles.buttonFollow, pressed && styles.buttonPressed]}
      >
        <Text style={[styles.buttonText, isFollowing ? styles.buttonTextFollowing : styles.buttonTextFollow]}>
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Conteneur principal de la carte
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  // Avatar rond
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  // Nom
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  // Fonction
  role: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  // Ligne de stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 16,
  },
  // Bloc de stat (valeur + label)
  stat: {
    alignItems: 'center',
    minWidth: 96,
  },
  // Valeur de stat
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  // Label de stat
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Séparateur vertical entre stats
  separator: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
  },
  // Bouton principal
  button: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 160,
    alignItems: 'center',
  },
  // Style du bouton en mode "Follow"
  buttonFollow: {
    backgroundColor: '#111827',
  },
  // Style du bouton en mode "Following"
  buttonFollowing: {
    backgroundColor: '#E5E7EB',
  },
  // Effet d'appui
  buttonPressed: {
    opacity: 0.9,
  },
  // Texte du bouton par défaut (Follow)
  buttonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  buttonTextFollow: {
    color: '#FFFFFF',
  },
  // Texte du bouton en mode Following
  buttonTextFollowing: {
    color: '#111827',
  },
});

export default ProfileCard;


