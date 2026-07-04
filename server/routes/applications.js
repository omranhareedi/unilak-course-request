import { Router } from 'express';
import Application from '../models/Application.js';
import auth from '../middleware/auth.js';
import { sendAcceptanceEmail, sendRejectionEmail, sendNewApplicationNotification } from '../utils/emailService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { registrationNumber, email, fullName, department, message } = req.body;

    if (!registrationNumber || !email || !fullName || !department || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await Application.findOne({
      registrationNumber,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ error: 'You already have an accepted application' });
      }
      return res.status(400).json({ error: 'You already have a pending application. Please wait for a response.' });
    }

    const application = await Application.create({
      registrationNumber, email, fullName, department, message,
    });

    try {
      await sendNewApplicationNotification(process.env.ADMIN_EMAIL, application);
    } catch {
      // notification email is optional
    }

    res.status(201).json({
      message: 'Application submitted successfully. You will receive an email once it is reviewed.',
      id: application._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', async (req, res) => {
  try {
    const { reg } = req.query;
    if (!reg) return res.status(400).json({ error: 'Registration number is required' });

    const applications = await Application.find({ registrationNumber: reg })
      .select('fullName department message status createdAt adminNote')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const applications = await Application.find(filter).sort({ createdAt: -1 });
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

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (application.status !== 'pending') {
      return res.status(400).json({ error: `Application already ${application.status}` });
    }

    application.status = status;
    if (adminNote) application.adminNote = adminNote;
    await application.save();

    if (status === 'accepted') {
      await sendAcceptanceEmail(application.email, application.fullName, application.department);
    } else {
      await sendRejectionEmail(application.email, application.fullName, application.department, adminNote);
    }

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
