import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PLACEHOLDER_AVATAR = '/placeholder-avatar.png';

export async function getTelegramChannel(username) {
  try {
    if (!username) {
      return { platform: 'Telegram', error: 'No username provided' };
    }

    if (!TELEGRAM_BOT_TOKEN) {
      return {
        platform: 'Telegram',
        name: 'Telegram Channel',
        username: username,
        description: null,
        profileUrl: `https://t.me/${username}`,
        error: 'Telegram bot token not configured',
      };
    }

    // Remove @ if present
    const cleanUsername = username.replace(/^@/, '');

    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat`,
      {
        params: {
          chat_id: `@${cleanUsername}`,
        },
      }
    );

    if (!response.data.ok) {
      return {
        platform: 'Telegram',
        name: cleanUsername,
        username: cleanUsername,
        description: null,
        profileUrl: `https://t.me/${cleanUsername}`,
        error: response.data.description || 'Failed to fetch Telegram channel',
      };
    }

    const chat = response.data.result;

    // Telegram doesn't provide avatar directly via this API
    // We'll use a placeholder and could be enhanced with getChatPhoto
    let avatar = PLACEHOLDER_AVATAR;
    if (chat.photo?.big_file_id) {
      try {
        const photoResponse = await axios.get(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile`,
          { params: { file_id: chat.photo.big_file_id } }
        );
        if (photoResponse.data.ok) {
          avatar = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${photoResponse.data.result.file_path}`;
        }
      } catch {
        // Keep placeholder if photo fetch fails
      }
    }

    return {
      platform: 'Telegram',
      name: chat.title || chat.first_name || cleanUsername,
      username: chat.username || cleanUsername,
      description: chat.description || null,
      profileUrl: `https://t.me/${chat.username || cleanUsername}`,
      avatar,
    };
  } catch (error) {
    console.error('Telegram service error:', error.message);
    return {
      platform: 'Telegram',
      name: username.replace(/^@/, ''),
      username: username.replace(/^@/, ''),
      description: null,
      profileUrl: username ? `https://t.me/${username.replace(/^@/, '')}` : null,
      avatar: PLACEHOLDER_AVATAR,
      error: error.response?.data?.description || error.message,
    };
  }
}
