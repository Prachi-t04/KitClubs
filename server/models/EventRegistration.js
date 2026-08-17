import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Enforce unique registration per student per event
eventRegistrationSchema.index({ student: 1, event: 1 }, { unique: true });

export const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
