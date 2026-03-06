import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../uploads/avatars")),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}${path.extname(file.originalname)}`),
});

export const upload = multer({ storage });

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
    res.status(500).json({ message: "Database update failed" });
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
      ]
    );

    res.json({ message: "Social profiles updated successfully" });
  } catch (err) {
    console.error("updateSocialProfiles error:", err);
    res.status(500).json({ message: "Database error: " + err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token - no user id" });
    }

    const [results] = await db.query(
      `SELECT id, name, username, email, bio, avatar, theme, background_type, background_value,
              youtubeId, githubUser, telegramUser, instagram, twitter, linkedin, tiktok
       FROM clients WHERE id = ?`,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Database error: " + err.message });
  }
};
