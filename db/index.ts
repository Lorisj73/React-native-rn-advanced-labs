import * as SQLite from 'expo-sqlite';

export type DB = SQLite.SQLiteDatabase;

let dbPromise: Promise<DB> | null = null;

export async function getDb(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('robots.db');
      await runMigrations(db);
      return db;
    })();
  }
  return dbPromise;
}

async function getUserVersion(db: DB): Promise<number> {
  const res = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  return res?.user_version ?? 0;
}

async function setUserVersion(db: DB, v: number) {
  await db.execAsync(`PRAGMA user_version = ${v}`);
}

// Inline SQL (also mirrored in db/migrations/*.sql)
const MIGRATIONS: Array<{ v: number; sql: string }> = [
  {
    v: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS robots (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        label TEXT NOT NULL,
        year INTEGER NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `,
  },
  {
    v: 2,
    sql: `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_robots_name ON robots (LOWER(name));
      CREATE INDEX IF NOT EXISTS idx_robots_year ON robots (year);
    `,
  },
  {
    v: 3,
    sql: `
      ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
    `,
  },
];

export async function runMigrations(db: DB) {
  const current = await getUserVersion(db);
  for (const m of MIGRATIONS) {
    if (m.v > current) {
      await db.execAsync('BEGIN');
      try {
        await db.execAsync(m.sql);
        await setUserVersion(db, m.v);
        await db.execAsync('COMMIT');
      } catch (e) {
        await db.execAsync('ROLLBACK');
        throw e;
      }
    }
  }
}
