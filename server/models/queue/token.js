import { randomUUID } from 'crypto';
import { queryAll, queryOne, run } from '../../config/db.js';

const mapRow = (row) => row ? {
  _id: row.id,
  fullToken: row.full_token,
  servicePrefix: row.service_prefix,
  tokenNum: row.token_num,
  studentReg: row.student_reg,
  studentPhone: row.student_phone,
  studentName: row.student_name,
  campusId: row.campus_id,
  departmentId: row.department_id,
  serviceId: row.service_id,
  status: row.status,
  priority: row.priority,
  calledAt: row.called_at,
  servedAt: row.served_at,
  completedAt: row.completed_at,
  transferredToDept: row.transferred_to_dept,
  transferredToService: row.transferred_to_service,
  staffId: row.staff_id,
  createdAt: row.created_at,
} : null;

const BASE = `SELECT t.*, d.name as department_name, s.name as service_name, c.name as campus_name
  FROM tokens t
  LEFT JOIN departments d ON d.id = t.department_id
  LEFT JOIN services s ON s.id = t.service_id
  LEFT JOIN campuses c ON c.id = t.campus_id`;

export const getNextTokenNum = (prefix) => {
  const today = new Date().toISOString().slice(0, 10);
  const row = queryOne(
    'SELECT counter FROM daily_counters WHERE service_prefix = ? AND date = ?',
    [prefix, today]
  );
  const next = row ? row.counter + 1 : 1;
  if (row) {
    run('UPDATE daily_counters SET counter = ? WHERE service_prefix = ? AND date = ?',
      [next, prefix, today]);
  } else {
    run('INSERT INTO daily_counters (service_prefix, date, counter) VALUES (?, ?, ?)',
      [prefix, today, next]);
  }
  return next;
};

export const create = ({ studentReg, studentPhone, studentName, campusId, departmentId, serviceId, prefix }) => {
  const num = getNextTokenNum(prefix);
  const fullToken = `${prefix}-${String(num).padStart(3, '0')}`;
  const id = randomUUID();
  run(`INSERT INTO tokens (id, full_token, service_prefix, token_num, student_reg, student_phone,
    student_name, campus_id, department_id, service_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting')`,
    [id, fullToken, prefix, num, studentReg, studentPhone || '', studentName || '',
     campusId, departmentId, serviceId]);
  return getById(id);
};

export const getById = (id) => mapRow(queryOne(`${BASE} WHERE t.id = ?`, [id]));

export const getQueue = (departmentId, statuses = ['waiting']) => {
  const placeholders = statuses.map(() => '?').join(',');
  return queryAll(
    `${BASE} WHERE t.department_id = ? AND t.status IN (${placeholders}) ORDER BY t.priority DESC, t.token_num ASC`,
    [departmentId, ...statuses]
  ).map(mapRow);
};

export const getCurrentServing = (departmentId) =>
  mapRow(queryOne(`${BASE} WHERE t.department_id = ? AND t.status = 'serving'`, [departmentId]));

export const getQueuePosition = (tokenId) => {
  const token = getById(tokenId);
  if (!token) return -1;
  const ahead = queryOne(
    `SELECT COUNT(*) as c FROM tokens WHERE department_id = ? AND status IN ('waiting')
     AND (priority > ? OR (priority = ? AND token_num < ?))`,
    [token.departmentId, token.priority, token.priority, token.tokenNum]
  );
  return ahead ? ahead.c : 0;
};

export const getEstimatedWait = (departmentId, serviceId) => {
  const waiting = queryAll(
    `SELECT t.* FROM tokens t WHERE t.department_id = ? AND t.service_id = ? AND t.status = 'waiting' ORDER BY t.token_num ASC`,
    [departmentId, serviceId]
  );
  if (waiting.length === 0) return 0;
  const svc = queryOne('SELECT avg_duration_min FROM services WHERE id = ?', [serviceId]);
  const avgMin = svc ? svc.avg_duration_min : 5;
  return waiting.length * avgMin;
};

