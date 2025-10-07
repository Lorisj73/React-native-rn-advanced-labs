import RobotForm from '@/components/RobotForm';
import * as repo from '@/services/robotRepo';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function EditDbRobotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [robot, setRobot] = useState<repo.RobotDB | undefined>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = id ? await repo.getById(id) : undefined;
        if (mounted) setRobot(r);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }
  if (!robot) {
    return <View style={styles.center}><Text>Robot introuvable.</Text></View>;
  }

  return (
    <>
      <Stack.Screen options={{ title: `Éditer ${robot.name}` }} />
      <RobotForm
        mode='edit'
        robotId={robot.id}
        defaultValues={{ name: robot.name, label: robot.label, year: robot.year, type: robot.type as any }}
        onSubmitOverride={async (v) => {
          await repo.update(robot.id, { name: v.name, label: v.label, year: v.year, type: v.type });
        }}
        onSuccess={() => router.back()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
