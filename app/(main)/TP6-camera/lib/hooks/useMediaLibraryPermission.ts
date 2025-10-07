import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

export function useMediaLibraryPermission() {
  const [status, setStatus] = useState<MediaLibrary.PermissionResponse | null>(null);
  const [granted, setGranted] = useState(false);

  // Only request access to photos (images), not audio or videos
  const GRANULAR: MediaLibrary.GranularPermission[] = ['photo'];

  useEffect(() => {
    (async () => {
      const existing = await MediaLibrary.getPermissionsAsync(undefined, GRANULAR);
      setStatus(existing);
      setGranted(existing.granted || existing.accessPrivileges === 'all' || existing.accessPrivileges === 'limited');
    })();
  }, []);

  const ask = useCallback(async () => {
    const res = await MediaLibrary.requestPermissionsAsync(undefined, GRANULAR);
    setStatus(res);
    const ok = res.granted || res.accessPrivileges === 'all' || res.accessPrivileges === 'limited';
    setGranted(ok);
    return ok;
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings?.();
  }, []);

  return { status, granted, ask, openSettings };
}