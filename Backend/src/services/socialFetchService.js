import https from 'https';
import http from 'http';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Linkhub/1.0',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

function extractUsername(url, platform) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
    
    switch (platform) {
      case 'instagram':
        return pathname.split('/')[0];
      case 'tiktok':
        const tiktokMatch = url.match(/@([a-zA-Z0-9_.]+)/);
        return tiktokMatch ? tiktokMatch[1] : pathname;
      case 'twitter':
      case 'x':
        return pathname.split('/')[0];
      case 'youtube':
        if (pathname.includes('/@')) {
          return pathname.replace('@', '');
        }
        if (pathname.includes('/channel/')) {
          return pathname.replace('channel/', '');
        }
        return pathname;
      case 'github':
        return pathname.split('/')[0];
      case 'linkedin':
        const linkedinMatch = url.match(/in\/([a-zA-Z0-9_-]+)/);
        return linkedinMatch ? linkedinMatch[1] : pathname;
      default:
        return pathname;
    }
  } catch {
    return null;
  }
}

export async function fetchSocialProfile(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    let platform = null;
    let username = null;
    let avatar = null;
    let displayName = null;
    
    // Detect platform
    if (hostname.includes('instagram.com')) {
      platform = 'instagram';
      username = extractUsername(url, 'instagram');
      // Try to get avatar from Instagram (limited without API)
      avatar = null;
    } else if (hostname.includes('tiktok.com')) {
      platform = 'tiktok';
      username = extractUsername(url, 'tiktok');
    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      platform = 'youtube';
      username = extractUsername(url, 'youtube');
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      platform = 'twitter';
      username = extractUsername(url, 'twitter');
    } else if (hostname.includes('linkedin.com')) {
      platform = 'linkedin';
      username = extractUsername(url, 'linkedin');
    } else if (hostname.includes('github.com')) {
      platform = 'github';
      username = extractUsername(url, 'github');
      
      // Fetch from GitHub API
      try {
        const githubData = await httpsGet(`https://api.github.com/users/${username}`);
        if (githubData && !githubData.message) {
          avatar = githubData.avatar_url;
          displayName = githubData.name || githubData.login;
        }
      } catch (e) {
        console.log('GitHub API error:', e.message);
      }
    }
    
    if (!platform) {
      return { success: false, error: 'Unsupported platform' };
    }
    
    return {
      success: true,
      platform,
      username,
      avatar,
      displayName,
      profileUrl: url
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('tiktok.com')) return 'tiktok';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('github.com')) return 'github';
    
    return null;
  } catch {
    return null;
  }
}

export function extractUsernameFromUrl(url, platform) {
  return extractUsername(url, platform);
}
