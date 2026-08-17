import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
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
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Removed"],
      default: "Active",
    },
    removedAt: Date,
    removedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    removalReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Membership = mongoose.model("Membership", membershipSchema);
