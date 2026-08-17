import express from "express";
import { seedDatabase } from "../controllers/adminSeed.controller.js";

const router = express.Router();

router.post("/seed", seedDatabase);

export default router;
