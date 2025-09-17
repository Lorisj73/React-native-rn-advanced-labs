import RobotForm from '@/components/RobotForm';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: `Éditer ${id}` }} />
      <RobotForm mode='edit' robotId={id} onSuccess={() => router.back()} />
    </>
  );
}
