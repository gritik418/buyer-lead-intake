type RateLimitEntry = {
  count: number;
  lastReset: number;
};

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.lastReset > WINDOW_MS) {
    store.set(key, { count: 1, lastReset: now });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false };
  }

  entry.count += 1;
  return { allowed: true };
}
