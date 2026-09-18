import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { validate } from "../middleware/validator.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const registerRules = {
  name: { required: true, minLength: 2, label: "Name" },
  email: { required: true, type: "email", label: "Email" },
  password: {
    required: true,
    minLength: 8,
    label: "Password",
    custom: (val) => {
      if (!/[A-Z]/.test(val))
        return "Password must contain at least one uppercase letter";
      if (!/[0-9]/.test(val))
        return "Password must contain at least one number";
      return null;
    },
  },
};

const loginRules = {
  email: { required: true, type: "email", label: "Email" },
  password: { required: true, label: "Password" },
};

const forgotPasswordRules = {
  email: { required: true, type: "email", label: "Email" },
};

const resetPasswordRules = {
  token: { required: true, label: "Reset token" },
  newPassword: {
    required: true,
    minLength: 8,
    label: "New password",
    custom: (val) => {
      if (!/[A-Z]/.test(val))
        return "Password must contain at least one uppercase letter";
      if (!/[0-9]/.test(val))
        return "Password must contain at least one number";
      return null;
    },
  },
};

router.post("/register", authRateLimiter, validate(registerRules), register);
router.post("/login", authRateLimiter, validate(loginRules), login);
router.post("/logout", logout);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordRules), forgotPassword);
router.post("/reset-password", authRateLimiter, validate(resetPasswordRules), resetPassword);

export default router;

