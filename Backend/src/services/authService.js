import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";
import { config } from "../config/env.js";
import { emailService } from "./emailService.js";
import { isReservedUsername } from "../utils/reservedUsernames.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export const authService = {
  validatePassword(password) {
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  },

  async generateUniqueUsername(name, email) {
    const base = (
      (name || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "") ||
      (email || "").split("@")[0].replace(/[^a-z0-9]/g, "")
    ).slice(0, 20) || "user";

    let candidate = base;
    let counter = 1;

    while (isReservedUsername(candidate) || (await userRepository.isUsernameTaken(candidate))) {
      candidate = `${base}${counter++}`.slice(0, 30);
    }

    return candidate;
  },

  async registerUser({ name, email, password, phone }) {
    if (!name || !email || !password) {
      throw AppError.badRequest(
        "Name, email and password are required",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw AppError.badRequest(
        "Please enter a valid email address",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const passwordError = this.validatePassword(password);
    if (passwordError) {
      throw AppError.badRequest(passwordError, ErrorCodes.VALIDATION_ERROR);
    }

    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw AppError.conflict(
        "An account with this email already exists",
        ErrorCodes.DUPLICATE_EMAIL
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const candidateUsername = await this.generateUniqueUsername(name, normalizedEmail);

    const newUser = await userRepository.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      username: candidateUsername,
    });

    return {
      clientId: newUser.insertId,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
    };
  },

  async loginUser({ email, password }) {
    if (!email || !password) {
      throw AppError.badRequest(
        "Email and password are required",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw AppError.unauthorized(
        "Invalid email or password",
        ErrorCodes.UNAUTHORIZED
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw AppError.unauthorized(
        "Invalid email or password",
        ErrorCodes.UNAUTHORIZED
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        sessionVersion: user.session_version || 1,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const csrfToken = crypto.randomBytes(24).toString("hex");

    return {
      token,
      csrfToken,
      user: {
        userId: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  },

  async forgotPassword(email) {
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      throw AppError.badRequest(
        "A valid email address is required",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await userRepository.findByEmail(cleanEmail);

    if (!user) {
      return null;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await userRepository.setResetToken(user.id, hashedToken, expires);

    const frontendBaseUrl = config.cors.frontendUrl || "http://localhost:5173";
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail({ to: user.email, resetUrl });

    return {
      userId: user.id,
      email: user.email,
      resetToken,
    };
  },

  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword) {
      throw AppError.badRequest(
        "Reset token and new password are required",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const passwordError = this.validatePassword(newPassword);
    if (passwordError) {
      throw AppError.badRequest(passwordError, ErrorCodes.VALIDATION_ERROR);
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(String(token).trim())
      .digest("hex");

    const user = await userRepository.findByValidResetToken(hashedToken);
    if (!user) {
      throw AppError.badRequest(
        "Reset token is invalid or has expired",
        ErrorCodes.INVALID_RESET_TOKEN
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    return { userId: user.id };
  },
};
