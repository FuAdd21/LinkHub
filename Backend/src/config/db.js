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
            rejectUnauthorized: false,
          }
        : undefined,
    };

export const db = mysql.createPool(poolConfig);

export const initDatabase = async () => {
  // If not using a raw URI, ensure the target database exists first
  if (!config.db.uri && config.db.database && config.db.database !== "sys") {
    try {
      const adminConn = await mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        ssl: config.db.ssl ? { minVersion: "TLSv1.2", rejectUnauthorized: false } : undefined,
      });
      await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\`;`);
      await adminConn.end();
    } catch (e) {
      logger.warn(`Auto-creation of database '${config.db.database}' skipped: ${e.message}`);
    }
  }

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
