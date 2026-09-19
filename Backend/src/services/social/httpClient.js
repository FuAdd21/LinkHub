import axios from "axios";
import { logger } from "../../config/logger.js";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
];

function getRandomUserAgent() {
  const idx = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[idx];
}

/**
 * Robust HTTP client for social profile scrapers/APIs with timeout and single retry
 */
export async function socialFetch(url, options = {}) {
  const maxRetries = options.retries !== undefined ? options.retries : 1;
  const timeout = options.timeout || 8000;

  const headers = {
    "User-Agent": getRandomUserAgent(),
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    ...(options.headers || {}),
  };

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await axios.get(url, {
        timeout,
        headers,
        validateStatus: (status) => status < 500, // Handle 404/403 without throw
      });
      return response;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        logger.warn(`socialFetch failed for ${url} after ${attempt} attempts: ${err.message}`);
        throw err;
      }
      // Exponential backoff
      await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt - 1)));
    }
  }
}
