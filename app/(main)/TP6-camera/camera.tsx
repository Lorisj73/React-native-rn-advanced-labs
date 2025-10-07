import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { savePhoto } from './lib/camera/storage';
import { useCameraPermission } from './lib/hooks/useCameraPermission';

export default function CameraScreen() {
  const router = useRouter();
  const { granted, ask, openSettings } = useCameraPermission();
  const camRef = React.useRef<any>(null);
  const [facing, setFacing] = React.useState<'back' | 'front'>('back');
  const [busy, setBusy] = React.useState(false);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    // Ask on enter if not granted
    if (!granted) {
      ask().catch(() => {});
    }
  }, [granted, ask]);

  if (!granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Accès caméra requis</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Pressable onPress={ask} style={[styles.btn, { backgroundColor: '#2563eb' }]}>
            <Text style={styles.btnTxt}>Autoriser</Text>
          </Pressable>
          <Pressable onPress={openSettings} style={[styles.btn, { backgroundColor: '#0ea5e9' }]}>
            <Text style={styles.btnTxt}>Réglages</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const onCapture = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const shot = await camRef.current?.takePictureAsync?.({ quality: 0.8, skipProcessing: true });
      if (!shot?.uri) return;
      await savePhoto(shot.uri);
      Alert.alert('Photo enregistrée');
      router.replace('/(main)/TP6-camera');
    } catch (e: any) {
      Alert.alert('Capture échouée', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={camRef} style={{ flex: 1 }} facing={facing}>
        <View style={[styles.overlayTop, { top: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.btnSm, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <Text style={styles.btnTxt}>Retour</Text>
          </Pressable>
          <Pressable onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))} style={[styles.btnSm, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <Text style={styles.btnTxt}>{facing === 'back' ? 'Front' : 'Back'}</Text>
          </Pressable>
        </View>
        <View style={[styles.overlayBottom, { bottom: insets.bottom + 24 }]}>
          <Pressable onPress={onCapture} disabled={busy} style={[styles.shutter, busy && { opacity: 0.6 }]} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  btnSm: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '700' },
  overlayTop: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overlayBottom: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  shutter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', borderWidth: 4, borderColor: '#e2e8f0' },
});