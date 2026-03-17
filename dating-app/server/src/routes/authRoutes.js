import express from "express";
import {
  forgotPassword,
  getCurrentUser,
  googleLogin,
  login,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  googleValidator,
  loginValidator,
  registerValidator,
} from "../utils/validators.js";

const router = express.Router();

router.post("/register", upload.array("profilePhotos", 4), registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/google", googleValidator, googleLogin);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, getCurrentUser);

export default router;
