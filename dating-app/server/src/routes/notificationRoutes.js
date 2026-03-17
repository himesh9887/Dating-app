import express from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
import { idParamValidator } from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.post("/read-all", markAllNotificationsRead);
router.post("/:id/read", idParamValidator, markNotificationRead);

export default router;
