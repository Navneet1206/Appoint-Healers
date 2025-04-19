import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  answers: { type: Object, required: true },
  suggestedSpecialties: { type: [String], required: true },
  timestamp: { type: Date, default: Date.now },
});

const testResultModel = mongoose.models.TestResult || mongoose.model("TestResult", testResultSchema);
export default testResultModel;