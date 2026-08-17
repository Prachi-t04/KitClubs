import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answerText: { type: String, required: true },
});

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    recruitment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
      required: true,
    },
    answers: [answerSchema],
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
