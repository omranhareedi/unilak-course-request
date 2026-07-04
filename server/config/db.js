import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data.db');

let db;

export const initDb = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY, registration_number TEXT NOT NULL, email TEXT NOT NULL,
    full_name TEXT NOT NULL, department TEXT NOT NULL, message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', admin_note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS campuses (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY, campus_id TEXT NOT NULL, name TEXT NOT NULL, code TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (campus_id) REFERENCES campuses(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY, department_id TEXT NOT NULL, name TEXT NOT NULL,
    prefix TEXT NOT NULL, avg_duration_min INTEGER NOT NULL DEFAULT 5,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, department_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS daily_counters (
    id INTEGER PRIMARY KEY AUTOINCREMENT, service_prefix TEXT NOT NULL,
    date TEXT NOT NULL, counter INTEGER NOT NULL DEFAULT 0,
    UNIQUE(service_prefix, date)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tokens (
    id TEXT PRIMARY KEY, full_token TEXT NOT NULL UNIQUE,
    service_prefix TEXT NOT NULL, token_num INTEGER NOT NULL,
    student_reg TEXT NOT NULL, student_phone TEXT DEFAULT '',
    student_name TEXT DEFAULT '', campus_id TEXT NOT NULL,
    department_id TEXT NOT NULL, service_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    priority INTEGER NOT NULL DEFAULT 0,
    called_at TEXT, served_at TEXT, completed_at TEXT,
    transferred_to_dept TEXT, transferred_to_service TEXT,
    staff_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (campus_id) REFERENCES campuses(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
  )`);

  save();
  return db;
};

export const save = () => {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

export const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

export const queryOne = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
};

export const run = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  stmt.step();
  stmt.free();
  save();
};
