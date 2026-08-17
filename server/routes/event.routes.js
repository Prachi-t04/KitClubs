import express from "express";
import {
  createEvent,
  editEvent,
  cancelEvent,
  listUpcomingEvents,
  getClubEvents,
  getEventDetails,
} from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { verifyClubHeadOwnership } from "../middleware/ownership.js";

const router = express.Router();

// Public routes
router.get("/upcoming", listUpcomingEvents);
router.get("/club/:clubId", getClubEvents);
router.get("/:id", getEventDetails);

// Club Head routes
router.post("/", protect, authorize("clubHead", "admin"), verifyClubHeadOwnership, createEvent);
router.put("/:id", protect, authorize("clubHead", "admin"), editEvent);
router.put("/:id/cancel", protect, authorize("clubHead", "admin"), cancelEvent);

export default router;
