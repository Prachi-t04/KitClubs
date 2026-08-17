import { Recruitment } from "../models/Recruitment.js";
import { Club } from "../models/Club.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Club Head: Create recruitment cycle
export const createRecruitment = asyncHandler(async (req, res) => {
  const { clubId, title, description, startDate, applicationDeadline, questions } = req.body;

  if (!clubId || !title || !applicationDeadline) {
    throw new ApiError(400, "Club, title, and application deadline are required");
  }

  // Check if there is already an Open recruitment cycle for this club
  const existingOpen = await Recruitment.findOne({ club: clubId, status: "Open" });
  if (existingOpen) {
    throw new ApiError(400, "There is already an active Open recruitment cycle for this club. Please close it first.");
  }

  const recruitment = await Recruitment.create({
    club: clubId,
    title,
    description: description || "",
    startDate: startDate || new Date(),
    applicationDeadline,
    status: "Open",
    questions: questions || [
      { questionText: "Why do you want to join this club?", isRequired: true, order: 1 },
      { questionText: "What relevant skills or experience do you possess?", isRequired: true, order: 2 },
    ],
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, recruitment, "Recruitment cycle created successfully"));
});

// Get recruitment cycles for a club
export const getClubRecruitments = asyncHandler(async (req, res) => {
  const { clubId } = req.params;

  const recruitments = await Recruitment.find({ club: clubId })
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, recruitments, "Recruitment cycles fetched"));
});

// Get single recruitment details with questions
export const getRecruitmentDetails = asyncHandler(async (req, res) => {
  const recruitment = await Recruitment.findById(req.params.id)
    .populate("club", "name logo category");

  if (!recruitment) {
    throw new ApiError(404, "Recruitment cycle not found");
  }

  res.status(200).json(new ApiResponse(200, recruitment, "Recruitment details fetched"));
});

// Club Head: Update recruitment status or questions
export const updateRecruitment = asyncHandler(async (req, res) => {
  const { title, description, applicationDeadline, status, questions } = req.body;

  const recruitment = await Recruitment.findById(req.params.id).populate("club");
  if (!recruitment) {
    throw new ApiError(404, "Recruitment cycle not found");
  }

  if (req.user.role !== "admin" && recruitment.club.clubHead.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authorization denied: You do not manage this club");
  }

  if (title) recruitment.title = title;
  if (description !== undefined) recruitment.description = description;
  if (applicationDeadline) recruitment.applicationDeadline = applicationDeadline;
  if (status) recruitment.status = status;
  if (questions) recruitment.questions = questions;

  await recruitment.save();

  res.status(200).json(new ApiResponse(200, recruitment, "Recruitment cycle updated successfully"));
});
