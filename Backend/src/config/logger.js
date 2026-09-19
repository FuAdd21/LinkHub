import crypto from "crypto";
import { config } from "./env.js";

// Sensitive field keys to redact from logs
const SENSITIVE_KEYS = new Set([
  "password",
  "newpassword",
  "currentpassword",
  "confirmpassword",
  "token",
  "refreshtoken",
  "jwt",
  "secret",
  "authorization",
  "x-csrf-token",
  "csrf_token",
  "apikey",
  "bottoken",
  "cookie",
]);

/**
 * Deeply redacts sensitive keys from objects before logging
 */
export function sanitize(data, seen = new WeakSet()) {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;

  if (seen.has(data)) return "[Circular]";
  seen.add(data);

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, seen));
  }

  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      clean[key] = sanitize(value, seen);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = config.isProd ? LOG_LEVELS.info : LOG_LEVELS.debug;

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  const cleanMeta = meta ? sanitize(meta) : undefined;

  if (config.isProd) {
    const entry = {
      timestamp,
      level,
      message,
      ...(cleanMeta ? { meta: cleanMeta } : {}),
    };
    return JSON.stringify(entry);
  }

  // Development pretty print
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  if (cleanMeta && Object.keys(cleanMeta).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(cleanMeta)}`;
  }
  return `${prefix} ${message}`;
}

export const logger = {
  debug(message, meta) {
    if (currentLogLevel <= LOG_LEVELS.debug) {
      console.debug(formatMessage("debug", message, meta));
    }
  },
  info(message, meta) {
    if (currentLogLevel <= LOG_LEVELS.info) {
      console.info(formatMessage("info", message, meta));
    }
  },
  warn(message, meta) {
    if (currentLogLevel <= LOG_LEVELS.warn) {
      console.warn(formatMessage("warn", message, meta));
    }
  },
  error(message, meta) {
    if (currentLogLevel <= LOG_LEVELS.error) {
      if (meta instanceof Error) {
        meta = {
          errorMessage: meta.message,
          stack: config.isProd ? undefined : meta.stack,
          code: meta.code,
        };
      }
      console.error(formatMessage("error", message, meta));
    }
  },
};

/**
 * Express middleware for structured HTTP request logging
 */
export function requestLogger(req, res, next) {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  req.id = requestId;
  res.setHeader("X-Request-Id", requestId);

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const statusCode = res.statusCode;

    // Skip verbose logs for health checks unless error
    if (originalUrl === "/health" && statusCode < 400) {
      return;
    }

    const logData = {
      requestId,
      method,
      route: originalUrl,
      status: statusCode,
      durationMs: duration,
      ip: req.ip,
      ...(req.user?.id ? { userId: req.user.id } : {}),
    };

    if (statusCode >= 500) {
      logger.error(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, logData);
    } else if (statusCode >= 400) {
      logger.warn(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, logData);
    } else {
      logger.info(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, logData);
    }
  });

  next();
}
