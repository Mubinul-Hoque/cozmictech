interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const cache = new Map<string, RateLimitRecord>();

// Run a background cleanup interval to prevent memory leaks from inactive IPs
if (process.env.NODE_ENV !== 'test') {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of cache.entries()) {
      if (now > record.resetTime) {
        cache.delete(key);
      }
    }
  }, 60000);
  
  // Prevent keeping the node process open on exit
  if (interval && typeof interval.unref === 'function') {
    interval.unref();
  }
}

/**
 * Checks if the client IP is rate limited.
 * @param ip IP address of the client
 * @param limit Max number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if rate limited, false otherwise
 */
export function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = cache.get(ip);

  if (!record) {
    cache.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return false;
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return false;
  }

  record.count++;
  return record.count > limit;
}
