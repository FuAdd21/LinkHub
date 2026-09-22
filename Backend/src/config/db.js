import mysql from "mysql2/promise";
import { config } from "./env.js";
import { runMigrations } from "../../migrations/runner.js";
import { logger } from "./logger.js";

const poolConfig = config.db.uri
  ? config.db.uri
  : {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      ssl: config.db.ssl
        ? {
            minVersion: "TLSv1.2",
            rejectUnauthorized: true,
          }
        : undefined,
    };

export const db = mysql.createPool(poolConfig);

export const initDatabase = async () => {
  let connection;
  try {
    connection = await db.getConnection();
    logger.info("Connected to MySQL database.");
    await runMigrations(db);
    logger.info("Database schema and migrations verified.");
  } catch (err) {
    logger.error(`Database initialization failed: ${err.message}`, err);
    throw err;
  } finally {
    connection?.release();
  }
};
