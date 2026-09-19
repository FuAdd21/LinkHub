/**
 * Reserved usernames that cannot be claimed by users to prevent
 * routing collisions with frontend and backend endpoints.
 */
export const RESERVED_USERNAMES = new Set([
  "about",
  "admin",
  "api",
  "assets",
  "auth",
  "blog",
  "dashboard",
  "docs",
  "explore",
  "health",
  "help",
  "login",
  "null",
  "privacy",
  "profile",
  "r",
  "register",
  "root",
  "search",
  "settings",
  "static",
  "status",
  "support",
  "terms",
  "undefined",
  "uploads",
  "user",
  "users",
]);

/**
 * Checks whether a given candidate username is in the reserved list
 * @param {string} username
 * @returns {boolean}
 */
export function isReservedUsername(username) {
  if (!username) return false;
  return RESERVED_USERNAMES.has(String(username).trim().toLowerCase());
}
