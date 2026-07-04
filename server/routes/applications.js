import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as App from '../models/Application.js';
import { sendAcceptanceEmail, sendRejectionEmail, sendNewApplicationNotification } from '../utils/emailService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { registrationNumber, email, fullName, department, message } = req.body;

    if (!registrationNumber || !email || !fullName || !department || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = App.findPendingOrAcceptedByReg(registrationNumber);
    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ error: 'You already have an accepted application' });
      }
      return res.status(400).json({ error: 'You already have a pending application. Please wait for a response.' });
    }

    const application = App.createApplication({
      registrationNumber, email, fullName, department, message,
    });

    try {
      await sendNewApplicationNotification(process.env.ADMIN_EMAIL, application);
    } catch {
      // notification email is optional
    }

    res.status(201).json({
      message: 'Application submitted successfully. You will receive an email once it is reviewed.',
      id: application.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', (req, res) => {
  try {
    const { reg } = req.query;
    if (!reg) return res.status(400).json({ error: 'Registration number is required' });

    const applications = App.findByReg(reg);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', auth, (req, res) => {
  try {
    const { status } = req.query;
    const applications = App.findAll(status);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/review', auth, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "accepted" or "rejected"' });
    }

    const application = App.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (application.status !== 'pending') {
      return res.status(400).json({ error: `Application already ${application.status}` });
    }

    const updated = App.updateStatus(req.params.id, status, adminNote);

    try {
      if (status === 'accepted') {
        await sendAcceptanceEmail(updated.email, updated.fullName, updated.department);
      } else {
        await sendRejectionEmail(updated.email, updated.fullName, updated.department, adminNote);
      }
    } catch {
      console.log('Email notification failed (check EMAIL config in .env)');
    }

    res.json({ message: `Application ${status}`, application: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
