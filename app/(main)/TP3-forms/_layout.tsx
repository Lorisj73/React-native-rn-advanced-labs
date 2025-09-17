import { Colors } from '@/constants/theme';
import { HeaderBackButton } from '@react-navigation/elements';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Pressable, Text, useColorScheme } from 'react-native';

export default function TP3FormsLayout() {
  const scheme = useColorScheme();
  const palette = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const goHome = () => router.replace('/home');
  const toFormik = () => router.replace('/TP3-forms/formik');
  const toRHF = () => router.replace('/TP3-forms/rhf');

  const switchBtn = (label: string, action: () => void) => (
    <Pressable
      onPress={action}
      accessibilityRole="button"
      style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, opacity: pressed ? 0.6 : 1 })}
    >
      <Text style={{ color: palette.tint, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );

  return (
    <Stack initialRouteName="formik/index" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="formik/index"
        options={{
          title: 'TP3 – Formik',
          headerLeft: (props) => <HeaderBackButton {...props} onPress={goHome} />,
          headerRight: () => switchBtn('RHF ▶', toRHF),
        }}
      />
      <Stack.Screen
        name="rhf/index"
        options={{
          title: 'TP3 – RHF',
          headerLeft: (props) => <HeaderBackButton {...props} onPress={goHome} />,
          headerRight: () => switchBtn('Formik ▶', toFormik),
        }}
      />
    </Stack>
  );
}
