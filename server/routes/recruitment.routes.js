import express from "express";
import {
  createRecruitment,
  getClubRecruitments,
  getRecruitmentDetails,
  updateRecruitment,
} from "../controllers/recruitment.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { verifyClubHeadOwnership } from "../middleware/ownership.js";

const router = express.Router();

router.get("/club/:clubId", getClubRecruitments);
router.get("/:id", getRecruitmentDetails);

// Club Head routes
router.post("/", protect, authorize("clubHead", "admin"), verifyClubHeadOwnership, createRecruitment);
router.put("/:id", protect, authorize("clubHead", "admin"), updateRecruitment);

export default router;
