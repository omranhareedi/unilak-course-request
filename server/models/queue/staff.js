import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { queryAll, queryOne, run } from '../../config/db.js';

export const create = async ({ name, email, password, departmentId }) => {
  const id = randomUUID();
  const hashed = await bcrypt.hash(password, 12);
  run('INSERT INTO staff (id, name, email, password, department_id) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, hashed, departmentId]);
  return { id, name, email };
};

export const findByEmail = (email) =>
  queryOne('SELECT * FROM staff WHERE email = ?', [email]) || null;

export const findById = (id) =>
  queryOne('SELECT id, name, email, department_id FROM staff WHERE id = ?', [id]) || null;

export const getByDepartment = (deptId) =>
  queryAll('SELECT id, name, email FROM staff WHERE department_id = ?', [deptId]);

export const verifyPassword = async (candidate, hash) => bcrypt.compare(candidate, hash);

export const seed = async (deptMap) => {
  const row = queryOne('SELECT COUNT(*) as c FROM staff');
  if (row && row.c > 0) return;
  const agents = [
    { name: 'Alice Staff', email: 'alice@unilak.ac.rw', password: 'staff123', deptCode: 'FIN' },
    { name: 'Bob Staff', email: 'bob@unilak.ac.rw', password: 'staff123', deptCode: 'REG' },
    { name: 'Carol Staff', email: 'carol@unilak.ac.rw', password: 'staff123', deptCode: 'CIS' },
    { name: 'Dave Staff', email: 'dave@unilak.ac.rw', password: 'staff123', deptCode: 'BUS' },
  ];
  for (const a of agents) {
    const did = deptMap[a.deptCode];
    if (did) {
      const hashed = await bcrypt.hash(a.password, 12);
      run('INSERT INTO staff (id, name, email, password, department_id) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), a.name, a.email, hashed, did]);
    }
  }
};
