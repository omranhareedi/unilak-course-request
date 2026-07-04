import { randomUUID } from 'crypto';
import { queryAll, queryOne, run } from '../../config/db.js';

export const getByCampus = (campusId) =>
  queryAll('SELECT * FROM departments WHERE campus_id = ? ORDER BY name', [campusId]);

export const getById = (id) =>
  queryOne('SELECT * FROM departments WHERE id = ?', [id]) || null;

export const seed = (campusMap) => {
  const row = queryOne('SELECT COUNT(*) as c FROM departments');
  if (row && row.c > 0) return;
  const depts = [
    { name: 'Finance', code: 'FIN', campus: 'MKG' },
    { name: 'Registrar', code: 'REG', campus: 'MKG' },
    { name: 'Computing & IT', code: 'CIS', campus: 'MKG' },
    { name: 'Business Studies', code: 'BUS', campus: 'MKG' },
    { name: 'Law', code: 'LAW', campus: 'MKG' },
    { name: 'Finance', code: 'FIN', campus: 'RWN' },
    { name: 'Registrar', code: 'REG', campus: 'RWN' },
    { name: 'Computing & IT', code: 'CIS', campus: 'RWN' },
    { name: 'Finance', code: 'FIN', campus: 'NYN' },
    { name: 'Registrar', code: 'REG', campus: 'NYN' },
  ];
  for (const d of depts) {
    const cid = campusMap[d.campus];
    if (cid) {
      run('INSERT INTO departments (id, campus_id, name, code) VALUES (?, ?, ?, ?)',
        [randomUUID(), cid, d.name, d.code]);
    }
  }
};
