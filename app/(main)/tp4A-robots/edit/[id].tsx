import RobotForm from '@/components/RobotForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {id ? (
        <RobotForm
          mode='edit'
          robotId={id}
          onSuccess={() => router.back()}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' }
});
