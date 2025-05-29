import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  originalAmount: { type: Number, required: true },
  discountedAmount: { type: Number, default: null },
  couponCode: { type: String, default: null },
  slotId: { type: String, required: true },
  sessionType: { type: String, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  paymentToDoctor: { type: Boolean, default: false },
  meetingLink: { type: String },
  meetingPassword: { type: String },
  cancelledBy: { type: String, enum: ["user", "doctor", "admin"], default: null },
  refundIssued: { type: Boolean, default: false },
  updatedByDoctor: { type: Boolean, default: false },
  awaitingUserConsent: { type: Boolean, default: false },
  userConsent: { type: Boolean, default: null },
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);
export default appointmentModel;