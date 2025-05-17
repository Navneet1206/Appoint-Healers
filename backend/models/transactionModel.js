import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: false },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: false },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'wallet'], required: true },
  transactionId: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);