import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

const LAST_PATH_KEY = 'LAST_VISITED_PATH';

function NavigationPersistence({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [restored, setRestored] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LAST_PATH_KEY);
        if (saved && saved !== pathname) {
          // Validation simple: ne restaurer que si commence par /(
          if (saved.startsWith('/')) {
            router.replace(saved as any);
          }
        }
      } catch (e) {
        // Silencieux
      } finally {
        setRestored(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (pathname) {
      AsyncStorage.setItem(LAST_PATH_KEY, pathname).catch(() => {});
    }
  }, [pathname]);

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationPersistence>
        {/* Stack global: (main) est l'entrée principale */}
        <Stack>
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(detail)" options={{ headerShown: false }} /> */}
        </Stack>
      </NavigationPersistence>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
