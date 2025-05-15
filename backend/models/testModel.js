import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          points: { type: Number, required: true },
        },
      ],
    },
  ],
  resultRanges: [
    {
      minScore: { type: Number, required: true },
      maxScore: { type: Number, required: true },
      resultText: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Test = mongoose.model("Test", testSchema);
export default Test;