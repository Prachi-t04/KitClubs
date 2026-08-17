import express from "express";
import {
  getMyMemberships,
  getClubMembers,
  removeMember,
} from "../controllers/membership.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { verifyClubHeadOwnership } from "../middleware/ownership.js";

const router = express.Router();

router.get("/my", protect, getMyMemberships);
router.get("/club/:clubId", protect, authorize("clubHead", "admin"), verifyClubHeadOwnership, getClubMembers);
router.delete("/:id", protect, authorize("clubHead", "admin"), removeMember);

export default router;
