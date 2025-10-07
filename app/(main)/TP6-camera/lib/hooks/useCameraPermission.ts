import { useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

export function useCameraPermission() {
  const [permission, request] = useCameraPermissions();
  const [granted, setGranted] = useState<boolean>(false);

  useEffect(() => {
    if (permission?.granted) setGranted(true);
  }, [permission]);

  const ask = useCallback(async () => {
    const res = await request();
    setGranted(!!res.granted);
    return res.granted;
  }, [request]);

  const openSettings = useCallback(() => {
    Linking.openSettings?.();
  }, []);

  return { permission, granted, ask, openSettings };
}
