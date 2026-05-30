import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'agent.db');

let useSqlite = false;
let db: any = null;

const FORCE_FILE = process.env.FORCE_FILE_MEMORY === '1' || false;
if (!FORCE_FILE) {
  try {
    // Try to initialize better-sqlite3 if available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require('better-sqlite3');
    db = new Database(DB_PATH);
    db.prepare('CREATE TABLE IF NOT EXISTS conversations (thread TEXT, ts INTEGER, role TEXT, payload TEXT)').run();
    useSqlite = true;
  } catch (err) {
    useSqlite = false;
  }
} else {
  useSqlite = false;
}

function ensureDataDir() {
  const p = path.join(process.cwd(), 'data');
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function appendConversation(threadId: string, item: any) {
  const row = { thread: threadId, ts: Date.now(), role: item.role || 'assistant', payload: JSON.stringify(item) };
  if (useSqlite && db) {
    try {
      db.prepare('INSERT INTO conversations (thread, ts, role, payload) VALUES (?, ?, ?, ?)').run(row.thread, row.ts, row.role, row.payload);
      return;
    } catch (err) {
      // fallback to file
    }
  }
  // file fallback
  ensureDataDir();
  const fp = path.join(process.cwd(), 'data', 'memory.json');
  let mem: Record<string, any[]> = {};
  try { mem = JSON.parse(fs.readFileSync(fp, 'utf-8') || '{}'); } catch {}
  mem[threadId] = mem[threadId] || [];
  mem[threadId].push({ ts: row.ts, ...item });
  fs.writeFileSync(fp, JSON.stringify(mem, null, 2), 'utf-8');
}

export function getConversation(threadId: string) {
  if (useSqlite && db) {
    try {
      const rows = db.prepare('SELECT ts, role, payload FROM conversations WHERE thread = ? ORDER BY ts ASC').all(threadId);
      return rows.map((r: any) => ({ ts: r.ts, ...JSON.parse(r.payload) }));
    } catch (err) {
      return [];
    }
  }
  try {
    const fp = path.join(process.cwd(), 'data', 'memory.json');
    const mem = JSON.parse(fs.readFileSync(fp, 'utf-8') || '{}');
    return mem[threadId] || [];
  } catch (err) {
    return [];
  }
}
