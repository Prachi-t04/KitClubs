import { Club } from "../models/Club.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyClubHeadOwnership = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") {
    return next(); // Admin has full access
  }

  if (req.user.role !== "clubHead") {
    throw new ApiError(403, "Only Club Heads can perform this action");
  }

  // Get clubId from params or body
  const clubId = req.params.clubId || req.params.id || req.body.clubId || req.body.club;

  if (!clubId) {
    throw new ApiError(400, "Club ID is required for authorization");
  }

  const club = await Club.findById(clubId);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  if (club.clubHead.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authorization denied: You are not the Club Head of this club");
  }

  req.club = club;
  next();
});
