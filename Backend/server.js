import "dotenv/config";
import { app } from "./src/app.js";
import { initDatabase, db } from "./src/config/db.js";
import { logger } from "./src/config/logger.js";
import { config } from "./src/config/env.js";

const PORT = config.port || 3002;

// Start server
export const startServer = async () => {
  try {
    await initDatabase();

    const server = app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT} in ${config.nodeEnv} mode`);
    });

    let isShuttingDown = false;

    const shutdown = async (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;
      logger.info(`[Shutdown] ${signal} signal received. Initiating graceful shutdown...`);

      // Set timeout for forcing termination if connections fail to drain
      const forceExitTimer = setTimeout(() => {
        logger.error("[Shutdown] Forcefully terminating process after 10s timeout.");
        process.exit(1);
      }, 10000);
      forceExitTimer.unref();

      server.close(async (err) => {
        if (err) {
          logger.error(`[Shutdown] Error closing HTTP server: ${err.message}`, err);
        } else {
          logger.info("[Shutdown] HTTP server closed to new connections.");
        }

        try {
          await db.end();
          logger.info("[Shutdown] MySQL connection pool successfully closed.");
        } catch (dbErr) {
          logger.error(`[Shutdown] Error closing MySQL pool: ${dbErr.message}`, dbErr);
        }

        clearTimeout(forceExitTimer);
        logger.info("[Shutdown] Clean shutdown completed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    return server;
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

export { app };

const isMainModule =
  process.argv[1] &&
  (process.argv[1].endsWith("server.js") || process.argv[1].endsWith("server"));

if (isMainModule) {
  startServer();
}
