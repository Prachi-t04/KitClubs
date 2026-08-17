import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized to access this route");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "kit_club_portal_jwt_secret_key_2026_super_secure");
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(401, "Account deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});
