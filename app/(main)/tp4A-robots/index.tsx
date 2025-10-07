import RobotListItem from '@/components/RobotListItem';
import { useRobotsStore } from '@/store/robotStore';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RobotsListScreen() {
  const robots = useRobotsStore(s => s.robots);
  const clearAll = useRobotsStore(s => s.clearAll);
  const remove = useRobotsStore(s => s.remove);
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'name' | 'year'>('name');
  const sorted = useMemo(() => {
    return [...robots].sort((a,b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
      return a.year - b.year;
    });
  }, [robots, sortBy]);

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* Barre de tri */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Tri:</Text>
        <Pressable onPress={() => setSortBy('name')} style={[styles.sortBtn, sortBy==='name' && styles.sortBtnActive]}>
          <Text style={[styles.sortBtnText, sortBy==='name' && styles.sortBtnTextActive]}>Nom</Text>
        </Pressable>
        <Pressable onPress={() => setSortBy('year')} style={[styles.sortBtn, sortBy==='year' && styles.sortBtnActive]}>
          <Text style={[styles.sortBtnText, sortBy==='year' && styles.sortBtnTextActive]}>Année</Text>
        </Pressable>
      </View>
      {sorted.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Aucun robot. Ajoutez-en un.</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <RobotListItem
              robot={item}
              onDelete={(id) => remove(id)}
              editPathname='/(main)/tp4A-robots/edit/[id]'
            />
          )}
        />
      )}

      <Pressable style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]} onPress={() => router.push('/(main)/tp4A-robots/create')}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
      {robots.length > 0 && (
        <Pressable style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]} onLongPress={clearAll}>
          <Text style={styles.clearTxt}>Reset (long press)</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingTop: 8 },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sortLabel: { fontWeight: '600' },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e2e8f0' },
  sortBtnActive: { backgroundColor: '#2563eb' },
  sortBtnText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  sortBtnTextActive: { color: '#fff' },
  listContent: { paddingBottom: 120 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#555' },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#2563eb', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
  clearBtn: { position: 'absolute', bottom: 24, left: 24, backgroundColor: '#ef4444', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  clearTxt: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
