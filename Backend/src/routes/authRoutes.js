import express from "express";
const router = express.Router();
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { validate } from "../middleware/validator.js";

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

router.post("/register", validate(registerRules), register);
router.post("/login", validate(loginRules), login);
router.post("/forgot-password", validate(forgotPasswordRules), forgotPassword);
router.post("/reset-password", validate(resetPasswordRules), resetPassword);
router.post("/api/forgot-password", validate(forgotPasswordRules), forgotPassword);
router.post("/api/reset-password", validate(resetPasswordRules), resetPassword);

export default router;
