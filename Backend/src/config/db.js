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

    // Create links table with new columns if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(512) NOT NULL,
        platform VARCHAR(50) DEFAULT NULL,
        username VARCHAR(100) DEFAULT NULL,
        profileData JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE
      )
    `);

    // Add missing columns to existing table
    try {
      await connection.query(
        `ALTER TABLE links ADD COLUMN platform VARCHAR(50) DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }
    try {
      await connection.query(
        `ALTER TABLE links ADD COLUMN username VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }
    try {
      await connection.query(
        `ALTER TABLE links ADD COLUMN profileData JSON DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }
    try {
      await connection.query(
        `ALTER TABLE links ADD COLUMN avatar_url VARCHAR(512) DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }

    // Create users table with social ID fields if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(512) DEFAULT NULL,
        youtubeId VARCHAR(100) DEFAULT NULL,
        githubUser VARCHAR(100) DEFAULT NULL,
        telegramUser VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add social ID columns to existing users table (if it exists as 'clients')
    try {
      await connection.query(
        `ALTER TABLE users ADD COLUMN youtubeId VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }
    try {
      await connection.query(
        `ALTER TABLE users ADD COLUMN githubUser VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }
    try {
      await connection.query(
        `ALTER TABLE users ADD COLUMN telegramUser VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* column may already exist */
    }

    // Handle table name compatibility (clients vs users)
    try {
      await connection.query(
        `ALTER TABLE clients ADD COLUMN youtubeId VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* table may not exist or column already exists */
    }
    try {
      await connection.query(
        `ALTER TABLE clients ADD COLUMN githubUser VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* table may not exist or column already exists */
    }
    try {
      await connection.query(
        `ALTER TABLE clients ADD COLUMN telegramUser VARCHAR(100) DEFAULT NULL`,
      );
    } catch (e) {
      /* table may not exist or column already exists */
    }

    connection.release();
    console.log("✅ Database tables ready!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

// export { db, initDatabase };
