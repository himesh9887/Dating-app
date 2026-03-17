import Match from "../models/Match.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateDistanceKm, sortByDistance } from "../utils/distance.js";
import { uploadFiles } from "../utils/uploadMedia.js";
import createNotification from "../utils/createNotification.js";

const parseArrayField = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

const withDerivedProfile = (viewer, user) => {
  const data = user.toObject ? user.toObject() : user;
  const distanceKm = viewer?.location?.coordinates?.coordinates
    ? calculateDistanceKm(
        viewer.location.coordinates.coordinates,
        data.location?.coordinates?.coordinates,
      )
    : null;

  return {
    ...data,
    distanceKm,
    stats: {
      posts: data.postsCount ?? 0,
      followers: data.followers?.length || 0,
      following: data.following?.length || 0,
      matches: data.matches?.length || 0,
    },
  };
};

export const getMe = asyncHandler(async (req, res) => {
  const postsCount = await Post.countDocuments({ author: req.user._id });

  res.json({
    user: withDerivedProfile(req.user, {
      ...req.user.toObject(),
      postsCount,
    }),
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const uploads = await uploadFiles(req.files || [], "spark/profiles");

  if (uploads.length) {
    user.profilePhotos = uploads.map((photo, index) => ({
      ...photo,
      isPrimary: index === 0,
    }));
  }

  user.name = req.body.name ?? user.name;
  user.age = req.body.age ?? user.age;
  user.gender = req.body.gender ?? user.gender;
  user.bio = req.body.bio ?? user.bio;
  user.interests = parseArrayField(req.body.interests, user.interests);
  user.privacy = {
    isPrivate:
      req.body.isPrivate !== undefined
        ? req.body.isPrivate === "true"
        : user.privacy.isPrivate,
    showLocation:
      req.body.showLocation !== undefined
        ? req.body.showLocation === "true"
        : user.privacy.showLocation,
    showActivity:
      req.body.showActivity !== undefined
        ? req.body.showActivity === "true"
        : user.privacy.showActivity,
  };
  user.location = {
    city: req.body.city || user.location.city,
    state: req.body.state || user.location.state,
    country: req.body.country || user.location.country,
    label: req.body.location || user.location.label,
    coordinates: {
      type: "Point",
      coordinates: [
        Number(req.body.longitude || user.location.coordinates.coordinates[0]),
        Number(req.body.latitude || user.location.coordinates.coordinates[1]),
      ],
    },
  };

  await user.save();

  res.json({
    message: "Profile updated",
    user: withDerivedProfile(req.user, user),
  });
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const users = await User.find({
    _id: { $nin: [req.user._id, ...req.user.following, ...req.user.blockedUsers] },
  })
    .sort({ lastActiveAt: -1 })
    .limit(Number(req.query.limit || 6));

  const suggestions = sortByDistance(
    req.user.location.coordinates.coordinates,
    users.map((user) => user.toObject()),
  ).map((user) => withDerivedProfile(req.user, user));

  res.json({ suggestions });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { q = "", interest = "", location = "", gender = "" } = req.query;
  const ageMin = Number(req.query.ageMin || 18);
  const ageMax = Number(req.query.ageMax || 99);
  const maxDistance = Number(req.query.distance || 500);

  const query = {
    _id: { $ne: req.user._id },
    age: { $gte: ageMin, $lte: ageMax },
  };

  if (gender) {
    query.gender = gender;
  }

  if (q) {
    query.$or = [
      { username: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
      { bio: { $regex: q, $options: "i" } },
    ];
  }

  if (interest) {
    query.interests = { $in: [new RegExp(interest, "i")] };
  }

  if (location) {
    query["location.label"] = { $regex: location, $options: "i" };
  }

  const users = await User.find(query).limit(30);
  const results = users
    .map((user) => withDerivedProfile(req.user, user))
    .filter((user) => user.distanceKm === null || user.distanceKm <= maxDistance);

  res.json({ users: results });
});

export const getNearbyUsers = asyncHandler(async (req, res) => {
  const maxDistance = Number(req.query.distance || 50);
  const users = await User.find({
    _id: { $ne: req.user._id },
  }).limit(40);

  const nearby = users
    .map((user) => withDerivedProfile(req.user, user))
    .filter((user) => user.distanceKm === null || user.distanceKm <= maxDistance);

  res.json({ users: nearby });
});

export const followUser = asyncHandler(async (req, res) => {
  const [currentUser, targetUser] = await Promise.all([
    User.findById(req.user._id),
    User.findById(req.params.id),
  ]);

  if (!targetUser) {
    const error = new Error("Target user not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(targetUser._id) === String(req.user._id)) {
    const error = new Error("You cannot follow yourself");
    error.statusCode = 400;
    throw error;
  }

  const alreadyFollowing = currentUser.following.some(
    (id) => String(id) === String(targetUser._id),
  );

  if (!alreadyFollowing) {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
    await Promise.all([currentUser.save(), targetUser.save()]);

    await createNotification({
      recipient: targetUser._id,
      actor: currentUser._id,
      type: "follow",
      title: `${currentUser.username} followed you`,
      io: req.app.get("io"),
    });
  }

  res.json({ message: "User followed" });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const [currentUser, targetUser] = await Promise.all([
    User.findById(req.user._id),
    User.findById(req.params.id),
  ]);

  if (!currentUser || !targetUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  currentUser.following = currentUser.following.filter(
    (id) => String(id) !== String(targetUser._id),
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => String(id) !== String(currentUser._id),
  );

  await Promise.all([currentUser.save(), targetUser.save()]);

  res.json({ message: "User unfollowed" });
});

export const blockUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  if (!currentUser.blockedUsers.some((id) => String(id) === req.params.id)) {
    currentUser.blockedUsers.push(req.params.id);
    await currentUser.save();
  }

  res.json({ message: "User blocked" });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .populate("followers", "name username profilePhotos")
    .populate("following", "name username profilePhotos");

  if (!user) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  const posts = await Post.find({ author: user._id })
    .populate("author", "name username profilePhotos")
    .sort({ createdAt: -1 })
    .limit(12);

  res.json({
    profile: withDerivedProfile(req.user, {
      ...user.toObject(),
      postsCount: posts.length,
    }),
    posts,
  });
});

export const getPremiumInsights = asyncHandler(async (req, res) => {
  const usersWhoLikedYou = await User.find({
    "likes.user": req.user._id,
    _id: { $ne: req.user._id },
  });

  res.json({
    likedYou: usersWhoLikedYou.map((user) => withDerivedProfile(req.user, user)),
  });
});

export const activateBoost = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  currentUser.subscription.boostedUntil = new Date(Date.now() + 60 * 60 * 1000);
  await currentUser.save();

  res.json({
    message: "Profile boost activated for 60 minutes",
    boostedUntil: currentUser.subscription.boostedUntil,
  });
});

export const getDiscoverFilters = asyncHandler(async (_req, res) => {
  res.json({
    filters: {
      genders: ["Woman", "Man", "Non-binary", "Prefer not to say"],
      interests: [
        "Music",
        "Travel",
        "Gaming",
        "Fashion",
        "Fitness",
        "Photography",
      ],
      maxDistance: 500,
    },
  });
});
