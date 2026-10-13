const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'nexora.db');
const LEADS_JSON = path.join(DATA_DIR, 'leads.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    handled INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal',
    status TEXT NOT NULL DEFAULT 'open'
  );
`);

function migrateLeadsFromJson() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM leads').get().c;
  if (count > 0 || !fs.existsSync(LEADS_JSON)) return;
  let rows;
  try {
    rows = JSON.parse(fs.readFileSync(LEADS_JSON, 'utf8'));
  } catch {
    return;
  }
  if (!Array.isArray(rows) || rows.length === 0) return;

  const insert = db.prepare(`
    INSERT INTO leads (created_at, name, email, phone, service, message, handled)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN');
  try {
    for (const r of rows) {
      insert.run(
        r.at || r.created_at || new Date().toISOString(),
        String(r.name || ''),
        String(r.email || ''),
        String(r.phone || ''),
        String(r.service || ''),
        String(r.message || ''),
        r.handled ? 1 : 0
      );
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  const bak = LEADS_JSON + '.migrated';
  if (!fs.existsSync(bak)) fs.renameSync(LEADS_JSON, bak);
  console.log(`Migrated ${rows.length} leads from leads.json`);
}

migrateLeadsFromJson();

function createLead(data) {
  const info = db
    .prepare(
      `INSERT INTO leads (created_at, name, email, phone, service, message)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      new Date().toISOString(),
      data.name,
      data.email,
      data.phone || '',
      data.service || '',
      data.message
    );
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(info.lastInsertRowid);
}

function listLeads({ q, handled } = {}) {
  let sql = 'SELECT * FROM leads WHERE 1=1';
  const params = [];
  if (q) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ? OR message LIKE ?)';
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }
  if (handled === '0' || handled === '1') {
    sql += ' AND handled = ?';
    params.push(Number(handled));
  }
  sql += ' ORDER BY datetime(created_at) DESC';
  return db.prepare(sql).all(...params);
}

function setLeadHandled(id, handled) {
  db.prepare('UPDATE leads SET handled = ? WHERE id = ?').run(handled ? 1 : 0, id);
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
}

function nextTicketReference() {
  const year = new Date().getFullYear();
  const prefix = `RF-${year}-`;
  const row = db
    .prepare(`SELECT reference FROM tickets WHERE reference LIKE ? ORDER BY id DESC LIMIT 1`)
    .get(`${prefix}%`);
  let n = 1;
  if (row) {
    const part = Number(String(row.reference).split('-').pop());
    if (!Number.isNaN(part)) n = part + 1;
  }
  return `${prefix}${String(n).padStart(4, '0')}`;
}

function createTicket(data) {
  const reference = nextTicketReference();
  const info = db
    .prepare(
      `INSERT INTO tickets (reference, created_at, name, email, phone, subject, message, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      reference,
      new Date().toISOString(),
      data.name,
      data.email,
      data.phone || '',
      data.subject,
      data.message,
      data.priority || 'normal'
    );
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(info.lastInsertRowid);
}

function listTickets() {
  return db.prepare('SELECT * FROM tickets ORDER BY datetime(created_at) DESC').all();
}

function leadsToCsv(rows) {
  const header = ['id', 'created_at', 'name', 'email', 'phone', 'service', 'message', 'handled'];
  const esc = (v) => {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [header.join(','), ...rows.map((r) => header.map((h) => esc(r[h])).join(','))].join('\n');
}

module.exports = {
  db,
  createLead,
  listLeads,
  setLeadHandled,
  createTicket,
  listTickets,
  leadsToCsv,
  DB_PATH,
};
