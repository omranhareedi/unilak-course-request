import { randomUUID } from 'crypto';
import { queryAll, queryOne, run } from '../../config/db.js';

export const getAll = () => queryAll('SELECT * FROM campuses ORDER BY name');

export const getById = (id) => queryOne('SELECT * FROM campuses WHERE id = ?', [id]) || null;

export const seed = () => {
  const row = queryOne('SELECT COUNT(*) as c FROM campuses');
  if (row && row.c > 0) return;
  const campuses = [
    { name: 'Main Campus — Kigali', code: 'MKG' },
    { name: 'Rwamagana Campus', code: 'RWN' },
    { name: 'Nyanza Campus', code: 'NYN' },
  ];
  for (const c of campuses) {
    run('INSERT INTO campuses (id, name, code) VALUES (?, ?, ?)', [randomUUID(), c.name, c.code]);
  }
};
