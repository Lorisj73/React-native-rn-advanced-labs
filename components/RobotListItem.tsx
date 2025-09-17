import { useAppDispatch } from '@/app/hooks';
import { deleteRobot, Robot } from '@/features/robots/robotsSlice';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props { robot: Robot }

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const RobotListItem: React.FC<Props> = ({ robot }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onDelete = () => {
    Alert.alert('Supprimer', `Supprimer ${robot.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => dispatch(deleteRobot(robot.id)) }
    ]);
  };

  const goEdit = () => router.push({ pathname: '/(main)/tp4b-robots-rtk/edit/[id]', params: { id: robot.id } });

  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={goEdit}>
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{robot.name}</Text>
        <Text style={styles.year}>{robot.year}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.type}>{capitalize(robot.type)}</Text>
        <View style={styles.actions}>
          <Pressable onPress={goEdit} style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}>
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && styles.actionPressed]}>
            <Text style={styles.actionText}>Del</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.label}>{robot.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 14, borderRadius: 10, gap: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  pressed: { opacity: 0.8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: '700', fontSize: 16 },
  year: { fontSize: 14, color: '#555' },
  label: { fontSize: 13, color: '#444' },
  type: { fontSize: 13, fontWeight: '600', color: '#2563eb' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#2563eb', borderRadius: 6 },
  deleteBtn: { backgroundColor: '#dc2626' },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  actionPressed: { opacity: 0.7 },
});

export default RobotListItem;
