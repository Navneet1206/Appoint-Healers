import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Professional',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that startTime is before endTime
appointmentSchema.pre('save', function (next) {
  if (this.startTime >= this.endTime) {
    throw new Error('Start time must be before end time');
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;