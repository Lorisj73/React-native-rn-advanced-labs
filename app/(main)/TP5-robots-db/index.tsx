import RobotListItem from '@/components/RobotListItem';
import { useDeleteRobotMutation, useExportRobotsMutation, useImportPickedFileMutation, useRobotsQuery } from '@/services/robotQueries';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RobotsDbListScreen() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'name' | 'year'>('name');
  const robotsQ = useRobotsQuery({ q, sort });
  const delMut = useDeleteRobotMutation();
  const exportMut = useExportRobotsMutation();
  const importMut = useImportPickedFileMutation();

  const robots = robotsQ.data || [];

  const onDelete = async (id: string) => {
    try { await delMut.mutateAsync(id); } catch (e: any) { Alert.alert('Suppression échouée', e.message || String(e)); }
  };

  const onExport = async () => {
    try {
      const uri = await exportMut.mutateAsync();
      Alert.alert('Export OK', `Fichier: ${uri}`);
    } catch (e: any) {
      Alert.alert('Export échoué', e.message || String(e));
    }
  };

  // Import supprimé (export uniquement)

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <View style={styles.headerRow}>
        <TextInput
          placeholder="Rechercher..."
          value={q}
          onChangeText={setQ}
          style={styles.search}
          returnKeyType="search"
          onSubmitEditing={() => robotsQ.refetch()}
        />
        <View style={styles.sortBar}>
          <Pressable onPress={() => setSort('name')} style={[styles.sortBtn, sort==='name' && styles.sortActive]}><Text style={[styles.sortTxt, sort==='name' && styles.sortTxtActive]}>Nom</Text></Pressable>
          <Pressable onPress={() => setSort('year')} style={[styles.sortBtn, sort==='year' && styles.sortActive]}><Text style={[styles.sortTxt, sort==='year' && styles.sortTxtActive]}>Année</Text></Pressable>
        </View>
      </View>

      <View style={styles.toolsRow}>
        <Pressable onPress={onExport} style={[styles.toolBtn, exportMut.isPending && { opacity: 0.7 }]} disabled={exportMut.isPending}>
          <Text style={styles.toolTxt}>{exportMut.isPending ? '...' : 'Export JSON'}</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            try {
              const n = await importMut.mutateAsync();
              Alert.alert('Import OK', `${n} robots importés.`);
            } catch (e: any) {
              Alert.alert('Import échoué', e?.message || String(e));
            }
          }}
          style={[styles.toolBtn, importMut.isPending && { opacity: 0.7 }, { backgroundColor: '#16a34a' }]}
          disabled={importMut.isPending}
        >
          <Text style={styles.toolTxt}>{importMut.isPending ? '...' : 'Import JSON'}</Text>
        </Pressable>
      </View>

      {robotsQ.isLoading ? (
        <View style={styles.loadingBox}><ActivityIndicator /></View>
      ) : (
        <FlatList
          data={robots}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[robots.length === 0 ? styles.emptyContainer : styles.listContent, { paddingTop: 8 }]}
          renderItem={({ item }) => (
            <RobotListItem
              robot={item}
              onDelete={onDelete}
              editPathname='/(main)/TP5-robots-db/edit/[id]'
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun robot.</Text>}
        />
      )}

      <Pressable style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]} onPress={() => router.push('/(main)/TP5-robots-db/create')}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  search: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  sortBar: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 30, padding: 4 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sortActive: { backgroundColor: '#2563eb' },
  sortTxt: { fontSize: 12, fontWeight: '600', color: '#334155' },
  sortTxtActive: { color: '#fff' },
  toolsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  toolBtn: { backgroundColor: '#0ea5e9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  toolTxt: { color: '#fff', fontWeight: '700' },
  // import UI removed
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { gap: 12, paddingBottom: 120 },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#64748b' },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#2563eb', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
});
