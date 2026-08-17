import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "APPLICATION_ACCEPTED",
        "APPLICATION_REJECTED",
        "EVENT_REGISTERED",
        "EVENT_CANCELLED",
        "NEW_APPLICATION",
        "NEW_EVENT_REGISTRATION",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
