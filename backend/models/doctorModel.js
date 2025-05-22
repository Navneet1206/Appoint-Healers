import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  duration: { type: Number, default: 45 },
  status: {
    type: String,
    enum: ["Active", "Reserved", "Booked", "paymentpending", "CancelledByUser", "CancelledByDoctor"],
    default: "Active"
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  speciality: { type: String, required: true },
  specialityList: { type: [String], required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  slots: [slotSchema],
  address: { type: Object, required: true },
  languages: { type: [String], required: true },
  date: { type: Number, required: true },
  bannerImage: { type: String },
  paymentDetails: {
    bankAccount: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },
    upiId: String,
  }
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;