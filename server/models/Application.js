import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Application', applicationSchema);
