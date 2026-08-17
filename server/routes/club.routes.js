import express from "express";
import {
  createClub,
  listClubs,
  getClubDetails,
  updateClubProfile,
  assignClubHead,
  softDeleteClub,
  restoreClub,
  getAllClubsAdmin,
} from "../controllers/club.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { verifyClubHeadOwnership } from "../middleware/ownership.js";

const router = express.Router();

// Public routes
router.get("/", listClubs);
router.get("/:id", getClubDetails);

// Admin routes
router.get("/admin/all", protect, authorize("admin"), getAllClubsAdmin);
router.post("/", protect, authorize("admin"), createClub);
router.put("/:id/head", protect, authorize("admin"), assignClubHead);
router.delete("/:id", protect, authorize("admin"), softDeleteClub);
router.put("/:id/restore", protect, authorize("admin"), restoreClub);

// Club Head route
router.put("/:id", protect, authorize("clubHead", "admin"), verifyClubHeadOwnership, updateClubProfile);

export default router;
