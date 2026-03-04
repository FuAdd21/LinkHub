import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

function extractTelegramUsername(input) {
  if (!input) return null;

  // Extract from t.me URL
  if (input.includes("t.me/")) {
    const match = input.match(/t\.me\/([a-zA-Z0-9_]+)/);
    if (match) return match[1];
  }

  // Remove @ if present
  return input.replace(/^@/, "");
}

export async function getTelegramChannel(input) {
  try {
    if (!input) {
      return { platform: "Telegram", error: "No username or URL provided" };
    }

    if (!TELEGRAM_BOT_TOKEN) {
      console.warn("Telegram bot token not configured");
      const cleanUsername = extractTelegramUsername(input);
      return {
        platform: "Telegram",
        name: "Telegram Channel",
        username: cleanUsername,
        description: null,
        members: 0,
        profileUrl: cleanUsername ? `https://t.me/${cleanUsername}` : null,
        avatar: PLACEHOLDER_AVATAR,
        error: "Telegram bot token not configured",
      };
    }

    // Extract username from URL or clean @username
    const cleanUsername = extractTelegramUsername(input);
    if (!cleanUsername) {
      return {
        platform: "Telegram",
        error: "Invalid Telegram username or URL",
      };
    }

    // Get chat info
    const chatResponse = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat`,
      { params: { chat_id: `@${cleanUsername}` } },
    );

    if (!chatResponse.data.ok) {
      return {
        platform: "Telegram",
        name: cleanUsername,
        username: cleanUsername,
        description: null,
        members: 0,
        profileUrl: `https://t.me/${cleanUsername}`,
        avatar: PLACEHOLDER_AVATAR,
        error: "Channel not found or bot not added as admin",
      };
    }

    const chat = chatResponse.data.result;

    // Get member count
    let members = 0;
    try {
      const memberCountResponse = await axios.get(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMemberCount`,
        { params: { chat_id: `@${cleanUsername}` } },
      );
      if (memberCountResponse.data.ok) {
        members = memberCountResponse.data.result;
      }
    } catch (error) {
      console.warn("Failed to get Telegram member count:", error.message);
      // Member count is optional, continue without it
    }

    // Get avatar if available
    let avatar = PLACEHOLDER_AVATAR;
    if (chat.photo?.big_file_id) {
      try {
        const photoResponse = await axios.get(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile`,
          { params: { file_id: chat.photo.big_file_id } },
        );
        if (photoResponse.data.ok) {
          avatar = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${photoResponse.data.result.file_path}`;
        }
      } catch {
        // Keep placeholder if photo fetch fails
      }
    }

    return {
      platform: "Telegram",
      name: chat.title || chat.first_name || cleanUsername,
      username: chat.username || cleanUsername,
      description: chat.description || null,
      members,
      profileUrl: `https://t.me/${chat.username || cleanUsername}`,
      avatar,
    };
  } catch (error) {
    console.error("Telegram service error:", error.message);

    // Handle specific Telegram bot permission errors
    if (error.response?.data?.error_code === 400) {
      const cleanUsername = extractTelegramUsername(input);
      return {
        platform: "Telegram",
        name: cleanUsername,
        username: cleanUsername,
        description: null,
        members: 0,
        profileUrl: cleanUsername ? `https://t.me/${cleanUsername}` : null,
        avatar: PLACEHOLDER_AVATAR,
        error: "Bot must be added to channel with proper permissions",
      };
    }

    // Generic error fallback
    const cleanUsername = extractTelegramUsername(input);
    return {
      platform: "Telegram",
      name: cleanUsername,
      username: cleanUsername,
      description: null,
      members: 0,
      profileUrl: cleanUsername ? `https://t.me/${cleanUsername}` : null,
      avatar: PLACEHOLDER_AVATAR,
      error: "Failed to fetch Telegram channel data",
    };
  }
}
