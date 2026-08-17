import { Application } from "../models/Application.js";
import { Recruitment } from "../models/Recruitment.js";
import { Membership } from "../models/Membership.js";
import { Club } from "../models/Club.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notification.service.js";

// Student: Submit application to a club
export const submitApplication = asyncHandler(async (req, res) => {
  const { recruitmentId, answers } = req.body;
  const studentId = req.user._id;

  if (!recruitmentId || !answers || !Array.isArray(answers)) {
    throw new ApiError(400, "Recruitment ID and answers are required");
  }

  const recruitment = await Recruitment.findById(recruitmentId).populate("club");
  if (!recruitment) {
    throw new ApiError(404, "Recruitment cycle not found");
  }

  if (recruitment.status !== "Open" || new Date(recruitment.applicationDeadline) < new Date()) {
    throw new ApiError(400, "This recruitment cycle is closed or past its deadline");
  }

  const clubId = recruitment.club._id;

  // Business Rule 26: Check if already an active member of this club
  const existingMembership = await Membership.findOne({
    student: studentId,
    club: clubId,
    status: "Active",
  });

  if (existingMembership) {
    throw new ApiError(400, "You are already an active member of this club");
  }

  // Business Rule 26: Check if already applied for this recruitment cycle
  const existingApplication = await Application.findOne({
    student: studentId,
    recruitment: recruitmentId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already submitted an application for this recruitment cycle");
  }

  const application = await Application.create({
    student: studentId,
    club: clubId,
    recruitment: recruitmentId,
    answers,
    status: "Pending",
    submittedAt: new Date(),
  });

  // Notify Club Head about new application
  const club = recruitment.club;
  if (club && club.clubHead) {
    await createNotification({
      recipient: club.clubHead,
      type: "NEW_APPLICATION",
      message: `New application received from ${req.user.name} for ${club.name}`,
      relatedClub: club._id,
      relatedApplication: application._id,
    });
  }

  res.status(201).json(new ApiResponse(201, application, "Application submitted successfully!"));
});

// Student: Get own applications
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate("club", "name logo category shortDescription")
    .populate("recruitment", "title applicationDeadline status")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, applications, "My applications fetched"));
});

// Club Head: Get applications for their club
export const getClubApplications = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { status, recruitmentId } = req.query;

  const filter = { club: clubId };
  if (status) filter.status = status;
  if (recruitmentId) filter.recruitment = recruitmentId;

  const applications = await Application.find(filter)
    .populate("student", "name prn email phone branch year division profilePicture bio skills")
    .populate("recruitment", "title")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, applications, "Club applications fetched"));
});

// Club Head: Accept or Reject an application
export const reviewApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Accepted' or 'Rejected'

  if (!["Accepted", "Rejected"].includes(status)) {
    throw new ApiError(400, "Status must be 'Accepted' or 'Rejected'");
  }

  const application = await Application.findById(id).populate("club student");
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (req.user.role !== "admin" && application.club.clubHead.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authorization denied: You are not authorized to review applications for this club");
  }

  application.status = status;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  await application.save();

  if (status === "Accepted") {
    // Check if membership already exists (e.g. previously removed)
    let membership = await Membership.findOne({
      student: application.student._id,
      club: application.club._id,
    });

    if (membership) {
      membership.status = "Active";
      membership.joinedAt = new Date();
      membership.removedAt = undefined;
      membership.removedBy = undefined;
      membership.removalReason = undefined;
      await membership.save();
    } else {
      await Membership.create({
        student: application.student._id,
        club: application.club._id,
        joinedAt: new Date(),
        status: "Active",
      });
    }

    // Send notification
    await createNotification({
      recipient: application.student._id,
      type: "APPLICATION_ACCEPTED",
      message: `Congratulations! Your application to ${application.club.name} was ACCEPTED.`,
      relatedClub: application.club._id,
      relatedApplication: application._id,
    });
  } else if (status === "Rejected") {
    // Send notification
    await createNotification({
      recipient: application.student._id,
      type: "APPLICATION_REJECTED",
      message: `Your application to ${application.club.name} was rejected. You may apply again in future recruitment cycles.`,
      relatedClub: application.club._id,
      relatedApplication: application._id,
    });
  }

  res.status(200).json(new ApiResponse(200, application, `Application has been ${status.toLowerCase()}`));
});
