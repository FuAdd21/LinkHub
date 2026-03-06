import mysql from "mysql2/promise";
import "dotenv/config";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "appusers",
  password: process.env.DB_PASSWORD || "123mine",
  database: process.env.DB_NAME || "clientinfo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const initDatabase = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL!");

    // Create links table with all columns if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(512) NOT NULL,
        platform VARCHAR(50) DEFAULT NULL,
        username VARCHAR(100) DEFAULT NULL,
        profileData JSON DEFAULT NULL,
        avatar_url VARCHAR(512) DEFAULT NULL,
        icon VARCHAR(100) DEFAULT NULL,
        position INT DEFAULT 0,
        is_visible TINYINT(1) DEFAULT 1,
        scheduled_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE
      )
    `);

    // Create clicks analytics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clicks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        link_id INT NOT NULL,
        user_id INT NOT NULL,
        ip VARCHAR(45) DEFAULT NULL,
        device VARCHAR(20) DEFAULT 'desktop',
        referrer VARCHAR(512) DEFAULT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
      )
    `);

    // ──── Safe column additions for links table ────
    const linkColumns = [
      ["platform", "VARCHAR(50) DEFAULT NULL"],
      ["username", "VARCHAR(100) DEFAULT NULL"],
      ["profileData", "JSON DEFAULT NULL"],
      ["avatar_url", "VARCHAR(512) DEFAULT NULL"],
      ["icon", "VARCHAR(100) DEFAULT NULL"],
      ["position", "INT DEFAULT 0"],
      ["is_visible", "TINYINT(1) DEFAULT 1"],
      ["scheduled_at", "DATETIME DEFAULT NULL"],
    ];

    for (const [col, type] of linkColumns) {
      try {
        await connection.query(`ALTER TABLE links ADD COLUMN ${col} ${type}`);
      } catch (e) {
        /* column may already exist */
      }
    }

    // ──── Safe column additions for clients table ────
    const clientColumns = [
      ["username", "VARCHAR(50) UNIQUE DEFAULT NULL"],
      ["bio", "TEXT DEFAULT NULL"],
      ["theme", "VARCHAR(50) DEFAULT 'dark-pro'"],
      ["background_type", "VARCHAR(20) DEFAULT 'gradient'"],
      ["background_value", "VARCHAR(255) DEFAULT NULL"],
      ["avatar", "VARCHAR(512) DEFAULT NULL"],
      ["youtubeId", "VARCHAR(100) DEFAULT NULL"],
      ["githubUser", "VARCHAR(100) DEFAULT NULL"],
      ["telegramUser", "VARCHAR(100) DEFAULT NULL"],
      ["instagram", "VARCHAR(100) DEFAULT NULL"],
      ["twitter", "VARCHAR(100) DEFAULT NULL"],
      ["linkedin", "VARCHAR(100) DEFAULT NULL"],
      ["tiktok", "VARCHAR(100) DEFAULT NULL"],
    ];

    for (const [col, type] of clientColumns) {
      try {
        await connection.query(`ALTER TABLE clients ADD COLUMN ${col} ${type}`);
      } catch (e) {
        /* column may already exist */
      }
    }

    connection.release();
    console.log("✅ Database tables ready!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};
