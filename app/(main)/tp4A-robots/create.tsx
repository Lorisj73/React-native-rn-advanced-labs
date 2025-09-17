import RobotForm from '@/components/RobotForm';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateRobotScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}> 
      <View style={styles.inner}> 
        <Text style={styles.title}>Créer un robot</Text>
        <RobotForm
          mode='create'
          onSuccess={() => { router.back(); }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  inner: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: '700', marginTop: 4, marginBottom: 12 }
});
