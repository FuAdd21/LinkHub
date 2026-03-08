import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardSnapshot,
  readDashboardSnapshot,
  writeDashboardSnapshot,
} from "../api/dashboardApi";

function updateSnapshotWith(currentSnapshot, updater) {
  const nextSnapshot =
    typeof updater === "function" ? updater(currentSnapshot) : updater;

  writeDashboardSnapshot(nextSnapshot);
  return nextSnapshot;
}

export default function useDashboardData() {
  const [snapshot, setSnapshot] = useState(() => readDashboardSnapshot());
  const [loading, setLoading] = useState(() => !readDashboardSnapshot());
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextSnapshot = await fetchDashboardSnapshot({ force: true });
      setSnapshot(nextSnapshot);
      return nextSnapshot;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (snapshot) {
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchDashboardSnapshot()
      .then((nextSnapshot) => {
        if (!cancelled) {
          setSnapshot(nextSnapshot);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [snapshot]);

  const mutate = useCallback((updater) => {
    setSnapshot((currentSnapshot) =>
      updateSnapshotWith(currentSnapshot, updater),
    );
  }, []);

  const updateUser = useCallback((userUpdater) => {
    mutate((currentSnapshot) => ({
      ...currentSnapshot,
      user:
        typeof userUpdater === "function"
          ? userUpdater(currentSnapshot?.user)
          : userUpdater,
    }));
  }, [mutate]);

  const updateLinks = useCallback((linksUpdater) => {
    mutate((currentSnapshot) => ({
      ...currentSnapshot,
      links:
        typeof linksUpdater === "function"
          ? linksUpdater(currentSnapshot?.links ?? [])
          : linksUpdater,
    }));
  }, [mutate]);

  const updateAnalytics = useCallback((analyticsUpdater) => {
    mutate((currentSnapshot) => ({
      ...currentSnapshot,
      analytics:
        typeof analyticsUpdater === "function"
          ? analyticsUpdater(currentSnapshot?.analytics)
          : analyticsUpdater,
    }));
  }, [mutate]);

  return {
    snapshot,
    loading,
    error,
    refresh,
    mutate,
    updateUser,
    updateLinks,
    updateAnalytics,
  };
}
