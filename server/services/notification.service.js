import { Notification } from "../models/Notification.js";

export const createNotification = async ({ recipient, type, message, relatedClub, relatedEvent, relatedApplication }) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      message,
      relatedClub,
      relatedEvent,
      relatedApplication,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
