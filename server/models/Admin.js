import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { queryOne, run } from '../config/db.js';

export const createAdmin = async (email, password) => {
  const id = randomUUID();
  const hashed = await bcrypt.hash(password, 12);
  run('INSERT INTO admins (id, email, password) VALUES (?, ?, ?)', [id, email, hashed]);
  return { id, email };
};

export const findByEmail = (email) =>
  queryOne('SELECT * FROM admins WHERE email = ?', [email]) || null;

export const findById = (id) =>
  queryOne('SELECT id, email, created_at FROM admins WHERE id = ?', [id]) || null;

export const verifyPassword = async (candidate, hash) =>
  bcrypt.compare(candidate, hash);
