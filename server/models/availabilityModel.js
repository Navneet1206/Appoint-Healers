import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Professional',
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6, // 0 = Sunday, 6 = Saturday
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Validate that startTime is before endTime
availabilitySchema.pre('save', function (next) {
  if (this.startTime >= this.endTime) {
    throw new Error('Start time must be before end time');
  }
  next();
});

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;