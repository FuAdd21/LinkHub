import "dotenv/config";
import { app } from "./src/app.js";
import { initDatabase } from "./src/config/db.js";

const PORT = process.env.PORT || 3002;

// Start server
export const startServer = async () => {
  try {
    await initDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down server...`);
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
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
