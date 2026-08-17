import { Notification } from "../models/Notification.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Fetch user's notifications
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("relatedClub", "name logo")
    .populate("relatedEvent", "name date venue")
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched")
  );
});

// Mark single notification as read
export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
});

// Mark all notifications as read
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json(new ApiResponse(200, null, "All notifications marked as read"));
});
