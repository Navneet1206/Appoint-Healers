import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: Number, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    mobile: { type: String, required: true },
    languages: [{ type: String }],
    specialists: [{ type: String }],
    rating: { type: Number, default: 0 },
    slots: [
      {
        slotDate: { type: String, required: true },
        slotTime: { type: String, required: true },
        status: {
          type: String,
          enum: ["Active", "Booked", "Cancelled", "Coming Soon"],
          default: "Active",
        },
        sessionType: {
          type: String,
          enum: ["video", "phone", "in-person"],
          default: "video",
        },
        description: { type: String, default: "" },
      },
    ],
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
    },
    date: { type: Number, required: true },
  },
  { minimize: false }
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;
