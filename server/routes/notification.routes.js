import express from "express";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.put("/read-all", protect, markAllNotificationsRead);
router.put("/:id/read", protect, markNotificationRead);

export default router;
