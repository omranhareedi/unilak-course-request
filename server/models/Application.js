import { randomUUID } from 'crypto';
import { queryAll, queryOne, run } from '../config/db.js';

const mapRow = (row) => row ? {
  _id: row.id,
  registrationNumber: row.registration_number,
  email: row.email,
  fullName: row.full_name,
  department: row.department,
  message: row.message,
  status: row.status,
  adminNote: row.admin_note,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
} : null;

export const createApplication = ({ registrationNumber, email, fullName, department, message }) => {
  const id = randomUUID();
  run(
    'INSERT INTO applications (id, registration_number, email, full_name, department, message) VALUES (?, ?, ?, ?, ?, ?)',
    [id, registrationNumber, email, fullName, department, message]
  );
  return mapRow(queryOne('SELECT * FROM applications WHERE id = ?', [id]));
};

export const findPendingOrAcceptedByReg = (registrationNumber) =>
  mapRow(queryOne("SELECT * FROM applications WHERE registration_number = ? AND status IN ('pending', 'accepted') LIMIT 1", [registrationNumber]));

export const findByReg = (registrationNumber) =>
  queryAll('SELECT * FROM applications WHERE registration_number = ? ORDER BY created_at DESC', [registrationNumber]).map(mapRow);

export const findAll = (statusFilter) => {
  const rows = statusFilter && statusFilter !== 'all'
    ? queryAll('SELECT * FROM applications WHERE status = ? ORDER BY created_at DESC', [statusFilter])
    : queryAll('SELECT * FROM applications ORDER BY created_at DESC');
  return rows.map(mapRow);
};

export const findById = (id) =>
  mapRow(queryOne('SELECT * FROM applications WHERE id = ?', [id]));

export const updateStatus = (id, status, adminNote) => {
  run("UPDATE applications SET status = ?, admin_note = ?, updated_at = datetime('now') WHERE id = ?", [status, adminNote || '', id]);
  return mapRow(queryOne('SELECT * FROM applications WHERE id = ?', [id]));
};
