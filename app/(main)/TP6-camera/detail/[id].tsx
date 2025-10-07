import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteLibraryPhoto, deletePhoto, getLibraryPhoto, getPhoto } from '../lib/camera/storage';
import type { Photo } from '../lib/camera/types';

export default function PhotoDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; source?: 'app' | 'library' }>();
  const id = params.id as string | undefined;
  const source = (params.source as 'app' | 'library') ?? 'app';
  const [photo, setPhoto] = React.useState<Photo | undefined>();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (!id) return;
    const load = async () => {
      const p = source === 'library' ? await getLibraryPhoto(id) : await getPhoto(id);
      setPhoto(p);
    };
    load();
  }, [id, source]);

  const onDelete = async () => {
    if (!id) return;
    Alert.alert('Supprimer', 'Confirmer la suppression ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            if (source === 'library') await deleteLibraryPhoto(id); else await deletePhoto(id);
            router.replace('/(main)/TP6-camera');
          } catch (e: any) {
            Alert.alert('Suppression échouée', e?.message || String(e));
          }
        }
      }
    ]);
  };

  const onShare = async () => {
    if (!photo) return;
    try {
      await Share.share({ url: photo.uri, message: photo.uri });
    } catch (e: any) {
      Alert.alert('Partage échoué', e?.message || String(e));
    }
  };

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Photo introuvable.</Text>
        <Pressable onPress={() => router.back()} style={[styles.btn, { backgroundColor: '#2563eb', marginTop: 12 }]}>
          <Text style={styles.btnTxt}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const created = new Date(photo.createdAt);
  const meta = `${created.toLocaleString()}${photo.size ? ` • ${Math.round(photo.size/1024)} KB` : ''}`;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Image source={{ uri: photo.uri }} style={{ flex: 1, resizeMode: 'contain' as const }} />
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.metaTitle}>{photo.id}</Text>
          <Text style={styles.metaText}>{meta}</Text>
        </View>
        <Pressable onPress={onShare} style={[styles.btn, { backgroundColor: '#0ea5e9' }]}>
          <Text style={styles.btnTxt}>Partager</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={[styles.btn, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.btnTxt}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  muted: { color: '#64748b' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#0b0f17' },
  metaTitle: { color: '#fff', fontWeight: '700' },
  metaText: { color: '#cbd5e1', fontSize: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '700' },
});