import { useEffect, useState } from "react";
import {
  API_BASE_URL,
  FEATURED_CREATORS_CACHE_TTL,
  FEATURED_FALLBACK_CREATORS,
  resolveFeaturedCreators,
} from "../utils/featuredCreators";

const featuredCreatorCache = {
  data: null,
  expiresAt: 0,
  pending: null,
};

export async function fetchFeaturedCreators(limit = 3) {
  const now = Date.now();

  if (featuredCreatorCache.data && now < featuredCreatorCache.expiresAt) {
    return {
      creators: featuredCreatorCache.data.slice(0, limit),
      source: "cache",
    };
  }

  if (featuredCreatorCache.pending) {
    const pendingResult = await featuredCreatorCache.pending;
    return {
      creators: pendingResult.creators.slice(0, limit),
      source: pendingResult.source,
    };
  }

  featuredCreatorCache.pending = fetch(`${API_BASE_URL}/api/users/featured`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const creators = resolveFeaturedCreators(payload, limit);
      featuredCreatorCache.data = creators;
      featuredCreatorCache.expiresAt = Date.now() + FEATURED_CREATORS_CACHE_TTL;
      return { creators, source: "api" };
    })
    .catch(() => {
      const creators = resolveFeaturedCreators(FEATURED_FALLBACK_CREATORS, limit);
      return { creators, source: "fallback" };
    })
    .finally(() => {
      featuredCreatorCache.pending = null;
    });

  return featuredCreatorCache.pending;
}

export default function useFeaturedCreators(limit = 3) {
  const [creators, setCreators] = useState(() => {
    const hasCachedData =
      featuredCreatorCache.data && Date.now() < featuredCreatorCache.expiresAt;
    return hasCachedData
      ? featuredCreatorCache.data.slice(0, limit)
      : resolveFeaturedCreators(FEATURED_FALLBACK_CREATORS, limit);
  });
  const [loading, setLoading] = useState(() => !featuredCreatorCache.data);
  const [source, setSource] = useState(() =>
    featuredCreatorCache.data ? "cache" : "fallback"
  );

  useEffect(() => {
    let isMounted = true;
    const hasCachedData =
      featuredCreatorCache.data && Date.now() < featuredCreatorCache.expiresAt;

    if (!hasCachedData) {
      setLoading(true);
    }

    fetchFeaturedCreators(limit)
      .then((result) => {
        if (!isMounted) return;
        setCreators(result.creators);
        setSource(result.source);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { creators, loading, source };
}

