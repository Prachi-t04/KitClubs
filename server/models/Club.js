import mongoose from "mongoose";

const coreMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
});

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technical", "Cultural", "Sports", "Social", "Entrepreneurship", "Literary", "Arts", "Other"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: 250,
    },
    detailedDescription: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    clubHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Club Head is required"],
    },
    facultyCoordinator: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
    activities: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    eventGallery: { type: [String], default: [] },
    coreMembers: [coreMemberSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
    removedAt: Date,
    removedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Club = mongoose.model("Club", clubSchema);
