import { Router } from 'express';
import * as Token from '../../models/queue/token.js';
import auth from '../../middleware/auth.js';

const router = Router();

router.get('/:campusId', (req, res) => {
  const display = Token.getPublicDisplay(req.params.campusId);
  res.json(display);
});

router.get('/stats/:deptId', auth, (req, res) => {
  const stats = Token.getStats(req.params.deptId);
  res.json(stats);
});

export default router;
