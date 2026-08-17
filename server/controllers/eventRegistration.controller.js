import { EventRegistration } from "../models/EventRegistration.js";
import { Event } from "../models/Event.js";
import { Membership } from "../models/Membership.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notification.service.js";

// Student: Register for an event
export const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const studentId = req.user._id;

  const event = await Event.findById(eventId).populate("club");
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.status !== "Upcoming") {
    throw new ApiError(400, `Cannot register for a ${event.status.toLowerCase()} event`);
  }

  if (new Date(event.registrationDeadline) < new Date()) {
    throw new ApiError(400, "Registration deadline for this event has passed");
  }

  // Business Rule 15: Eligibility Check
  if (event.eligibility === "Club Members Only") {
    const isMember = await Membership.findOne({
      student: studentId,
      club: event.club._id,
      status: "Active",
    });

    if (!isMember) {
      throw new ApiError(403, "This event is restricted to members of this club only");
    }
  }

  // Business Rule 16: Capacity Check
  if (event.capacity === "Limited" && event.registeredCount >= event.maxParticipants) {
    throw new ApiError(400, "Event capacity has been reached");
  }

  // Business Rule 35: Prevent duplicate registration
  const existingRegistration = await EventRegistration.findOne({
    student: studentId,
    event: eventId,
  });

  if (existingRegistration) {
    throw new ApiError(400, "You are already registered for this event");
  }

  const registration = await EventRegistration.create({
    student: studentId,
    event: eventId,
    club: event.club._id,
    registeredAt: new Date(),
  });

  // Increment registeredCount
  event.registeredCount += 1;
  await event.save();

  // Notification for student
  await createNotification({
    recipient: studentId,
    type: "EVENT_REGISTERED",
    message: `Registration confirmed for '${event.name}' (${event.club.name})!`,
    relatedClub: event.club._id,
    relatedEvent: event._id,
  });

  // Notification for Club Head
  if (event.club && event.club.clubHead) {
    await createNotification({
      recipient: event.club.clubHead,
      type: "NEW_EVENT_REGISTRATION",
      message: `${req.user.name} registered for your event '${event.name}'`,
      relatedClub: event.club._id,
      relatedEvent: event._id,
    });
  }

  res.status(201).json(new ApiResponse(201, registration, "Successfully registered for event!"));
});

// Club Head: Get list of registrations for an event
export const getEventRegistrations = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const registrations = await EventRegistration.find({ event: eventId })
    .populate("student", "name prn email phone branch year division profilePicture")
    .sort({ registeredAt: -1 });

  res.status(200).json(new ApiResponse(200, registrations, "Event registrations fetched"));
});

// Student: Get my registered events
export const getMyEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find({ student: req.user._id })
    .populate({
      path: "event",
      populate: { path: "club", select: "name logo category" },
    })
    .sort({ registeredAt: -1 });

  res.status(200).json(new ApiResponse(200, registrations, "My registered events fetched"));
});
