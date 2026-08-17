import { Club } from "../models/Club.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { Recruitment } from "../models/Recruitment.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper to resolve user by ObjectId, Name, Email, or PRN
const findUserByFlexibleQuery = async (queryVal) => {
  if (!queryVal) return null;
  const mongoose = await import("mongoose");
  if (mongoose.default.Types.ObjectId.isValid(queryVal)) {
    const userById = await User.findById(queryVal);
    if (userById) return userById;
  }
  // Try searching by name, email, or PRN
  const queryStr = String(queryVal).trim();
  return await User.findOne({
    $or: [
      { name: new RegExp(`^${queryStr}$`, "i") },
      { email: queryStr.toLowerCase() },
      { prn: queryStr },
    ],
  });
};

// Admin: Create new club
export const createClub = asyncHandler(async (req, res) => {
  const { name, category, shortDescription, detailedDescription, logo, clubHeadId, facultyCoordinator, contactEmail, activities } = req.body;

  if (!name || !category || !shortDescription || !clubHeadId) {
    throw new ApiError(400, "Name, category, short description, and Club Head selection are required");
  }

  const existingClub = await Club.findOne({ name });
  if (existingClub) {
    throw new ApiError(400, "A club with this name already exists");
  }

  const clubHeadUser = await findUserByFlexibleQuery(clubHeadId);
  if (!clubHeadUser) {
    throw new ApiError(404, `Selected Club Head user '${clubHeadId}' not found. Please choose a valid student from the dropdown.`);
  }

  const club = await Club.create({
    name,
    category,
    shortDescription,
    detailedDescription: detailedDescription || "",
    logo: logo || "",
    clubHead: clubHeadUser._id,
    facultyCoordinator: facultyCoordinator || "",
    contactEmail: contactEmail || clubHeadUser.email,
    activities: activities || [],
  });

  // Promote user role to clubHead if not already admin
  if (clubHeadUser.role === "student") {
    clubHeadUser.role = "clubHead";
    await clubHeadUser.save();
  }

  res.status(201).json(new ApiResponse(201, club, "Club created successfully"));
});


// Public: List active clubs (Search + Filter)
export const listClubs = asyncHandler(async (req, res) => {
  const { search, category, hasUpcomingEvents } = req.query;

  const query = { isActive: true };

  if (category && category !== "All") {
    query.category = category;
  }

  let clubs = await Club.find(query)
    .populate("clubHead", "name email phone branch year division profilePicture")
    .lean();

  // Attach upcoming events and recruitment status to each club
  const now = new Date();
  const enrichedClubs = await Promise.all(
    clubs.map(async (club) => {
      const upcomingEvent = await Event.findOne({
        club: club._id,
        status: "Upcoming",
        date: { $gte: now },
      })
        .sort({ date: 1 })
        .lean();

      const activeRecruitment = await Recruitment.findOne({
        club: club._id,
        status: "Open",
        applicationDeadline: { $gte: now },
      }).lean();

      return {
        ...club,
        upcomingEvent: upcomingEvent || null,
        recruitmentStatus: activeRecruitment ? "Open" : "Closed",
        activeRecruitmentId: activeRecruitment ? activeRecruitment._id : null,
      };
    })
  );

  let filteredClubs = enrichedClubs;

  // Filter by search term (search club name, activity, or upcoming event name)
  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    filteredClubs = filteredClubs.filter((club) => {
      const matchesName = searchRegex.test(club.name);
      const matchesDesc = searchRegex.test(club.shortDescription);
      const matchesActivities = club.activities && club.activities.some((act) => searchRegex.test(act));
      const matchesEvent = club.upcomingEvent && searchRegex.test(club.upcomingEvent.name);
      return matchesName || matchesDesc || matchesActivities || matchesEvent;
    });
  }

  // Filter by hasUpcomingEvents
  if (hasUpcomingEvents === "true") {
    filteredClubs = filteredClubs.filter((club) => club.upcomingEvent !== null);
  }

  res.status(200).json(new ApiResponse(200, filteredClubs, "Clubs fetched successfully"));
});

