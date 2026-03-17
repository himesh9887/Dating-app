import express from "express";
import {
  commentOnPost,
  createPost,
  createStory,
  getFeed,
  getStories,
  getUserPosts,
  likePost,
  sharePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  commentValidator,
  idParamValidator,
  postValidator,
} from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router.get("/feed", getFeed);
router.post("/", upload.array("media", 4), postValidator, createPost);
router.post("/:id/like", idParamValidator, likePost);
router.post("/:id/comment", idParamValidator, commentValidator, commentOnPost);
router.post("/:id/share", idParamValidator, sharePost);
router.get("/stories/all", getStories);
router.post("/stories", upload.array("media", 1), createStory);
router.get("/user/:username", getUserPosts);

export default router;
