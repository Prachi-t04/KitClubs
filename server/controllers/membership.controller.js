import { Membership } from "../models/Membership.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Student: Get my active club memberships
export const getMyMemberships = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({
    student: req.user._id,
    status: "Active",
  })
    .populate("club", "name logo category shortDescription facultyCoordinator contactEmail")
    .sort({ joinedAt: -1 });

  res.status(200).json(new ApiResponse(200, memberships, "My memberships fetched"));
});

// Club Head: Get member list for a club
export const getClubMembers = asyncHandler(async (req, res) => {
  const { clubId } = req.params;

  const members = await Membership.find({ club: clubId })
    .populate("student", "name prn email phone branch year division profilePicture bio skills")
    .sort({ joinedAt: -1 });

  res.status(200).json(new ApiResponse(200, members, "Club members fetched"));
});

// Club Head: Remove member (soft delete membership)
export const removeMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { removalReason } = req.body;

  const membership = await Membership.findById(id).populate("club");
  if (!membership) {
    throw new ApiError(404, "Membership record not found");
  }

  if (req.user.role !== "admin" && membership.club.clubHead.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authorization denied: You do not manage this club's membership");
  }

  membership.status = "Removed";
  membership.removedAt = new Date();
  membership.removedBy = req.user._id;
  membership.removalReason = removalReason || "Removed by Club Head";

  await membership.save();

  res.status(200).json(new ApiResponse(200, membership, "Member removed from club successfully"));
});