// Public: Get detailed single club profile
export const getClubDetails = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id)
    .populate("clubHead", "name email phone branch year division profilePicture")
    .lean();

  if (!club || !club.isActive) {
    throw new ApiError(404, "Club not found or is inactive");
  }

  const now = new Date();
  const upcomingEvents = await Event.find({
    club: club._id,
    status: "Upcoming",
    date: { $gte: now },
  }).sort({ date: 1 }).lean();

  const pastEvents = await Event.find({
    club: club._id,
    $or: [{ status: "Completed" }, { status: "Upcoming", date: { $lt: now } }],
  }).sort({ date: -1 }).lean();

  const cancelledEvents = await Event.find({
    club: club._id,
    status: "Cancelled",
  }).sort({ updatedAt: -1 }).lean();

  const activeRecruitment = await Recruitment.findOne({
    club: club._id,
    status: "Open",
    applicationDeadline: { $gte: now },
  }).lean();

  res.status(200).json(
    new ApiResponse(200, {
      ...club,
      upcomingEvents,
      pastEvents,
      cancelledEvents,
      activeRecruitment,
      recruitmentStatus: activeRecruitment ? "Open" : "Closed",
    }, "Club details fetched")
  );
});

// Club Head: Update own club details
export const updateClubProfile = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (!club || !club.isActive) {
    throw new ApiError(404, "Club not found");
  }

  const {
    shortDescription,
    detailedDescription,
    logo,
    facultyCoordinator,
    contactEmail,
    instagram,
    linkedin,
    website,
    activities,
    achievements,
    eventGallery,
    coreMembers,
  } = req.body;

  if (shortDescription !== undefined) club.shortDescription = shortDescription;
  if (detailedDescription !== undefined) club.detailedDescription = detailedDescription;
  if (logo !== undefined) club.logo = logo;
  if (facultyCoordinator !== undefined) club.facultyCoordinator = facultyCoordinator;
  if (contactEmail !== undefined) club.contactEmail = contactEmail;
  if (instagram !== undefined) club.instagram = instagram;
  if (linkedin !== undefined) club.linkedin = linkedin;
  if (website !== undefined) club.website = website;
  if (activities !== undefined) club.activities = activities;
  if (achievements !== undefined) club.achievements = achievements;
  if (eventGallery !== undefined) club.eventGallery = eventGallery;
  if (coreMembers !== undefined) club.coreMembers = coreMembers;

  await club.save();


  res.status(200).json(new ApiResponse(200, club, "Club profile updated successfully"));
});

// Admin: Assign / Change Club Head
export const assignClubHead = asyncHandler(async (req, res) => {
  const { newClubHeadId } = req.body;

  const club = await Club.findById(req.params.id);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  const newHeadUser = await findUserByFlexibleQuery(newClubHeadId);
  if (!newHeadUser) {
    throw new ApiError(404, `New Club Head user '${newClubHeadId}' not found.`);
  }

  // Demote previous head to student if they don't head any other club
  const previousHeadId = club.clubHead;
  club.clubHead = newHeadUser._id;
  await club.save();


  const otherClubsHeaded = await Club.countDocuments({ clubHead: previousHeadId, _id: { $ne: club._id } });
  if (otherClubsHeaded === 0) {
    const prevHeadUser = await User.findById(previousHeadId);
    if (prevHeadUser && prevHeadUser.role === "clubHead") {
      prevHeadUser.role = "student";
      await prevHeadUser.save();
    }
  }

  if (newHeadUser.role === "student") {
    newHeadUser.role = "clubHead";
    await newHeadUser.save();
  }

  res.status(200).json(new ApiResponse(200, club, "Club Head reassigned successfully"));
});

// Admin: Soft Delete Club
export const softDeleteClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  club.isActive = false;
  club.removedAt = new Date();
  club.removedBy = req.user._id;
  await club.save();

  res.status(200).json(new ApiResponse(200, club, "Club soft deleted successfully"));
});

// Admin: Restore Club
export const restoreClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  club.isActive = true;
  club.removedAt = undefined;
  club.removedBy = undefined;
  await club.save();

  res.status(200).json(new ApiResponse(200, club, "Club restored successfully"));
});

// Admin: List all clubs including soft-deleted ones
export const getAllClubsAdmin = asyncHandler(async (req, res) => {
  const clubs = await Club.find()
    .populate("clubHead", "name email prn branch year phone")
    .populate("removedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, clubs, "All clubs fetched for Admin"));
});
