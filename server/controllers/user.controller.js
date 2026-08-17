import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id || req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, branch, year, division, bio, skills, profilePicture } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // PRN and Email are protected and non-editable
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (branch) user.branch = branch;
  if (year) user.year = year;
  if (division) user.division = division;
  if (bio !== undefined) user.bio = bio;
  if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim());
  if (profilePicture !== undefined) user.profilePicture = profilePicture;

  await user.save();

  res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isEmailVerified: true })
    .select("name email prn branch year role")
    .sort({ name: 1 });

  res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