export const updateStatus = (id, status, staffId = null) => {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  let extra = '';
  if (status === 'called') extra = ', called_at = ?';
  else if (status === 'serving') extra = ', served_at = ?';
  else if (['completed', 'skipped', 'no_show'].includes(status)) extra = ', completed_at = ?';

  const sql = `UPDATE tokens SET status = ?, staff_id = ?${extra} WHERE id = ?`;
  const params = [status, staffId];
  if (['called', 'serving', 'completed', 'skipped', 'no_show'].includes(status)) params.push(now);
  params.push(id);
  run(sql, params);
  return getById(id);
};

export const transfer = (id, targetDeptId, targetServiceId) => {
  const token = getById(id);
  if (!token) return null;
  const prefix = queryOne('SELECT prefix FROM services WHERE id = ?', [targetServiceId]);
  const num = getNextTokenNum(prefix ? prefix.prefix : 'TFR');
  const fullToken = `${prefix ? prefix.prefix : 'TFR'}-${String(num).padStart(3, '0')}`;

  run(`UPDATE tokens SET status = 'transferred', transferred_to_dept = ?, transferred_to_service = ?,
    completed_at = datetime('now') WHERE id = ?`, [targetDeptId, targetServiceId, id]);

  const newId = randomUUID();
  run(`INSERT INTO tokens (id, full_token, service_prefix, token_num, student_reg, student_phone,
    student_name, campus_id, department_id, service_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting')`,
    [newId, fullToken, prefix ? prefix.prefix : 'TFR', num,
     token.studentReg, token.studentPhone, token.studentName,
     token.campusId, targetDeptId, targetServiceId]);

  return getById(newId);
};

export const getPublicDisplay = (campusId) => {
  const depts = queryAll('SELECT id, name, code FROM departments WHERE campus_id = ?', [campusId]);
  const result = [];
  for (const d of depts) {
    const current = queryOne(`${BASE} WHERE t.department_id = ? AND t.status IN ('called', 'serving') ORDER BY t.called_at DESC LIMIT 5`,
      [d.id]);
    const waiting = queryOne(
      `SELECT COUNT(*) as c FROM tokens WHERE department_id = ? AND status = 'waiting'`,
      [d.id]
    );
    result.push({
      department: d.name,
      code: d.code,
      current: current ? mapRow(current) : null,
      waitingCount: waiting ? waiting.c : 0,
    });
  }
  return result;
};

export const findByReg = (reg) =>
  queryAll(`SELECT t.*, d.name as department_name, s.name as service_name, c.name as campus_name
    FROM tokens t
    LEFT JOIN departments d ON d.id = t.department_id
    LEFT JOIN services s ON s.id = t.service_id
    LEFT JOIN campuses c ON c.id = t.campus_id
    WHERE t.student_reg = ? ORDER BY t.created_at DESC LIMIT 10`, [reg]).map(mapRow);

export const getStats = (departmentId, date) => {
  const day = date || new Date().toISOString().slice(0, 10);
  const total = queryOne(
    "SELECT COUNT(*) as c FROM tokens WHERE department_id = ? AND date(created_at) = ?",
    [departmentId, day]
  );
  const served = queryOne(
    "SELECT COUNT(*) as c FROM tokens WHERE department_id = ? AND date(created_at) = ? AND status = 'completed'",
    [departmentId, day]
  );
  const avgTime = queryOne(
    `SELECT AVG(strftime('%s', completed_at) - strftime('%s', served_at)) as avg_sec
     FROM tokens WHERE department_id = ? AND date(created_at) = ? AND status = 'completed' AND served_at IS NOT NULL`,
    [departmentId, day]
  );
  return {
    total: total ? total.c : 0,
    served: served ? served.c : 0,
    avgServiceSec: avgTime ? Math.round(avgTime.avg_sec) : 0,
  };
};
