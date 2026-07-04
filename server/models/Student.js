import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { queryAll, queryOne, run } from '../config/db.js';

const mapRow = (row) => row && {
  id: row.id,
  registrationNumber: row.registration_number,
  email: row.email,
  fullName: row.full_name,
  phone: row.phone,
  createdAt: row.created_at,
};

export const create = async ({ registrationNumber, email, password, fullName, phone }) => {
  const hashed = await bcrypt.hash(password, 10);
  const id = randomUUID();
  run(
    'INSERT INTO students (id, registration_number, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
    [id, registrationNumber, email, hashed, fullName, phone || '']
  );
  return mapRow(queryOne('SELECT * FROM students WHERE id = ?', [id]));
};

export const findByReg = (reg) => mapRow(queryOne('SELECT * FROM students WHERE registration_number = ?', [reg]));

export const findByEmail = (email) => mapRow(queryOne('SELECT * FROM students WHERE email = ?', [email]));

export const verifyPassword = async (student, password) => bcrypt.compare(password, student.password || '');
