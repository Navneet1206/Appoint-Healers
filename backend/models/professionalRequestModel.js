import mongoose from "mongoose";

const professionalRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  fees: { type: Number, required: true },
  address: { type: Object, required: true },
  languages: { type: [String], required: true },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const professionalRequestModel = mongoose.models.professionalRequest || mongoose.model("professionalRequest", professionalRequestSchema);
export default professionalRequestModel;