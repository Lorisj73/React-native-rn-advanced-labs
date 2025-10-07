import RobotForm from '@/components/RobotForm';
import * as repo from '@/services/robotRepo';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function CreateDbRobotScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Créer un robot (DB)' }} />
      <RobotForm
        mode='create'
        onSubmitOverride={async (v) => {
          await repo.create({ name: v.name, label: v.label, year: v.year, type: v.type });
        }}
        onSuccess={() => router.back()}
      />
    </>
  );
}
