import RobotForm from '@/components/RobotForm';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function CreateRobotScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Créer un robot' }} />
      <RobotForm mode='create' onSuccess={() => router.back()} />
    </>
  );
}
