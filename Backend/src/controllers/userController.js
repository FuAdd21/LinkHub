import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarUploadDir = path.join(__dirname, "../../uploads/avatars");
const bannerUploadDir = path.join(__dirname, "../../uploads/banners");

fs.mkdirSync(avatarUploadDir, { recursive: true });
fs.mkdirSync(bannerUploadDir, { recursive: true });

const SAFE_IMAGE_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const deleteOldFile = (relativePath) => {
  if (!relativePath || typeof relativePath !== "string") return;
  // Ensure path stays within /uploads/ to prevent path traversal
  if (!relativePath.startsWith("/uploads/")) return;
  try {
    const fullPath = path.join(__dirname, "../../", relativePath.replace(/^\//, ""));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.warn("Failed to delete old file:", err.message);
  }
};

const imageOnlyFileFilter = (req, file, cb) => {
  const mime = file.mimetype?.toLowerCase();
  // Strictly whitelist safe raster image formats; reject SVG to prevent stored XSS
  if (!mime || !SAFE_IMAGE_MIME_TYPES[mime]) {
    cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed. SVGs are not permitted."));
    return;
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarUploadDir),
  filename: (req, file, cb) => {
    const ext = SAFE_IMAGE_MIME_TYPES[file.mimetype?.toLowerCase()] || ".png";
    cb(null, `avatar_${crypto.randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: imageOnlyFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bannerUploadDir),
  filename: (req, file, cb) => {
    const ext = SAFE_IMAGE_MIME_TYPES[file.mimetype?.toLowerCase()] || ".png";
    cb(null, `banner_${crypto.randomUUID()}${ext}`);
  },
});

export const uploadBanner = multer({
  storage: bannerStorage,
  fileFilter: imageOnlyFileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});


export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const [existing] = await db.query("SELECT avatar FROM clients WHERE id = ?", [req.user.id]);
    const oldAvatar = existing[0]?.avatar;

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await db.query("UPDATE clients SET avatar = ? WHERE id = ?", [
      avatarPath,
      req.user.id,
    ]);

    if (oldAvatar && oldAvatar !== avatarPath) {
      deleteOldFile(oldAvatar);
    }

    res.json({ avatar: avatarPath });
  } catch (err) {
    console.error("updateAvatar error:", err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

export const removeAvatar = async (req, res) => {
  try {
    const [existing] = await db.query("SELECT avatar FROM clients WHERE id = ?", [req.user.id]);
    const oldAvatar = existing[0]?.avatar;

    await db.query("UPDATE clients SET avatar = NULL WHERE id = ?", [
      req.user.id,
    ]);

    if (oldAvatar) {
      deleteOldFile(oldAvatar);
    }

    res.json({ message: "Avatar removed", avatar: null });
  } catch (err) {
    console.error("removeAvatar error:", err);
    res.status(500).json({ message: "Failed to remove avatar" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const [existing] = await db.query("SELECT banner_url FROM clients WHERE id = ?", [req.user.id]);
    const oldBanner = existing[0]?.banner_url;

    const bannerPath = `/uploads/banners/${req.file.filename}`;

    await db.query("UPDATE clients SET banner_url = ? WHERE id = ?", [
      bannerPath,
      req.user.id,
    ]);

    if (oldBanner && oldBanner !== bannerPath) {
      deleteOldFile(oldBanner);
    }

    res.json({ banner_url: bannerPath });
  } catch (err) {
    console.error("updateBanner error:", err);
    res.status(500).json({ message: "Failed to update banner" });
  }
};

export const updateProfileDetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, username, bio, show_in_search, show_audience_totals, usage_summaries } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name.trim());
    }

    if (username !== undefined) {
      const cleanUsername = username.toLowerCase().trim();
      const usernameRegex = /^[a-z0-9_-]{3,30}$/;
      if (!usernameRegex.test(cleanUsername)) {
        return res.status(400).json({
          message: "Username must be 3-30 characters, lowercase letters, numbers, hyphens or underscores",
        });
      }

      const [existing] = await db.query(
        "SELECT id FROM clients WHERE username = ? AND id != ?",
        [cleanUsername, userId]
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: "Username already taken" });
      }

      updates.push("username = ?");
      values.push(cleanUsername);
    }

    if (bio !== undefined) {
      updates.push("bio = ?");
      values.push(bio);
    }

    if (show_in_search !== undefined) {
      updates.push("show_in_search = ?");
      values.push(show_in_search ? 1 : 0);
    }

    if (show_audience_totals !== undefined) {
      updates.push("show_audience_totals = ?");
      values.push(show_audience_totals ? 1 : 0);
    }

    if (usage_summaries !== undefined) {
      updates.push("usage_summaries = ?");
      values.push(usage_summaries ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId);
    await db.query(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`, values);

    const [updated] = await db.query(
      `SELECT id, name, username, email, bio, avatar, banner_url,
              COALESCE(theme, 'Obsidian') as theme,
              COALESCE(accent_color, '#c6f035') as accent_color,
              COALESCE(surface_color, '#11120F') as surface_color,
              COALESCE(font_heading, 'Manrope / Semibold') as font_heading,
              COALESCE(font_labels, 'IBM Plex Mono / Medium') as font_labels,
              COALESCE(show_verified_badge, 1) as show_verified_badge,
              COALESCE(show_social_row, 1) as show_social_row,
              COALESCE(show_in_search, 1) as show_in_search,
              COALESCE(show_audience_totals, 1) as show_audience_totals,
              COALESCE(usage_summaries, 1) as usage_summaries,
              custom_domain
       FROM clients WHERE id = ?`,
      [userId]
    );

    res.json({ message: "Profile details updated", user: updated[0] });
  } catch (err) {
    console.error("updateProfileDetails error:", err);
    res.status(500).json({ message: "Failed to update profile details" });
  }
};

export const updateSocialProfiles = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token - no user id" });
    }

    const {
      youtubeId,
      githubUser,
      telegramUser,
      instagram,
      twitter,
      linkedin,
      tiktok,
    } = req.body;

    await db.query(
      `UPDATE clients SET youtubeId = ?, githubUser = ?, telegramUser = ?, instagram = ?, twitter = ?, linkedin = ?, tiktok = ? WHERE id = ?`,
      [
        youtubeId || null,
        githubUser || null,
        telegramUser || null,
        instagram || null,
        twitter || null,
        linkedin || null,
        tiktok || null,
        userId,
      ],
    );

    res.json({ message: "Social profiles updated successfully" });
  } catch (err) {
    console.error("updateSocialProfiles error:", err);
    res.status(500).json({ message: "Failed to update social profiles" });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token - no user id" });
    }

    const [results] = await db.query(
      `SELECT id, name, username, email, bio, avatar, banner_url,
              COALESCE(theme, 'Obsidian') as theme,
              COALESCE(accent_color, '#c6f035') as accent_color,
              COALESCE(surface_color, '#11120F') as surface_color,
              COALESCE(font_heading, 'Manrope / Semibold') as font_heading,
              COALESCE(font_labels, 'IBM Plex Mono / Medium') as font_labels,
              COALESCE(show_verified_badge, 1) as show_verified_badge,
              COALESCE(show_social_row, 1) as show_social_row,
              COALESCE(show_in_search, 1) as show_in_search,
              COALESCE(show_audience_totals, 1) as show_audience_totals,
              COALESCE(usage_summaries, 1) as usage_summaries,
              custom_domain, background_type, background_value,
              youtubeId, githubUser, telegramUser, instagram, twitter, linkedin, tiktok
       FROM clients WHERE id = ?`,
      [userId],
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: "New password must contain at least one uppercase letter" });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: "New password must contain at least one number" });
    }

    const [users] = await db.query("SELECT password FROM clients WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE clients SET password = ?, session_version = COALESCE(session_version, 1) + 1 WHERE id = ?",
      [hashedPassword, userId]
    );

    const [updatedUsers] = await db.query(
      "SELECT id, email, session_version FROM clients WHERE id = ?",
      [userId]
    );
    const updatedUser = updatedUsers[0];
    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        sessionVersion: updatedUser.session_version || 1,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({ message: "New email and current password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim().toLowerCase())) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const [users] = await db.query("SELECT password FROM clients WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();
    const [existing] = await db.query("SELECT id FROM clients WHERE email = ? AND id != ?", [normalizedEmail, userId]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "This email is already in use" });
    }

    await db.query("UPDATE clients SET email = ? WHERE id = ?", [normalizedEmail, userId]);

    res.json({ message: "Email updated successfully", email: normalizedEmail });
  } catch (err) {
    console.error("changeEmail error:", err);
    res.status(500).json({ message: "Failed to change email" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    const [users] = await db.query("SELECT password FROM clients WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Delete user — links and clicks cascade via FK
    await db.query("DELETE FROM clients WHERE id = ?", [userId]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
