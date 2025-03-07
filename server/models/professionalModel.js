import mongoose from 'mongoose';

const professionalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one professional profile per user
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  },
  bio: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Ensure unique licenseNumber
professionalSchema.index({ licenseNumber: 1 }, { unique: true });

const Professional = mongoose.model('Professional', professionalSchema);

export default Professional;