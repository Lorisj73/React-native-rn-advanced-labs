import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';

const LAST_PATH_KEY = 'LAST_VISITED_PATH';

function normalizePath(p?: string | null) {
  if (!p || p === '/' || p === '') return '/home';
  return p;
}

function NavigationPersistence({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [restored, setRestored] = React.useState(false);
  const triedRef = React.useRef(false);

  React.useEffect(() => {
    if (triedRef.current) return; // sécurité multi-mount (Fast Refresh / StrictMode)
    triedRef.current = true;
    (async () => {
      try {
        const savedRaw = await AsyncStorage.getItem(LAST_PATH_KEY);
        const saved = normalizePath(savedRaw);
        const current = normalizePath(pathname);
        // Ne restaurer que si on démarre réellement sur la racine ("/" ou initial) ET qu'on a un chemin différent
        const startingFromRoot = pathname === '/' || pathname === '' || pathname === undefined;
        if (saved && saved !== current && startingFromRoot) {
          router.replace(saved as any);
        }
      } catch (e) {
        // noop
      } finally {
        setRestored(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!restored) return; // attendre la phase de restauration
    const toStore = normalizePath(pathname);
    if (toStore && toStore !== '/home') { // on peut aussi décider de stocker /home; ici on évite spam
      AsyncStorage.setItem(LAST_PATH_KEY, toStore).catch(() => {});
    }
  }, [pathname, restored]);

  if (!restored) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

// Layout racine: définit un Stack global qui encapsule les sous-ensembles
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NavigationPersistence>
            <Stack>
              <Stack.Screen name="(main)" options={{ headerShown: false }} />
            </Stack>
          </NavigationPersistence>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
