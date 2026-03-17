import Match from "../models/Match.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotification.js";
import { withDistance } from "./shared.js";

const orderPair = (left, right) =>
  [String(left), String(right)].sort((a, b) => a.localeCompare(b));

const createMatchIfNeeded = async ({ currentUser, targetUser, actionType, req }) => {
  const targetLikedBack = targetUser.likes.some(
    (entry) => String(entry.user) === String(currentUser._id),
  );

  if (!targetLikedBack) {
    return null;
  }

  const [user1, user2] = orderPair(currentUser._id, targetUser._id);
  let match = await Match.findOne({ user1, user2 })
    .populate("user1", "name username profilePhotos age bio location interests")
    .populate("user2", "name username profilePhotos age bio location interests");

  if (match) {
    return match;
  }

  match = await Match.create({
    user1,
    user2,
    initiatedBy: currentUser._id,
    lastMessage: actionType === "superlike" ? "Super like landed" : "Its a match",
  });

  currentUser.matches.push(match._id);
  targetUser.matches.push(match._id);
  await Promise.all([currentUser.save(), targetUser.save()]);

  await Promise.all([
    createNotification({
      recipient: currentUser._id,
      actor: targetUser._id,
      type: "match",
      title: `You matched with ${targetUser.username}`,
      entityId: match._id,
      io: req.app.get("io"),
    }),
    createNotification({
      recipient: targetUser._id,
      actor: currentUser._id,
      type: "match",
      title: `You matched with ${currentUser.username}`,
      entityId: match._id,
      io: req.app.get("io"),
    }),
  ]);

  const populatedMatch = await Match.findById(match._id)
    .populate("user1", "name username profilePhotos age bio location interests")
    .populate("user2", "name username profilePhotos age bio location interests");

  req.app.get("io").to(String(currentUser._id)).emit("match:new", populatedMatch);
  req.app.get("io").to(String(targetUser._id)).emit("match:new", populatedMatch);

  return populatedMatch;
};

export const getDiscover = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const matchedUsers = await Match.find({
    $or: [{ user1: currentUser._id }, { user2: currentUser._id }],
  });

  const matchedIds = matchedUsers.flatMap((match) => [
    String(match.user1),
    String(match.user2),
  ]);

  const excludedIds = [
    String(currentUser._id),
    ...currentUser.likes.map((entry) => String(entry.user)),
    ...currentUser.passes.map(String),
    ...currentUser.blockedUsers.map(String),
    ...matchedIds,
  ];

  const ageMin = Number(req.query.ageMin || 18);
  const ageMax = Number(req.query.ageMax || 99);
  const gender = req.query.gender;

  const query = {
    _id: { $nin: excludedIds },
    age: { $gte: ageMin, $lte: ageMax },
  };

  if (gender) {
    query.gender = gender;
  }

  const candidates = await User.find(query).limit(30);
  const enrichedCandidates = candidates
    .map((candidate) => withDistance(currentUser, candidate))
    .sort((left, right) => {
      const leftBoost = left.subscription?.boostedUntil
        ? new Date(left.subscription.boostedUntil).getTime()
        : 0;
      const rightBoost = right.subscription?.boostedUntil
        ? new Date(right.subscription.boostedUntil).getTime()
        : 0;
      const boostDelta = rightBoost - leftBoost;

      if (boostDelta !== 0) {
        return boostDelta;
      }

      const interestDelta =
        (right.sharedInterests?.length || 0) - (left.sharedInterests?.length || 0);

      if (interestDelta !== 0) {
        return interestDelta;
      }

      return (left.distanceKm ?? 999) - (right.distanceKm ?? 999);
    });

  res.json({ users: enrichedCandidates });
});

export const swipeUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  currentUser.likes = currentUser.likes.filter(
    (entry) => String(entry.user) !== String(targetUser._id),
  );
  currentUser.passes = currentUser.passes.filter(
    (id) => String(id) !== String(targetUser._id),
  );

  let match = null;

  if (req.body.action === "dislike") {
    currentUser.passes.push(targetUser._id);
  } else {
    currentUser.likes.push({
      user: targetUser._id,
      type: req.body.action === "superlike" ? "superlike" : "like",
    });

    match = await createMatchIfNeeded({
      currentUser,
      targetUser,
      actionType: req.body.action,
      req,
    });
  }

  await currentUser.save();

  res.json({
    message: `Swipe recorded: ${req.body.action}`,
    matched: Boolean(match),
    match,
  });
});

export const getMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({
    $or: [{ user1: req.user._id }, { user2: req.user._id }],
  })
    .populate("user1", "name username profilePhotos age bio location interests")
    .populate("user2", "name username profilePhotos age bio location interests")
    .sort({ matchedAt: -1 });

  res.json({
    matches: matches.map((match) => {
      const partner =
        String(match.user1._id) === String(req.user._id) ? match.user2 : match.user1;

      return {
        ...match.toObject(),
        partner: withDistance(req.user, partner),
      };
    }),
  });
});
