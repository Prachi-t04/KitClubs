import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  isRequired: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const recruitmentSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Recruitment title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    status: {
      type: String,
      enum: ["Draft", "Open", "Closed", "Under Review", "Completed"],
      default: "Open",
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Recruitment = mongoose.model("Recruitment", recruitmentSchema);
