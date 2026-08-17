import express from "express";
import {
  registerForEvent,
  getEventRegistrations,
  getMyEventRegistrations,
} from "../controllers/eventRegistration.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

router.post("/:eventId", protect, registerForEvent);
router.get("/my", protect, getMyEventRegistrations);
router.get("/event/:eventId", protect, authorize("clubHead", "admin"), getEventRegistrations);

export default router;
