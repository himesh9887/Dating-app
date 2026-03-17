import express from "express";
import { getDiscover, getMatches, swipeUser } from "../controllers/matchController.js";
import { protect } from "../middleware/auth.js";
import { idParamValidator, swipeValidator } from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router.get("/discover", getDiscover);
router.get("/", getMatches);
router.post("/:id/swipe", idParamValidator, swipeValidator, swipeUser);

export default router;
