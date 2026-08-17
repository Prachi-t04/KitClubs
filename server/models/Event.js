import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    banner: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },
    eventType: {
      type: String,
      default: "Workshop",
    },
    eligibility: {
      type: String,
      enum: ["All KIT Students", "Club Members Only"],
      default: "All KIT Students",
    },
    capacity: {
      type: String,
      enum: ["Unlimited", "Limited"],
      default: "Unlimited",
    },
    maxParticipants: {
      type: Number,
      default: 0,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
