import { Router } from 'express';
import jwt from 'jsonwebtoken';
import * as App from '../models/Application.js';
import studentAuth from '../middleware/studentAuth.js';

const router = Router();

router.post('/login', (req, res) => {
  try {
    const { registrationNumber, email } = req.body;
    if (!registrationNumber || !email) {
      return res.status(400).json({ error: 'Registration number and email are required' });
    }

    const applications = App.findByReg(registrationNumber);
    const match = applications.find((a) => a.email === email);
    if (!match) {
      return res.status(401).json({ error: 'No match found for this registration number and email' });
    }

    const token = jwt.sign(
      { registrationNumber, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, student: { registrationNumber, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/applications', studentAuth, (req, res) => {
  try {
    const applications = App.findByReg(req.student.registrationNumber);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/applications/:id/cancel', studentAuth, (req, res) => {
  try {
    const application = App.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    if (application.registrationNumber !== req.student.registrationNumber) {
      return res.status(403).json({ error: 'This application does not belong to you' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: `Cannot cancel an application that is ${application.status}` });
    }

    const updated = App.updateStatus(req.params.id, 'cancelled');
    res.json({ message: 'Application cancelled', application: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
