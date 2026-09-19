import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../src/config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Splits SQL text into individual executable statements,
 * correctly handling single and multi-line comments.
 */
export function parseSqlStatements(sql) {
  return sql
    .replace(/--.*$/gm, "") // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);
}

/**
 * Runs all pending .sql migrations in alphabetical order
 * @param {import('mysql2/promise').Pool} pool
 */
export async function runMigrations(pool) {
  let connection;
  try {
    connection = await pool.getConnection();

    // Ensure _migrations ledger table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Fetch applied migrations
    const [rows] = await connection.query("SELECT name FROM _migrations");
    const appliedSet = new Set(rows.map((r) => r.name));

    // Read migration files in directory
    const files = await fs.readdir(__dirname);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    let appliedCount = 0;

    for (const file of sqlFiles) {
      if (appliedSet.has(file)) {
        continue;
      }

      logger.info(`[Migrations] Applying migration: ${file}`);
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, "utf-8");
      const statements = parseSqlStatements(content);

      for (const statement of statements) {
        try {
          await connection.query(statement);
        } catch (err) {
          // If a table, column, or index already existed from legacy bootstrap, continue safely
          if (
            err.code === "ER_TABLE_EXISTS_ERROR" ||
            err.code === "ER_DUP_KEYNAME" ||
            err.code === "ER_DUP_FIELDNAME" ||
            err.errno === 1060 ||
            err.errno === 1061
          ) {
            continue;
          }
          throw new Error(
            `Migration failed in ${file} on statement: "${statement.slice(0, 100)}..." -> ${err.message}`
          );
        }
      }

      await connection.query("INSERT INTO _migrations (name) VALUES (?)", [file]);
      logger.info(`[Migrations] Successfully applied: ${file}`);
      appliedCount++;
    }

    if (appliedCount > 0) {
      logger.info(`[Migrations] ${appliedCount} migration(s) applied successfully.`);
    } else {
      logger.debug("[Migrations] Database is up to date.");
    }
  } catch (err) {
    logger.error("[Migrations] Migration runner error:", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
}

// CLI execution support
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  import("../src/config/env.js").then(async ({ config }) => {
    const mysql = (await import("mysql2/promise")).default;
    const pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 2,
    });
    try {
      await runMigrations(pool);
      await pool.end();
      process.exit(0);
    } catch (err) {
      logger.error("CLI Migration execution failed:", err);
      process.exit(1);
    }
  });
}
