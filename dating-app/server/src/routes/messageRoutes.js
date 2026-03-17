import express from "express";
import {
  getConversations,
  getMessages,
  markMessagesSeen,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { matchParamValidator, messageValidator } from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", getConversations);
router.get("/:matchId", matchParamValidator, getMessages);
router.post(
  "/:matchId",
  matchParamValidator,
  upload.array("media", 1),
  messageValidator,
  sendMessage,
);
router.post("/:matchId/seen", matchParamValidator, markMessagesSeen);

export default router;
