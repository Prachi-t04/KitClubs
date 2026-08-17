import { User } from "../models/User.js";
import { Club } from "../models/Club.js";
import { Recruitment } from "../models/Recruitment.js";
import { Event } from "../models/Event.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const seedDatabase = asyncHandler(async (req, res) => {
  const { secretKey } = req.body;

  const expectedSecret = process.env.ADMIN_SEED_SECRET || "kit_admin_seed_secret_key_2026";
  if (secretKey !== expectedSecret) {
    throw new ApiError(403, "Invalid seed secret key");
  }

  // 1. Seed Admin User
  let admin = await User.findOne({ email: "admin@kitkop.edu.in" });
  if (!admin) {
    admin = await User.create({
      name: "KIT System Administrator",
      prn: "0000000000",
      email: "admin@kitkop.edu.in",
      password: "adminpass123",
      branch: "CSE",
      year: 4,
      division: "A",
      role: "admin",
      isEmailVerified: true,
    });
  }

  // 2. Define 12 Clubs + Club Heads
  const sampleClubs = [
    {
      name: "Robotics Club",
      category: "Technical",
      shortDescription: "Designing, building, and programming autonomous robots and IoT devices for national robotics competitions.",
      detailedDescription: "The KIT Robotics Club is a vibrant community of innovation and hardware engineering. We conduct workshops on Arduino, Raspberry Pi, ROS (Robot Operating System), 3D printing, and compete in Robocon and Techfest.",
      facultyCoordinator: "Prof. S. R. Kulkarni (Mechanical Dept)",
      contactEmail: "robotics@kitkop.edu.in",
      headName: "Rahul Sharma",
      headPrn: "2324001001",
      headEmail: "head.robotics@kitkop.edu.in",
      activities: ["Autonomous Line Follower", "Drone Building", "IoT Workshop", "Robo Wars"],
      achievements: ["1st Prize at National Robocon 2025", "Best Innovation Award at Techfest Mumbai"],
    },
    {
      name: "Coding Club",
      category: "Technical",
      shortDescription: "Promoting competitive programming, open source contribution, full-stack web dev, and algorithmic problem solving.",
      detailedDescription: "KIT Coding Club organizes weekly LeetCode speedruns, hackathons, open-source sprints, and technical interview preparation sessions. Open to all students passionate about software development.",
      facultyCoordinator: "Dr. A. B. Patil (CSE Dept)",
      contactEmail: "codingclub@kitkop.edu.in",
      headName: "Prachi Patil",
      headPrn: "2324001002",
      headEmail: "head.coding@kitkop.edu.in",
      activities: ["Hackathons", "CP Bootcamps", "Web Development", "AI/ML Study Jam"],
      achievements: ["Top 5 in Smart India Hackathon 2025", "100+ active GitHub contributors"],
    },
    {
      name: "Music Club — Rhythm",
      category: "Cultural",
      shortDescription: "Bringing together vocalists, instrumentalists, and sound enthusiasts for jam sessions and annual fests.",
      detailedDescription: "Rhythm is the official music group of KIT. We practice classical, fusion, rock, and pop music, host open mic sessions, and perform at Pioneer and inter-college cultural events.",
      facultyCoordinator: "Prof. M. V. Deshmukh",
      contactEmail: "music@kitkop.edu.in",
      headName: "Aditya Joshi",
      headPrn: "2324001003",
      headEmail: "head.music@kitkop.edu.in",
      activities: ["Acoustic Nights", "Band Jam Sessions", "Vocal Training", "Sound Engineering Workshop"],
      achievements: ["Winner of Inter-College Battle of Bands 2025"],
    },
    {
      name: "Dance Club — Footwork",
      category: "Cultural",
      shortDescription: "Celebrating movement through hip-hop, contemporary, classical Indian, and flash mobs.",
      detailedDescription: "Footwork Dance Club brings high energy to campus. We hold regular dance workshops, choreography sessions, and represent KIT in state-level dance competitions.",
      facultyCoordinator: "Prof. V. N. Shinde",
      contactEmail: "dance@kitkop.edu.in",
      headName: "Neha Kulkarni",
      headPrn: "2324001004",
      headEmail: "head.dance@kitkop.edu.in",
      activities: ["Flash Mobs", "Hip Hop Masterclass", "Classical Fusion Showcase", "Annual Fest Production"],
      achievements: ["1st Place in Mood Indigo Group Dance 2025"],
    },
    {
      name: "Entrepreneurship Cell (E-Cell)",
      category: "Entrepreneurship",
      shortDescription: "Fostering startup culture, pitching ideas, startup incubation support, and founder speaker series.",
      detailedDescription: "E-Cell KIT empowers students to turn ideas into viable businesses. We host E-Summit, Business Plan competitions, angel investor meetups, and provide incubation guidance with KIT TBI.",
      facultyCoordinator: "Dr. Y. M. Patil (MBA Dept)",
      contactEmail: "ecell@kitkop.edu.in",
      headName: "Siddharth Mehta",
      headPrn: "2324001005",
      headEmail: "head.ecell@kitkop.edu.in",
      activities: ["E-Summit", "Pitching Competitions", "Founder Talks", "Incubation Guidance"],
      achievements: ["Funded 3 student startups in 2025", "Organized E-Summit with 1000+ attendees"],
    },
    {
      name: "Literary Society",
      category: "Literary",
      shortDescription: "Debates, creative writing, poetry slams, college magazine publication, and public speaking.",
      detailedDescription: "The Literary Society is the voice of KIT. We host parliamentary debates, poetry open mics, book clubs, and publish 'Chrysalis', the annual college magazine.",
      facultyCoordinator: "Prof. S. A. Bhosale",
      contactEmail: "literary@kitkop.edu.in",
      headName: "Ananya Pawar",
      headPrn: "2324001006",
      headEmail: "head.literary@kitkop.edu.in",
      activities: ["Parliamentary Debate", "Poetry Slam", "Creative Writing", "College Magazine"],
      achievements: ["Best Delegation at Kolhapur Model UN 2025"],
    },
    {
      name: "Fine Arts Club",
      category: "Arts",
      shortDescription: "Painting, sketching, digital art, origami, wall murals, and aesthetic campus decor.",
      detailedDescription: "Expressing creativity through visual art. We organize live painting sessions, digital art masterclasses, wall mural painting across campus, and gallery exhibitions.",
      facultyCoordinator: "Prof. K. R. Mane",
      contactEmail: "finearts@kitkop.edu.in",
      headName: "Rohan Varma",
      headPrn: "2324001007",
      headEmail: "head.finearts@kitkop.edu.in",
      activities: ["Wall Murals", "Digital Art Workshop", "Sketching Drives", "Exhibitions"],
      achievements: ["Beautified 5 campus blocks with eco-themed murals"],
    },
    {
      name: "Sports Association",
      category: "Sports",
      shortDescription: "Organizing intra-college tournaments in cricket, football, badminton, chess, and athletics.",
      detailedDescription: "KIT Sports Association manages college teams and conducts annual sports fests. We promote physical fitness, teamwork, and sportsmanship across all departments.",
      facultyCoordinator: "Dr. P. S. Jadhav (Physical Education)",
      contactEmail: "sports@kitkop.edu.in",
      headName: "Vikram Gaikwad",
      headPrn: "2324001008",
      headEmail: "head.sports@kitkop.edu.in",
      activities: ["KIT Premier League (Cricket)", "Inter-Dept Football", "Chess Championship", "Marathon"],
      achievements: ["Zonal Champions in Football 2025"],
    },
    {
      name: "Rotaract Club of KIT",
      category: "Social",
      shortDescription: "Community service, blood donation drives, tree plantation, cleanliness drives, and social awareness.",
      detailedDescription: "A student-led service club focused on making a real difference in Kolhapur. We organize blood donation camps, rural teaching drives, environmental campaigns, and health awareness.",
      facultyCoordinator: "Prof. R. T. Kamble",
      contactEmail: "rotaract@kitkop.edu.in",
      headName: "Sneha Shinde",
      headPrn: "2324001009",
      headEmail: "head.rotaract@kitkop.edu.in",
      activities: ["Mega Blood Donation", "Tree Plantation Drive", "Teaching Drive", "Beach & River Cleanup"],
      achievements: ["Collected 500+ blood units in 2025", "Planted 1000 saplings in Kolhapur"],
    },
    {
      name: "IEEE Student Branch",
      category: "Technical",
      shortDescription: "Technical paper presentations, IEEE international conferences, hardware projects, and research.",
      detailedDescription: "Official student branch of IEEE at KIT. Connects students with global IEEE resources, distinguished lectures, paper publishing guidance, and technical workshops.",
      facultyCoordinator: "Dr. S. B. Chavan (ENTC Dept)",
      contactEmail: "ieee@kitkop.edu.in",
      headName: "Harshavardhan Patil",
      headPrn: "2324001010",
      headEmail: "head.ieee@kitkop.edu.in",
      activities: ["Paper Writing Workshop", "IEEE Day Celebrations", "Signal Processing Seminar", "Circuit Design"],
      achievements: ["Best IEEE Student Branch Award (Bombay Section)"],
    },
    {
      name: "Astronomy Club — Orion",
      category: "Other",
      shortDescription: "Stargazing nights, telescope handling, astrophysics discussions, and space tech exploration.",
      detailedDescription: "Orion explores the cosmos! We organize overnight sky observation sessions, planetary viewing with our 8-inch telescope, space science quizzes, and astrophotography.",
      facultyCoordinator: "Prof. D. K. Kulkarni (Physics Dept)",
      contactEmail: "astronomy@kitkop.edu.in",
      headName: "Tanvi Kulkarni",
      headPrn: "2324001011",
      headEmail: "head.astronomy@kitkop.edu.in",
      activities: ["Overnight Stargazing", "Astrophotography Workshop", "Space Tech Quiz", "Telescope Setup"],
      achievements: ["Observed & documented 2025 Lunar Eclipse on campus"],
    },
    {
      name: "Drama Club — Abhinay",
      category: "Cultural",
      shortDescription: "Street plays (Nukkad Natak), one-act plays, mono-acting, scriptwriting, and stagecraft.",
      detailedDescription: "Abhinay expresses social issues and theatrical art through street plays and auditorium productions. Performs regularly at Purushottam Karandak and Firodiya Karandak.",
      facultyCoordinator: "Prof. S. G. More",
      contactEmail: "drama@kitkop.edu.in",
      headName: "Omkar Salokhe",
      headPrn: "2324001012",
      headEmail: "head.drama@kitkop.edu.in",
      activities: ["Street Plays (Nukkad Natak)", "Scriptwriting Workshop", "Stage Acting", "Mime Performance"],
      achievements: ["Selected for Purushottam Karandak Finals 2025"],
    },
  ];

  const seededClubs = [];

  for (const c of sampleClubs) {
    // Check if head user exists or create
    let headUser = await User.findOne({ email: c.headEmail });
    if (!headUser) {
      headUser = await User.create({
        name: c.headName,
        prn: c.headPrn,
        email: c.headEmail,
        password: "headpassword123",
        branch: "CSE",
        year: 3,
        division: "A",
        role: "clubHead",
        isEmailVerified: true,
      });
    }

    // Check if club exists
    let club = await Club.findOne({ name: c.name });
    if (!club) {
      club = await Club.create({
        name: c.name,
        category: c.category,
        shortDescription: c.shortDescription,
        detailedDescription: c.detailedDescription,
        clubHead: headUser._id,
        facultyCoordinator: c.facultyCoordinator,
        contactEmail: c.contactEmail,
        activities: c.activities,
        achievements: c.achievements,
        isActive: true,
      });

      // Create an open recruitment cycle for this club
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 14); // 2 weeks in future

      await Recruitment.create({
        club: club._id,
        title: `Autumn Recruitment 2026 — ${club.name}`,
        description: `Join ${club.name} for the 2026 academic session! Open to all motivated KIT students across all branches and years.`,
        applicationDeadline: deadline,
        status: "Open",
        questions: [
          { questionText: `Why do you want to join ${club.name}?`, isRequired: true, order: 1 },
          { questionText: "What skills or prior experience do you bring to the team?", isRequired: true, order: 2 },
          { questionText: "How many hours per week can you dedicate to club activities?", isRequired: true, order: 3 },
        ],
        createdBy: headUser._id,
      });

      // Create a sample upcoming event for this club
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + 7 + Math.floor(Math.random() * 10)); // 1-2 weeks in future

      const eventDeadline = new Date(eventDate);
      eventDeadline.setDate(eventDeadline.getDate() - 1);

      await Event.create({
        club: club._id,
        name: `${club.name} Orientation & Hands-on Workshop 2026`,
        description: `Introductory session and interactive workshop organized by ${club.name}. Meet the core members, explore ongoing projects, and register for hands-on activities.`,
        date: eventDate,
        startTime: "04:30 PM",
        endTime: "06:30 PM",
        venue: "Central Auditorium / Computer Lab 3, KIT Kolhapur",
        registrationDeadline: eventDeadline,
        eventType: "Workshop",
        eligibility: "All KIT Students",
        capacity: "Limited",
        maxParticipants: 100,
        registeredCount: 15,
        status: "Upcoming",
        createdBy: headUser._id,
      });
    }

    seededClubs.push(club);
  }

  res.status(200).json(
    new ApiResponse(200, {
      adminEmail: "admin@kitkop.edu.in",
      seededClubsCount: seededClubs.length,
      note: "All club heads seeded with password 'headpassword123', admin with 'adminpass123'",
    }, "Database seeded successfully with 12 real KIT clubs & club heads!")
  );
});
