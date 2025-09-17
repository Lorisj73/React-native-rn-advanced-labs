import { useAppSelector } from '@/app/hooks';
import RobotListItem from '@/components/RobotListItem';
import { makeSelectRobotsSorted } from '@/features/robots/selectors';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RobotsListScreen() {
  const [sort, setSort] = useState<'name' | 'year'>('name');
  const selector = useMemo(() => makeSelectRobotsSorted(sort), [sort]);
  const robots = useAppSelector(selector);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <View style={styles.sortBar}>
        <Pressable onPress={() => setSort('name')} style={[styles.sortBtn, sort==='name' && styles.sortBtnActive]}><Text style={[styles.sortText, sort==='name' && styles.sortTextActive]}>Nom</Text></Pressable>
        <Pressable onPress={() => setSort('year')} style={[styles.sortBtn, sort==='year' && styles.sortBtnActive]}><Text style={[styles.sortText, sort==='year' && styles.sortTextActive]}>Année</Text></Pressable>
      </View>
      <FlatList
        data={robots}
        keyExtractor={item => item.id}
        contentContainerStyle={[robots.length === 0 ? styles.emptyContainer : styles.listContent, { paddingTop: 8 }]}
        renderItem={({ item }) => <RobotListItem robot={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun robot. Ajoutez-en un.</Text>}
      />
      <Pressable style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]} onPress={() => router.push('/(main)/tp4b-robots-rtk/create')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  sortBar: { flexDirection: 'row', alignSelf: 'center', backgroundColor: '#e2e8f0', borderRadius: 30, padding: 4, marginBottom: 4 },
  sortBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  sortBtnActive: { backgroundColor: '#2563eb' },
  sortText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  sortTextActive: { color: '#fff' },
  listContent: { gap: 12, paddingBottom: 120 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: '#64748b' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabPressed: { opacity: 0.8 },
  fabText: { color: '#fff', fontSize: 30, marginTop: -2 },
});
