import express from "express";
import {
  submitApplication,
  getMyApplications,
  getClubApplications,
  reviewApplication,
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { verifyClubHeadOwnership } from "../middleware/ownership.js";

const router = express.Router();

router.post("/", protect, submitApplication);
router.get("/my", protect, getMyApplications);
router.get("/club/:clubId", protect, authorize("clubHead", "admin"), verifyClubHeadOwnership, getClubApplications);
router.put("/:id/review", protect, authorize("clubHead", "admin"), reviewApplication);

export default router;
