import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/email.service.js";

const generateToken = (id) => {
  let rawExpires = process.env.JWT_EXPIRES_IN ? String(process.env.JWT_EXPIRES_IN).trim().replace(/^["']|["']$/g, '') : "7d";
  const expires = rawExpires || "7d";

  return jwt.sign({ id }, process.env.JWT_SECRET || "kit_club_portal_jwt_secret_key_2026_super_secure", {
    expiresIn: expires,
  });
};


export const register = asyncHandler(async (req, res) => {
  const { name, prn, email, password, branch, year, division } = req.body;

  if (!name || !prn || !email || !password || !branch || !year) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!/^\d+$/.test(prn)) {
    throw new ApiError(400, "PRN must be numeric (e.g. 2324001032)");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email is already registered");
  }

  const existingPRN = await User.findOne({ prn });
  if (existingPRN) {
    throw new ApiError(400, "PRN is already registered");
  }

  const user = new User({
    name,
    prn,
    email,
    password,
    branch,
    year,
    division: division || "A",
    isEmailVerified: true,
  });

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        prn: user.prn,
        branch: user.branch,
        year: user.year,
        division: user.division,
        role: user.role,
        isEmailVerified: true,
      },
    }, "Registration successful! Welcome to KIT Club Portal.")
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  const jwtToken = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        prn: user.prn,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    }, "Email verified successfully! You are now logged in.")
  );
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const verificationToken = user.generateVerificationToken();
  await user.save();

  await sendVerificationEmail(user.email, verificationToken, user.name);

  res.status(200).json(
    new ApiResponse(200, { verificationToken }, "Verification email resent successfully!")
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        prn: user.prn,
        branch: user.branch,
        year: user.year,
        division: user.division,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
      },
    }, "Login successful")
  );

});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  await sendPasswordResetEmail(user.email, resetToken, user.name);

  res.status(200).json(
    new ApiResponse(200, { resetToken }, "Password reset email sent! Please check your inbox.")
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, null, "Password reset successful! You can now log in with your new password.")
  );
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User details fetched"));
});
