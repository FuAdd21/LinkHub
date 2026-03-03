import axios from 'axios';

const PLACEHOLDER_AVATAR = '/placeholder-avatar.png';

export async function getGitHubUser(username) {
  try {
    if (!username) {
      return { platform: 'GitHub', error: 'No username provided' };
    }

    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Linkhub/1.0',
      },
    });

    if (response.data.message) {
      return { platform: 'GitHub', error: response.data.message };
    }

    const user = response.data;

    return {
      platform: 'GitHub',
      name: user.name || user.login,
      avatar: user.avatar_url || PLACEHOLDER_AVATAR,
      followers: user.followers || 0,
      following: user.following || 0,
      repos: user.public_repos || 0,
      bio: user.bio || null,
      profileUrl: user.html_url,
    };
  } catch (error) {
    console.error('GitHub service error:', error.message);
    return {
      platform: 'GitHub',
      name: username,
      avatar: PLACEHOLDER_AVATAR,
      followers: 0,
      following: 0,
      repos: 0,
      bio: null,
      profileUrl: username ? `https://github.com/${username}` : null,
      error: error.response?.data?.message || error.message,
    };
  }
}
