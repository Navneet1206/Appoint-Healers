import mongoose from "mongoose";

const userTestResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  answers: [{ type: Number }], // Array of selected option indices
  score: { type: Number, required: true },
  resultText: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const UserTestResult = mongoose.model("UserTestResult", userTestResultSchema);
export default UserTestResult;