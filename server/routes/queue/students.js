import { Router } from 'express';
import * as Campus from '../../models/queue/campus.js';
import * as Department from '../../models/queue/department.js';
import * as Service from '../../models/queue/service.js';
import * as Token from '../../models/queue/token.js';

const router = Router();

router.get('/campuses', (_, res) => res.json(Campus.getAll()));

router.get('/departments/:campusId', (req, res) =>
  res.json(Department.getByCampus(req.params.campusId)));

router.get('/services/:deptId', (req, res) =>
  res.json(Service.getByDepartment(req.params.deptId)));

router.post('/join', (req, res) => {
  try {
    const { studentReg, studentPhone, studentName, campusId, departmentId, serviceId } = req.body;
    if (!studentReg || !campusId || !departmentId || !serviceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const active = Token.getQueue(departmentId, ['waiting', 'called', 'serving']);
    const existing = active.find(t => t.studentReg === studentReg);
    if (existing) {
      return res.status(400).json({
        error: `You already have an active token: ${existing.fullToken} (${existing.status})`,
      });
    }

    const svc = Service.getById(serviceId);
    if (!svc) return res.status(400).json({ error: 'Invalid service' });

    const token = Token.create({ studentReg, studentPhone, studentName, campusId, departmentId, serviceId, prefix: svc.prefix });
    const position = Token.getQueuePosition(token._id);
    const wait = Token.getEstimatedWait(departmentId, serviceId);

    res.status(201).json({ token, position, estimatedWaitMin: wait });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/token/:id', (req, res) => {
  const token = Token.getById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  const position = Token.getQueuePosition(token._id);
  const wait = Token.getEstimatedWait(token.departmentId, token.serviceId);
  res.json({ token, position, estimatedWaitMin: wait });
});

router.get('/status', (req, res) => {
  const { reg } = req.query;
  if (!reg) return res.status(400).json({ error: 'Registration number required' });
  const tokens = Token.findByReg(reg);
  res.json(tokens);
});

export default router;
