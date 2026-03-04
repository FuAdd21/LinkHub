import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 300, // 5 minutes TTL
  checkperiod: 60, // Check for expired keys every 60 seconds
});

export function getCache(key) {
  const value = cache.get(key);
  if (value) {
    console.log("Cache HIT:", key);
  }
  return value;
}

export function setCache(key, value) {
  console.log("Cache SET:", key);
  return cache.set(key, value);
}

export function delCache(key) {
  return cache.del(key);
}

export function flushCache() {
  return cache.flushAll();
}

export function getCacheStats() {
  return cache.getStats();
}
