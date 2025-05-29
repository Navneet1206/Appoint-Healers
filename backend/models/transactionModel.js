import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Can be negative for refunds
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "wallet", "razorpay", "refund", "razorpay_payout"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["payment", "refund", "payout"],
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;