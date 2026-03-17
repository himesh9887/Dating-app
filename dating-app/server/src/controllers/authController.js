import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { uploadFiles } from "../utils/uploadMedia.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const parseArrayField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return [];
  }
};

const formatLocationPayload = (body) => ({
  city: body.city || "",
  state: body.state || "",
  country: body.country || "",
  label: body.location || body.city || "",
  coordinates: {
    type: "Point",
    coordinates: [
      Number(body.longitude || 77.5946),
      Number(body.latitude || 12.9716),
    ],
  },
});

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    message: "Authentication successful",
    token: generateToken(user._id),
    user,
  });
};

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (existingUser) {
    const error = new Error("Email or username already exists");
    error.statusCode = 409;
    throw error;
  }

  const uploads = await uploadFiles(req.files || [], "spark/profiles");
  const profilePhotos = uploads.length
    ? uploads.map((photo, index) => ({
        ...photo,
        isPrimary: index === 0,
      }))
    : [
        {
          url: `https://placehold.co/600x800/png?text=${encodeURIComponent(
            req.body.name || "Spark",
          )}`,
          publicId: null,
          isPrimary: true,
        },
      ];

  const user = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
    bio: req.body.bio || "",
    interests: parseArrayField(req.body.interests),
    profilePhotos,
    location: formatLocationPayload(req.body),
  });

  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const identifier = req.body.identifier.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");

  if (!user || !(await user.comparePassword(req.body.password))) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  user.lastActiveAt = new Date();
  await user.save();

  const safeUser = await User.findById(user._id);
  sendAuthResponse(res, safeUser);
});

export const googleLogin = asyncHandler(async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error("Google OAuth is not configured");
    error.statusCode = 503;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: req.body.credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const email = payload?.email?.toLowerCase();

  if (!email) {
    const error = new Error("Unable to read Google profile");
    error.statusCode = 400;
    throw error;
  }

  let user = await User.findOne({ email });

  if (!user) {
    const usernameBase = email.split("@")[0].replace(/[^a-zA-Z0-9_.]/g, "");
    let username = usernameBase || `spark${Date.now()}`;
    let suffix = 1;

    while (await User.findOne({ username })) {
      username = `${usernameBase}${suffix}`;
      suffix += 1;
    }

    user = await User.create({
      name: payload.name || username,
      username,
      email,
      age: 18,
      gender: "Prefer not to say",
      oauthProvider: "google",
      bio: "New to Spark. Say hi.",
      profilePhotos: payload.picture
        ? [{ url: payload.picture, publicId: null, isPrimary: true }]
        : [],
      location: formatLocationPayload(req.body),
    });
  }

  sendAuthResponse(res, user);
});

export const forgotPassword = asyncHandler(async (_req, res) => {
  res.json({
    message:
      "Password reset flow placeholder ready. Connect your mail provider to send reset links.",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("followers", "name username profilePhotos")
    .populate("following", "name username profilePhotos");

  res.json({ user });
});
