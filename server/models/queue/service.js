import { randomUUID } from 'crypto';
import { queryAll, queryOne, run } from '../../config/db.js';

export const getByDepartment = (deptId) =>
  queryAll('SELECT * FROM services WHERE department_id = ? ORDER BY name', [deptId]);

export const getById = (id) =>
  queryOne('SELECT * FROM services WHERE id = ?', [id]) || null;

export const seed = (deptMap) => {
  const row = queryOne('SELECT COUNT(*) as c FROM services');
  if (row && row.c > 0) return;
  const services = [
    { name: 'Fee Payment', prefix: 'FIN', deptCode: 'FIN', avgMin: 8 },
    { name: 'Scholarship Inquiry', prefix: 'SCH', deptCode: 'FIN', avgMin: 12 },
    { name: 'Enrollment', prefix: 'ENR', deptCode: 'REG', avgMin: 10 },
    { name: 'Transcript Request', prefix: 'TRN', deptCode: 'REG', avgMin: 5 },
    { name: 'Course Registration', prefix: 'CRS', deptCode: 'CIS', avgMin: 7 },
    { name: 'IT Support', prefix: 'ITS', deptCode: 'CIS', avgMin: 15 },
    { name: 'Admission Query', prefix: 'ADM', deptCode: 'BUS', avgMin: 8 },
    { name: 'Legal Advice', prefix: 'LGL', deptCode: 'LAW', avgMin: 10 },
  ];
  for (const s of services) {
    const did = deptMap[s.deptCode];
    if (did) {
      run('INSERT INTO services (id, department_id, name, prefix, avg_duration_min) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), did, s.name, s.prefix, s.avgMin]);
    }
  }
};
