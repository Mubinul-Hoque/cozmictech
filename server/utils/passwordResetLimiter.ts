const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

interface Record_ {
  count: number
  windowStart: number
}

const store = new Map<string, Record_>()
const MAX_TRACKED = 10_000

if (process.env.NODE_ENV !== 'test') {
  const timer = setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS
    for (const [key, rec] of store.entries()) {
      if (rec.windowStart < cutoff) store.delete(key)
    }
  }, 10 * 60 * 1000)
  if (timer && typeof timer.unref === 'function') timer.unref()
}

/**
 * Checks and records an attempt for a given key (IP, or IP+email).
 * Returns false once more than MAX_ATTEMPTS have occurred within WINDOW_MS.
 */
export function checkAndRecordAttempt(key: string): boolean {
  const now = Date.now()

  if (store.size >= MAX_TRACKED && !store.has(key)) {
    const first = store.keys().next().value
    if (first) store.delete(first)
  }

  let rec = store.get(key)
  if (!rec || now - rec.windowStart > WINDOW_MS) {
    rec = { count: 0, windowStart: now }
    store.set(key, rec)
  }

  rec.count += 1
  return rec.count <= MAX_ATTEMPTS
}
