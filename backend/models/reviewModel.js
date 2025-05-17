import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now },
  isFake: { type: Boolean, default: false },
  fakeUserName: { type: String },
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;