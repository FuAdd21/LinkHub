import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLACEHOLDER_AVATAR = '/placeholder-avatar.png';

export async function getYouTubeChannel(channelId) {
  try {
    if (!channelId) {
      return { platform: 'YouTube', error: 'No channel ID provided' };
    }

    if (!YOUTUBE_API_KEY) {
      return { 
        platform: 'YouTube', 
        name: 'YouTube Channel',
        avatar: PLACEHOLDER_AVATAR,
        subscribers: 0,
        videos: 0,
        views: 0,
        profileUrl: `https://www.youtube.com/channel/${channelId}`,
        error: 'YouTube API key not configured'
      };
    }

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    if (!response.data.items || response.data.items.length === 0) {
      return { platform: 'YouTube', error: 'Channel not found' };
    }

    const channel = response.data.items[0];
    const snippet = channel.snippet;
    const stats = channel.statistics;

    return {
      platform: 'YouTube',
      name: snippet.title,
      avatar: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || PLACEHOLDER_AVATAR,
      subscribers: parseInt(stats.subscriberCount) || 0,
      videos: parseInt(stats.videoCount) || 0,
      views: parseInt(stats.viewCount) || 0,
      profileUrl: `https://www.youtube.com/channel/${channelId}`,
    };
  } catch (error) {
    console.error('YouTube service error:', error.message);
    return {
      platform: 'YouTube',
      name: 'YouTube Channel',
      avatar: PLACEHOLDER_AVATAR,
      subscribers: 0,
      videos: 0,
      views: 0,
      profileUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : null,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}
