/**
 * In-memory cache layer with TTL and tag/prefix-based invalidation.
 * Provides microsecond reads for high-traffic public profile endpoints
 * with deterministic invalidation on profile mutations.
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a cached value with TTL in seconds (default: 60s)
   */
  set(key, value, ttlSeconds = 60) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get a cached value. Returns null if expired or missing.
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Delete a specific cache key
   */
  del(key) {
    this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a regular expression
   */
  delByPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Store public profile along with reverse lookup index
   */
  setProfile(username, userId, data, ttlSeconds = 60) {
    if (!username) return;
    const lower = String(username).toLowerCase();
    this.set(`profile:${lower}`, data, ttlSeconds);
    if (userId) {
      this.set(`user_id_to_username:${userId}`, lower, ttlSeconds * 10);
    }
  }

  /**
   * Invalidate cache by username
   */
  invalidateProfile(identifier) {
    if (!identifier) return;
    const key = `profile:${String(identifier).toLowerCase()}`;
    this.del(key);
  }

  /**
   * Invalidate cache by user ID using reverse lookup index
   */
  invalidateUser(userId) {
    if (!userId) return;
    const username = this.cache.get(`user_id_to_username:${userId}`)?.value;
    if (username) {
      this.del(`profile:${username.toLowerCase()}`);
    }
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Size of currently stored items
   */
  get size() {
    return this.cache.size;
  }
}

export const profileCache = new MemoryCache();
