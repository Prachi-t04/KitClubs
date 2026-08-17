import { Event } from "../models/Event.js";
import { EventRegistration } from "../models/EventRegistration.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notification.service.js";

// Club Head: Create event
export const createEvent = asyncHandler(async (req, res) => {
  const {
    clubId,
    name,
    description,
    banner,
    date,
    startTime,
    endTime,
    venue,
    registrationDeadline,
    eventType,
    eligibility,
    capacity,
    maxParticipants,
  } = req.body;

  if (!clubId || !name || !description || !date || !startTime || !endTime || !venue || !registrationDeadline) {
    throw new ApiError(400, "All required event details must be provided");
  }

  const event = await Event.create({
    club: clubId,
    name,
    description,
    banner: banner || "",
    date,
    startTime,
    endTime,
    venue,
    registrationDeadline,
    eventType: eventType || "Workshop",
    eligibility: eligibility || "All KIT Students",
    capacity: capacity || "Unlimited",
    maxParticipants: capacity === "Limited" ? Number(maxParticipants) || 50 : 0,
    registeredCount: 0,
    status: "Upcoming",
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

// Club Head: Edit event
export const editEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("club");
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (req.user.role !== "admin" && event.club.clubHead.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authorization denied: You do not manage this club's events");
  }

  const {
    name,
    description,
    banner,
    date,
    startTime,
    endTime,
    venue,
    registrationDeadline,
    eventType,
    eligibility,
    capacity,
    maxParticipants,
  } = req.body;

  if (name !== undefined) event.name = name;
  if (description !== undefined) event.description = description;
  if (banner !== undefined) event.banner = banner;
  if (date !== undefined) event.date = date;
  if (startTime !== undefined) event.startTime = startTime;
  if (endTime !== undefined) event.endTime = endTime;
  if (venue !== undefined) event.venue = venue;
  if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline;
  if (eventType !== undefined) event.eventType = eventType;
  if (eligibility !== undefined) event.eligibility = eligibility;
  if (capacity !== undefined) event.capacity = capacity;
  if (maxParticipants !== undefined) event.maxParticipants = Number(maxParticipants);

  await event.save();

  res.status(200).json(new ApiResponse(200, event, "Event updated successfully"));
});

// Club Head: Cancel event
export const cancelEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("club");
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (req.user.role !== "admin" && event.club.clubHead.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authorization denied: You do not manage this club's events");
  }

  event.status = "Cancelled";
  await event.save();

  // Notify all registered students
  const registrations = await EventRegistration.find({ event: event._id });
  for (const reg of registrations) {
    await createNotification({
      recipient: reg.student,
      type: "EVENT_CANCELLED",
      message: `Important: The event '${event.name}' by ${event.club.name} has been CANCELLED.`,
      relatedClub: event.club._id,
      relatedEvent: event._id,
    });
  }

  res.status(200).json(new ApiResponse(200, event, "Event cancelled. Registrants have been notified."));
});

// Public: List all upcoming events across clubs
export const listUpcomingEvents = asyncHandler(async (req, res) => {
  const now = new Date();
  const events = await Event.find({
    status: "Upcoming",
    date: { $gte: now },
  })
    .populate("club", "name logo category")
    .sort({ date: 1 })
    .lean();

  res.status(200).json(new ApiResponse(200, events, "Upcoming events fetched"));
});

// Public: Get club specific events
export const getClubEvents = asyncHandler(async (req, res) => {
  const { clubId } = req.params;

  const now = new Date();
  const upcomingEvents = await Event.find({
    club: clubId,
    status: "Upcoming",
    date: { $gte: now },
  }).sort({ date: 1 });

  const pastEvents = await Event.find({
    club: clubId,
    $or: [{ status: "Completed" }, { status: "Upcoming", date: { $lt: now } }],
  }).sort({ date: -1 });

  const cancelledEvents = await Event.find({
    club: clubId,
    status: "Cancelled",
  }).sort({ updatedAt: -1 });

  res.status(200).json(
    new ApiResponse(200, { upcomingEvents, pastEvents, cancelledEvents }, "Club events fetched")
  );
});

// Public: Get single event details
export const getEventDetails = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("club", "name logo category facultyCoordinator contactEmail");
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  res.status(200).json(new ApiResponse(200, event, "Event details fetched"));
});
