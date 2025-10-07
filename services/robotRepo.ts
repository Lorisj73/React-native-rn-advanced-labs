import { getDb } from '@/db';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

export interface RobotDB {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
  created_at: string;
  updated_at: string;
  archived?: number; // 0/1
}

export type RobotInput = Omit<RobotDB, 'id' | 'created_at' | 'updated_at' | 'archived'>;
export type RobotChanges = Partial<RobotInput>;

function genId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

export async function create(input: RobotInput): Promise<RobotDB> {
  const db = await getDb();
  const id = genId();
  const now = new Date().toISOString();
  try {
    await db.runAsync(
      `INSERT INTO robots (id, name, label, year, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.name.trim(), input.label.trim(), input.year, input.type, now, now]
    );
  } catch (e: any) {
    if (String(e?.message || '').toLowerCase().includes('unique')) {
      throw new Error('Name déjà utilisé');
    }
    throw e;
  }
  const row = await getById(id);
  if (!row) throw new Error('Insert échoué');
  return row;
}

export async function update(id: string, changes: RobotInput): Promise<RobotDB> {
  const db = await getDb();
  const now = new Date().toISOString();
  try {
    await db.runAsync(
      `UPDATE robots SET name=?, label=?, year=?, type=?, updated_at=? WHERE id=?`,
      [changes.name.trim(), changes.label.trim(), changes.year, changes.type, now, id]
    );
  } catch (e: any) {
    if (String(e?.message || '').toLowerCase().includes('unique')) {
      throw new Error('Name déjà utilisé');
    }
    throw e;
  }
  const row = await getById(id);
  if (!row) throw new Error('Update échoué');
  return row;
}

export async function remove(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM robots WHERE id = ?`, [id]);
}

export async function getById(id: string): Promise<RobotDB | undefined> {
  const db = await getDb();
  const row = await db.getFirstAsync<RobotDB>(`SELECT * FROM robots WHERE id = ?`, [id]);
  return row ?? undefined;
}

export interface ListParams {
  q?: string;
  sort?: 'name' | 'year';
  limit?: number;
  offset?: number;
  includeArchived?: boolean;
}

export async function list(params: ListParams = {}): Promise<RobotDB[]> {
  const db = await getDb();
  const { q, sort = 'name', limit, offset, includeArchived = false } = params;
  const where: string[] = [];
  const args: any[] = [];
  if (!includeArchived) where.push('COALESCE(archived,0) = 0');
  if (q && q.trim()) {
    where.push('(LOWER(name) LIKE ? OR LOWER(label) LIKE ?)');
    const like = `%${q.trim().toLowerCase()}%`;
    args.push(like, like);
  }
  const order = sort === 'year' ? 'ORDER BY year ASC, LOWER(name) ASC' : 'ORDER BY LOWER(name) ASC, year ASC';
  const lim = typeof limit === 'number' ? ` LIMIT ${limit}` : '';
  const off = typeof offset === 'number' ? ` OFFSET ${offset}` : '';
  const sql = `SELECT * FROM robots ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ${order}${lim}${off}`;
  const rows = await db.getAllAsync<RobotDB>(sql, args);
  return rows;
}

// Removed import-related utilities and SAF directory management.

export async function exportToJson(): Promise<string> {
  const rows = await list({ includeArchived: true });
  const content = JSON.stringify({ robots: rows }, null, 2);
  const filename = `robots-export-${Date.now()}.json`;

  if (Platform.OS === 'web') {
    const g: any = globalThis as any;
    const doc = g && g.document;
    if (doc && doc.createElement) {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement('a');
      a.href = url;
      a.download = filename;
      doc.body.appendChild(a);
      a.click();
      doc.body.removeChild(a);
      URL.revokeObjectURL(url);
      return 'download';
    }
    throw new Error('Export web non supporté');
  }

  // Native: essayer documentDirectory puis cacheDirectory
  const base = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
  const fileUri = `${base}${filename}`;
  try {
    await FileSystem.writeAsStringAsync(fileUri, content);
    return fileUri;
  } catch (e: any) {
    throw new Error(`Échec export: ${e?.message || String(e)}`);
  }
}

export async function importFromPickedFile(): Promise<number> {
  // Ouvre le sélecteur et copie dans le cache si nécessaire
  const res = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true, multiple: false });
  if (res.canceled || !res.assets?.[0]?.uri) {
    return 0;
  }
  const uri = res.assets[0].uri;
  const content = await FileSystem.readAsStringAsync(uri);
  const parsed = JSON.parse(content) as { robots?: RobotDB[] };
  const robots = parsed.robots || [];

  const db = await getDb();
  await db.execAsync('BEGIN');
  let count = 0;
  try {
    for (const r of robots) {
      const name = String(r.name || '').trim();
      if (!name) continue;
      const label = String(r.label || '').trim();
      const year = Number(r.year) || new Date().getFullYear();
      const type = (r.type as RobotType) || 'other';
      const now = new Date().toISOString();
      const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM robots WHERE LOWER(name) = LOWER(?) LIMIT 1', [name]);
      if (existing?.id) {
        await db.runAsync('UPDATE robots SET label=?, year=?, type=?, updated_at=? WHERE id=?', [label, year, type, now, existing.id]);
      } else {
        const id = genId();
        await db.runAsync('INSERT INTO robots (id, name, label, year, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, name, label, year, type, now, now]);
      }
      count++;
    }
    await db.execAsync('COMMIT');
  } catch (e) {
    await db.execAsync('ROLLBACK');
    throw e;
  }
  return count;
}
