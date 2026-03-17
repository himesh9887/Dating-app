import express from "express";
import {
  activateBoost,
  blockUser,
  followUser,
  getDiscoverFilters,
  getMe,
  getNearbyUsers,
  getPremiumInsights,
  getProfile,
  getSuggestions,
  searchUsers,
  unfollowUser,
  updateMe,
} from "../controllers/userController.js";
import { protect, requirePremium } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  idParamValidator,
  searchValidator,
  updateProfileValidator,
} from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router.get("/me", getMe);
router.put("/me", upload.array("profilePhotos", 6), updateProfileValidator, updateMe);
router.get("/suggestions", getSuggestions);
router.get("/search", searchValidator, searchUsers);
router.get("/nearby", searchValidator, getNearbyUsers);
router.get("/discover-filters", getDiscoverFilters);
router.get("/premium/likes", requirePremium, getPremiumInsights);
router.post("/me/boost", requirePremium, activateBoost);
router.get("/profile/:username", getProfile);
router.post("/:id/follow", idParamValidator, followUser);
router.delete("/:id/follow", idParamValidator, unfollowUser);
router.post("/:id/block", idParamValidator, blockUser);

export default router;
