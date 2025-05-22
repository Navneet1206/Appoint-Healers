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
  }, // Made optional by removing required: true
  originalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    default: "razorpay",
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["payment", "payout"],
    required: true,
  },
  couponCode: {
    type: String,
    default: null,
  },
  walletUsed: {
    type: Number,
    default: 0,
  },
  meta: {
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    location: { type: String, default: null },
    gatewayResponse: { type: Object, default: {} },
  },
  retries: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  slotId: { // Added to temporarily store slot info
    type: mongoose.Schema.Types.ObjectId,
  },
  slotDate: { // Added to temporarily store slot info
    type: String,
  },
  slotTime: { // Added to temporarily store slot info
    type: String,
  },
  sessionType: { // Added to temporarily store session type
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;