import axios from "axios";
import { formatFollowerCount } from "./youtubeService.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

export function cleanTelegramHandle(input) {
  if (!input) return "";
  let str = input.trim();
  if (str.includes("t.me/")) {
    const match = str.match(/t\.me\/(?:s\/)?([a-zA-Z0-9_]+)/i);
    if (match) return match[1];
  }
  return str.replace(/^@/, "").split("/")[0].split("?")[0];
}

function parseTelegramSubscribers(text) {
  if (!text) return 0;
  const clean = text.toLowerCase().replace(/(?:subscribers|members|subscribers?|members?)/g, "").trim();

  if (clean.includes("k")) {
    const num = parseFloat(clean.replace("k", "").trim());
    return Math.round(num * 1000);
  }
  if (clean.includes("m")) {
    const num = parseFloat(clean.replace("m", "").trim());
    return Math.round(num * 1000000);
  }

  // Remove spaces like "9 516 594"
  const digits = clean.replace(/\s+/g, "").replace(/,/g, "");
  const parsed = parseInt(digits, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export async function getTelegramProfile(input) {
  const handle = cleanTelegramHandle(input);
  if (!handle) {
    throw AppError.badRequest("Please provide a valid Telegram username or channel link", ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const targetUrl = `https://t.me/${handle}`;
    const res = await axios.get(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 8000,
    });

    const html = res.data;
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const extraMatch = html.match(/<div class="tgme_page_extra">([^<]+)<\/div>/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : handle;
    const isGenericContact = title.startsWith("Telegram: Contact @") && !extraMatch && !descMatch;

    if (isGenericContact) {
      throw AppError.badRequest(
        `Telegram channel or public account '@${handle}' was not found. Please verify the handle.`,
        ErrorCodes.NOT_FOUND
      );
    }

    const rawExtra = extraMatch ? extraMatch[1] : null;
    const followers = parseTelegramSubscribers(rawExtra);
    const avatar =
      imageMatch && !imageMatch[1].includes("telegram.org/img/t_logo")
        ? imageMatch[1]
        : PLACEHOLDER_AVATAR;

    return {
      platform: "Telegram",
      handle: `@${handle}`,
      name: title,
      avatar,
      followers,
      formattedFollowers: formatFollowerCount(followers),
      description: descMatch ? descMatch[1] : null,
      profileUrl: `https://t.me/${handle}`,
      label: rawExtra && rawExtra.toLowerCase().includes("member") ? "MEMBERS" : "SUBSCRIBERS",
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.response?.status === 404) {
      throw AppError.badRequest(
        `Telegram account or channel '@${handle}' does not exist.`,
        ErrorCodes.NOT_FOUND
      );
    }
    throw AppError.badRequest(
      `Failed to verify Telegram handle '@${handle}': ${error.message}`,
      ErrorCodes.VALIDATION_ERROR
    );
  }
}
