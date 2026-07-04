import { Router } from 'express';
import jwt from 'jsonwebtoken';
import * as Staff from '../../models/queue/staff.js';
import * as Token from '../../models/queue/token.js';
import staffAuth from '../../middleware/staffAuth.js';
import { broadcast } from '../../utils/broadcast.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const staff = Staff.findByEmail(email);
    if (!staff || !(await Staff.verifyPassword(password, staff.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: staff.id, departmentId: staff.department_id },
      process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      staff: { id: staff.id, name: staff.name, email: staff.email, departmentId: staff.department_id },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/queue', staffAuth, (req, res) => {
  const waiting = Token.getQueue(req.staff.departmentId, ['waiting']);
  const serving = Token.getCurrentServing(req.staff.departmentId);
  res.json({ waiting, serving });
});

router.post('/call-next', staffAuth, (req, res) => {
  const waiting = Token.getQueue(req.staff.departmentId, ['waiting']);
  if (waiting.length === 0) return res.status(400).json({ error: 'No students in queue' });

  const next = waiting[0];
  // mark any previous 'called' tokens back to 'waiting' (recall scenario handled separately)
  const called = Token.getQueue(req.staff.departmentId, ['called']);
  for (const c of called) Token.updateStatus(c._id, 'waiting');
  // mark any 'serving' as completed
  const serving = Token.getCurrentServing(req.staff.departmentId);
  if (serving) Token.updateStatus(serving._id, 'completed', req.staff.id);

  const updated = Token.updateStatus(next._id, 'called', req.staff.id);
  broadcast(req.staff.departmentId, updated.campusId);
  res.json(updated);
});

router.post('/:id/start-serving', staffAuth, (req, res) => {
  const token = Token.getById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  const updated = Token.updateStatus(token._id, 'serving', req.staff.id);
  broadcast(req.staff.departmentId, updated.campusId);
  res.json(updated);
});

router.post('/:id/complete', staffAuth, (req, res) => {
  const token = Token.getById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  const updated = Token.updateStatus(token._id, 'completed', req.staff.id);
  broadcast(req.staff.departmentId, updated.campusId);
  res.json(updated);
});

router.post('/:id/skip', staffAuth, (req, res) => {
  const token = Token.getById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  const updated = Token.updateStatus(token._id, 'skipped', req.staff.id);
  broadcast(req.staff.departmentId, updated.campusId);
  res.json(updated);
});

router.post('/:id/no-show', staffAuth, (req, res) => {
  const token = Token.getById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  const updated = Token.updateStatus(token._id, 'no_show', req.staff.id);
  broadcast(req.staff.departmentId, updated.campusId);
  res.json(updated);
});

router.post('/:id/recall', staffAuth, (req, res) => {
  const token = Token.getById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  const updated = Token.updateStatus(token._id, 'called', req.staff.id);
  broadcast(req.staff.departmentId, updated.campusId);
  res.json(updated);
});

router.post('/:id/transfer', staffAuth, (req, res) => {
  try {
    const { targetDeptId, targetServiceId } = req.body;
    if (!targetDeptId || !targetServiceId) {
      return res.status(400).json({ error: 'Target department and service required' });
    }
    const newToken = Token.transfer(req.params.id, targetDeptId, targetServiceId);
    if (!newToken) return res.status(404).json({ error: 'Token not found' });
    broadcast(req.staff.departmentId, null);
    res.json({ message: 'Transferred', newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
