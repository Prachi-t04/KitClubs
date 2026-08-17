import express from "express";
import { uploadSingleImage, uploadMultipleImages } from "../controllers/upload.controller.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, uploadMiddleware.single("image"), uploadSingleImage);
router.post("/multiple", protect, uploadMiddleware.array("images", 10), uploadMultipleImages);

export default router;
