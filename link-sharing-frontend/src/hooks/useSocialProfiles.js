import { useState, useEffect } from 'react';
import { fetchSocialProfiles } from '../api/socialApi';

export function useSocialProfiles({ youtubeId, githubUser, telegramUser }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hasAnyId = youtubeId || githubUser || telegramUser;
    
    if (!hasAnyId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchSocialProfiles({ youtubeId, githubUser, telegramUser });
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch social profiles');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [youtubeId, githubUser, telegramUser]);

  return { data, loading, error };
}
