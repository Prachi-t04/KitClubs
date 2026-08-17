import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { ApiError } from "./utils/ApiError.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import clubRoutes from "./routes/club.routes.js";
import recruitmentRoutes from "./routes/recruitment.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import eventRoutes from "./routes/event.routes.js";
import eventRegistrationRoutes from "./routes/eventRegistration.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminSeedRoutes from "./routes/adminSeed.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "KIT Club Portal Backend is healthy" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminSeedRoutes);
app.use("/api/upload", uploadRoutes);


// 404 Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 KIT Club Portal Server running on port ${PORT}`);
});

export default app;
