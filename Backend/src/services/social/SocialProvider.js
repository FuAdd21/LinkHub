import { AppError } from "../../errors/AppError.js";
import { ErrorCodes } from "../../errors/errorCodes.js";

export class SocialProvider {
  /**
   * @param {string} key - Unique provider key e.g. 'github', 'youtube'
   * @param {object} meta - Provider metadata
   */
  constructor(key, meta) {
    this.key = key;
    this.meta = meta;
  }

  getMetadata() {
    return this.meta;
  }

  validateHandle(handle) {
    if (!handle || typeof handle !== "string" || handle.trim().length === 0) {
      throw AppError.badRequest(`Invalid handle for ${this.meta.name}`, ErrorCodes.VALIDATION_ERROR);
    }
    return handle.trim();
  }

  /**
   * Abstract method: override in concrete provider
   * @param {string} handleOrUrl
   * @returns {Promise<object>}
   */
  async fetchProfile(handleOrUrl) {
    throw new Error(`fetchProfile not implemented for ${this.key}`);
  }

  /**
   * Normalizes profile metric payload into a consistent shape
   */
  normalizeResponse({
    handle,
    name,
    avatar = null,
    followers = 0,
    formattedFollowers = null,
    profileUrl = "",
    videos = 0,
    repos = 0,
    status = "connected",
    lastSyncedAt = new Date().toISOString(),
  }) {
    return {
      provider: this.key,
      handle,
      name: name || handle,
      avatar,
      followers: Number(followers) || 0,
      formattedFollowers: formattedFollowers || this.formatMetricCount(followers),
      profileUrl,
      videos: Number(videos) || 0,
      repos: Number(repos) || 0,
      label: this.meta.label || "FOLLOWERS",
      status,
      lastSyncedAt,
    };
  }

  formatMetricCount(num) {
    const n = Number(num) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  }
}
