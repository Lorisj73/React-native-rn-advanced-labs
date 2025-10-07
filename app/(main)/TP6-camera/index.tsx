import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as cameraStorage from './lib/camera/storage';
import type { Photo } from './lib/camera/types';
import { useMediaLibraryPermission } from './lib/hooks/useMediaLibraryPermission';

export default function CameraGalleryScreen() {
  const router = useRouter();
  const [items, setItems] = React.useState<Photo[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<'app' | 'library'>('app');
  const { granted: libGranted, ask: askLib } = useMediaLibraryPermission();

  const isExpoGo = Platform.OS === 'android' && Constants.appOwnership === 'expo';

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      if (mode === 'app') {
        const rows = await cameraStorage.listPhotos();
        setItems(rows);
      } else {
        if (isExpoGo) {
          setItems([]);
          return;
        }
        if (!libGranted) {
          const ok = await askLib();
          if (!ok) {
            setItems([]);
            return;
          }
        }
        const rows = await cameraStorage.listLibraryPhotos();
        setItems(rows);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [mode, libGranted, askLib, isExpoGo]);

  useFocusEffect(React.useCallback(() => {
    load();
  }, [load]));

  const numColumns = 3;
  const size = Math.floor(Dimensions.get('window').width / numColumns) - 8;

  const onPressLibrary = React.useCallback(() => {
    if (isExpoGo) {
      Alert.alert(
        'Non supporté dans Expo Go',
        "L'accès complet à la photothèque via expo-media-library n'est pas disponible dans Expo Go sur Android. Créez un development build (npx expo run:android ou EAS dev build) pour tester cette fonctionnalité.",
      );
      return;
    }
    setMode('library');
  }, [isExpoGo]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Galerie</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Pressable onPress={() => setMode('app')} style={[styles.segment, mode === 'app' && styles.segmentActive]}>
            <Text style={[styles.segmentTxt, mode === 'app' && styles.segmentTxtActive]}>App</Text>
          </Pressable>
          <Pressable onPress={onPressLibrary} style={[styles.segment, mode === 'library' && styles.segmentActive, isExpoGo && { opacity: 0.6 }]}>
            <Text style={[styles.segmentTxt, mode === 'library' && styles.segmentTxtActive]}>Librairie</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(main)/TP6-camera/camera')} style={styles.primaryBtn}>
            <Text style={styles.primaryTxt}>Prendre une photo</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(it) => `${it.source ?? 'app'}:${it.id}`}
        numColumns={numColumns}
        contentContainerStyle={[items.length === 0 && styles.emptyList]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <Pressable style={{ width: size, height: size, margin: 4 }} onPress={() => router.push({ pathname: '/(main)/TP6-camera/detail/[id]', params: { id: item.id, source: item.source ?? 'app' } })}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#e2e8f0' }} resizeMode="cover" />
          </Pressable>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: '#64748b' }}>{mode === 'app' ? 'Aucune photo. Utilisez "Prendre une photo".' : (isExpoGo ? 'Non disponible dans Expo Go.' : (libGranted ? 'Aucune photo.' : 'Autorisez l’accès à la photothèque.'))}</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  primaryBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  primaryTxt: { color: '#fff', fontWeight: '700' },
  emptyList: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  segment: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#e2e8f0' },
  segmentActive: { backgroundColor: '#111827' },
  segmentTxt: { color: '#111827', fontWeight: '700' },
  segmentTxtActive: { color: '#fff' },
});