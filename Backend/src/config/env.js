import "dotenv/config";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanVal(raw) {
  if (typeof raw !== "string") return raw;
  const t = raw.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function required(name) {
  const raw = process.env[name];
  const value = cleanVal(raw);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === null || raw === "") return fallback;
  return cleanVal(raw);
}

function optionalInt(name, fallback) {
  const raw = cleanVal(process.env[name]);
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function optionalBool(name, fallback) {
  const raw = cleanVal(process.env[name]);
  if (raw === undefined || raw === null || raw === "") return fallback;
  return raw === "true" || raw === "1" || raw === true;
}

// ─── Environment ──────────────────────────────────────────────────────────────

const NODE_ENV = optional("NODE_ENV", "development");
const isProd = NODE_ENV === "production";
const isTest = NODE_ENV === "test";

// ─── Config Object ────────────────────────────────────────────────────────────

export const config = Object.freeze({
  env: NODE_ENV,
  isProd,
  isTest,

  // Server
  port: optionalInt("PORT", 3002),

  // Database
  db: {
    uri: optional("DATABASE_URL", optional("DB_URI", "")),
    host: optional("DB_HOST", "localhost"),
    port: optionalInt("DB_PORT", 3306),
    user: (process.env.DATABASE_URL || process.env.DB_URI) ? optional("DB_USER", "") : required("DB_USER"),
    password: (process.env.DATABASE_URL || process.env.DB_URI) ? optional("DB_PASSWORD", "") : required("DB_PASSWORD"),
    database: (process.env.DATABASE_URL || process.env.DB_URI) ? optional("DB_NAME", "") : required("DB_NAME"),
    connectionLimit: optionalInt("DB_CONNECTION_LIMIT", 10),
    ssl: optionalBool("DB_SSL", false),
  },

  // JWT
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: optional("JWT_EXPIRES_IN", "7d"),
  },

  // Cookies
  cookie: {
    secure: isProd,
    sameSite: optional("COOKIE_SAME_SITE", isProd ? "none" : "lax"),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // CORS
  cors: {
    frontendUrl: optional("FRONTEND_URL", ""),
    allowedOrigins: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean),
  },

  // Analytics
  analytics: {
    ipSalt: optional("IP_SALT", isProd ? undefined : "linkhub_dev_ip_salt_not_for_production"),
  },

  // External APIs
  youtube: {
    apiKey: optional("YOUTUBE_API_KEY", ""),
  },

  telegram: {
    botToken: optional("TELEGRAM_BOT_TOKEN", ""),
  },

  // SMTP / Email
  smtp: {
    host: optional("SMTP_HOST", ""),
    port: optionalInt("SMTP_PORT", 587),
    secure: optionalBool("SMTP_SECURE", false),
    user: optional("SMTP_USER", ""),
    pass: optional("SMTP_PASS", ""),
    from: optional("EMAIL_FROM", "LinkHub <noreply@linkhub.com>"),
  },

  // Uploads
  uploads: {
    maxFileSize: optionalInt("MAX_UPLOAD_SIZE", 5 * 1024 * 1024), // 5MB
    directory: "uploads",
  },

  // Links
  links: {
    maxPerUser: optionalInt("MAX_LINKS_PER_USER", 50),
  },
});

// ─── Production Guards ────────────────────────────────────────────────────────

if (isProd) {
  if (!config.analytics.ipSalt) {
    throw new Error("CRITICAL: IP_SALT environment variable is required in production");
  }
  if (config.jwt.secret === "your_jwt_secret_key") {
    throw new Error("CRITICAL: JWT_SECRET must be changed from the default value in production");
  }
}
