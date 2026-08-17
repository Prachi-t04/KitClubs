import express from "express";
import { getProfile, updateProfile, getAllUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/profile", protect, getProfile);
router.get("/:id", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;

