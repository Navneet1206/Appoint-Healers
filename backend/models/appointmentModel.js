import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookedAt: { type: Date, default: Date.now },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  duration: { type: Number, default: 45 },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  originalAmount: { type: Number, required: true },
  discountedAmount: { type: Number, default: null },
  couponCode: { type: String, default: null },
  sessionType: { type: String, required: true },
  status: {
    type: String,
    enum: ["paymentpending", "Booked", "Cancelled", "Failed"],
    default: "paymentpending"
  },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  paymentToDoctor: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  cancelReason: { type: String, default: null },
  cancelledBy: { 
    type: String, 
    enum: ["user", "doctor", "admin"], 
    default: null 
  }
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);
export default appointmentModel;