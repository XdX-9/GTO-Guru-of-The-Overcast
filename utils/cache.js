const cache = new Map();

export const getCache = (key, ttl = 10 * 60 * 1000) => {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < ttl) {
    return item.data;
  }
  return null;
};

export const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};
