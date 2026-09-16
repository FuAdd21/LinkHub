import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarUploadDir = path.join(__dirname, "../../uploads/avatars");
const bannerUploadDir = path.join(__dirname, "../../uploads/banners");

fs.mkdirSync(avatarUploadDir, { recursive: true });
fs.mkdirSync(bannerUploadDir, { recursive: true });

const imageOnlyFileFilter = (req, file, cb) => {
  if (!file.mimetype?.startsWith("image/")) {
    cb(new Error("Only image files are allowed"));
    return;
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarUploadDir),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}${path.extname(file.originalname)}`),
});

export const upload = multer({
  storage,
  fileFilter: imageOnlyFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bannerUploadDir),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}${path.extname(file.originalname)}`),
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

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await db.query("UPDATE clients SET avatar = ? WHERE id = ?", [
      avatarPath,
      req.user.id,
    ]);

    res.json({ avatar: avatarPath });
  } catch (err) {
    console.error("updateAvatar error:", err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bannerPath = `/uploads/banners/${req.file.filename}`;

    await db.query("UPDATE clients SET banner_url = ? WHERE id = ?", [
      bannerPath,
      req.user.id,
    ]);

    res.json({ banner_url: bannerPath });
  } catch (err) {
    console.error("updateBanner error:", err);
    res.status(500).json({ message: "Failed to update banner" });
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
      `SELECT id, name, username, email, bio, avatar, banner_url, theme, background_type, background_value,
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
    await db.query("UPDATE clients SET password = ? WHERE id = ?", [hashedPassword, userId]);

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
