/**
 * P17 — Improved In-Process Rate Limiter
 * 
 * Uses a sliding window algorithm (more accurate than fixed windows) and
 * includes a bounded Map size to prevent memory exhaustion from unique IPs.
 * 
 * NOTE: This is single-process only. For production multi-worker deployments
 * (PM2 cluster mode, horizontal scaling), replace with a Redis-backed limiter
 * such as ioredis + a sliding window Lua script. The interface is identical so
 * the swap is a one-line change to the implementation.
 */

interface RateLimitEntry {
  /** Timestamps (ms) of each request within the current window */
  timestamps: number[]
  /** When this entry was last accessed — used for LRU eviction */
  lastSeen: number
}

/** Maximum number of IPs to track simultaneously (prevents unbounded growth) */
const MAX_ENTRIES = 10_000

const store = new Map<string, RateLimitEntry>()

// Background cleanup: remove expired entries every 2 minutes
if (process.env.NODE_ENV !== 'test') {
  const interval = setInterval(() => {
    const cutoff = Date.now() - 60_000 * 5 // keep entries that were active in last 5 min
    let evicted = 0
    for (const [key, entry] of store.entries()) {
      if (entry.lastSeen < cutoff) {
        store.delete(key)
        evicted++
      }
    }
    if (evicted > 0 && process.env.NODE_ENV === 'development') {
      console.debug(`[RateLimit] Evicted ${evicted} stale entries. Active: ${store.size}`)
    }
  }, 120_000)

  if (interval && typeof interval.unref === 'function') {
    interval.unref()
  }
}

/**
 * Sliding-window rate limiter.
 * 
 * @param ip       — Client IP address
 * @param limit    — Maximum requests allowed per window
 * @param windowMs — Window duration in milliseconds
 * @returns `true` if the request should be rejected (rate limited)
 */
export function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const cutoff = now - windowMs

  let entry = store.get(ip)

  if (!entry) {
    // Evict oldest entry if we're at the size cap (simple LRU approximation)
    if (store.size >= MAX_ENTRIES) {
      let oldestKey: string | null = null
      let oldestTime = Infinity
      for (const [k, v] of store.entries()) {
        if (v.lastSeen < oldestTime) { oldestTime = v.lastSeen; oldestKey = k }
      }
      if (oldestKey) store.delete(oldestKey)
    }

    entry = { timestamps: [now], lastSeen: now }
    store.set(ip, entry)
    return false
  }

  // Sliding window: drop timestamps older than the window boundary
  entry.timestamps = entry.timestamps.filter(t => t > cutoff)
  entry.timestamps.push(now)
  entry.lastSeen = now

  return entry.timestamps.length > limit
}
