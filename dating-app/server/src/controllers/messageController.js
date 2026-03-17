import Match from "../models/Match.js";
import Message from "../models/Message.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotification.js";
import { uploadFiles } from "../utils/uploadMedia.js";

const findMatchForUser = async (matchId, userId) => {
  const match = await Match.findById(matchId)
    .populate("user1", "name username profilePhotos")
    .populate("user2", "name username profilePhotos");

  if (!match) {
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }

  const participantIds = [String(match.user1._id), String(match.user2._id)];

  if (!participantIds.includes(String(userId))) {
    const error = new Error("Access denied for this conversation");
    error.statusCode = 403;
    throw error;
  }

  return match;
};

export const getConversations = asyncHandler(async (req, res) => {
  const matches = await Match.find({
    $or: [{ user1: req.user._id }, { user2: req.user._id }],
  })
    .populate("user1", "name username profilePhotos")
    .populate("user2", "name username profilePhotos")
    .sort({ lastMessageAt: -1 });

  const conversations = await Promise.all(
    matches.map(async (match) => {
      const partner =
        String(match.user1._id) === String(req.user._id) ? match.user2 : match.user1;
      const unreadCount = await Message.countDocuments({
        matchId: match._id,
        receiverId: req.user._id,
        seenStatus: false,
      });

      return {
        ...match.toObject(),
        partner,
        unreadCount,
      };
    }),
  );

  res.json({ conversations });
});

export const getMessages = asyncHandler(async (req, res) => {
  await findMatchForUser(req.params.matchId, req.user._id);

  const messages = await Message.find({ matchId: req.params.matchId }).sort({
    createdAt: 1,
  });

  res.json({ messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const match = await findMatchForUser(req.params.matchId, req.user._id);
  const uploads = await uploadFiles(req.files || [], "spark/messages");
  const recipient =
    String(match.user1._id) === String(req.user._id) ? match.user2 : match.user1;

  if (!req.body.message && !uploads.length) {
    const error = new Error("Message content is required");
    error.statusCode = 400;
    throw error;
  }

  const message = await Message.create({
    matchId: match._id,
    senderId: req.user._id,
    receiverId: recipient._id,
    message: req.body.message || "",
    messageType: uploads.length ? "image" : req.body.messageType || "text",
    media: uploads[0] || null,
  });

  match.lastMessage = uploads.length ? "Sent a photo" : req.body.message;
  match.lastMessageAt = new Date();
  match.lastMessageSender = req.user._id;
  await match.save();

  const io = req.app.get("io");
  io.to(req.params.matchId).emit("message:new", message);
  io.to(String(recipient._id)).emit("message:new", message);

  await createNotification({
    recipient: recipient._id,
    actor: req.user._id,
    type: "message",
    title: `${req.user.username} sent you a message`,
    body: uploads.length ? "Photo" : req.body.message,
    entityId: match._id,
    io,
  });

  res.status(201).json({
    message: "Message sent",
    data: message,
  });
});

export const markMessagesSeen = asyncHandler(async (req, res) => {
  await findMatchForUser(req.params.matchId, req.user._id);

  await Message.updateMany(
    {
      matchId: req.params.matchId,
      receiverId: req.user._id,
      seenStatus: false,
    },
    {
      $set: {
        seenStatus: true,
      },
    },
  );

  req.app.get("io").to(req.params.matchId).emit("message:seen:update", {
    matchId: req.params.matchId,
    userId: req.user._id,
  });

  res.json({ message: "Messages marked as seen" });
});
