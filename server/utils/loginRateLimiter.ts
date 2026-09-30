import { prisma } from './prisma';

export interface RateLimitConfig {
  tier1Attempts: number;       // default: 5
  tier1LockoutMinutes: number; // default: 15
  tier2Attempts: number;       // default: 10
  tier2LockoutMinutes: number; // default: 60
  cooldownMinutes: number;     // default: 15
  enabled: boolean;
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  tier1Attempts: 5,
  tier1LockoutMinutes: 15,
  tier2Attempts: 10,
  tier2LockoutMinutes: 60,
  cooldownMinutes: 15,
  enabled: true,
};

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  ip: string;
  identifier: string;
  eventType: 'failed_attempt' | 'tier1_lockout' | 'tier2_lockout' | 'suspicious_activity' | 'login_success';
  severity: 'warning' | 'danger' | 'info';
  details: string;
}

interface AttemptRecord {
  failedAttempts: number;
  lastAttemptAt: number;
  lockedUntil: number | null;
}

// In-memory store for instantaneous checks (capped size)
const memoryStore = new Map<string, AttemptRecord>();
const MAX_TRACKED_TARGETS = 10_000;

// Periodic cleanup of stale in-memory entries (older than 2 hours)
if (process.env.NODE_ENV !== 'test') {
  const cleanupTimer = setInterval(() => {
    const cutoff = Date.now() - 2 * 60 * 60 * 1000;
    for (const [k, v] of memoryStore.entries()) {
      if (v.lastAttemptAt < cutoff && (!v.lockedUntil || v.lockedUntil < Date.now())) {
        memoryStore.delete(k);
      }
    }
  }, 10 * 60 * 1000);

  if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }
}

/**
 * Retrieves the current rate limit configuration from settings.
 */
export async function getRateLimitConfig(): Promise<RateLimitConfig> {
  try {
    const row = await prisma.settings.findUnique({
      where: { setting_key: 'admin_login_rate_limit_config' },
    });
    if (row?.setting_value) {
      const parsed = JSON.parse(row.setting_value);
      return {
        tier1Attempts: Number(parsed.tier1Attempts) || DEFAULT_RATE_LIMIT_CONFIG.tier1Attempts,
        tier1LockoutMinutes: Number(parsed.tier1LockoutMinutes) || DEFAULT_RATE_LIMIT_CONFIG.tier1LockoutMinutes,
        tier2Attempts: Number(parsed.tier2Attempts) || DEFAULT_RATE_LIMIT_CONFIG.tier2Attempts,
        tier2LockoutMinutes: Number(parsed.tier2LockoutMinutes) || DEFAULT_RATE_LIMIT_CONFIG.tier2LockoutMinutes,
        cooldownMinutes: Number(parsed.cooldownMinutes) || DEFAULT_RATE_LIMIT_CONFIG.cooldownMinutes,
        enabled: parsed.enabled !== false,
      };
    }
  } catch (error) {
    console.error('Failed to parse admin_login_rate_limit_config:', error);
  }
  return { ...DEFAULT_RATE_LIMIT_CONFIG };
}

/**
 * Updates the rate limit configuration in settings.
 */
export async function setRateLimitConfig(config: Partial<RateLimitConfig>): Promise<RateLimitConfig> {
  const current = await getRateLimitConfig();
  const updated: RateLimitConfig = {
    tier1Attempts: Math.max(2, Math.min(20, Number(config.tier1Attempts ?? current.tier1Attempts))),
    tier1LockoutMinutes: Math.max(1, Math.min(180, Number(config.tier1LockoutMinutes ?? current.tier1LockoutMinutes))),
    tier2Attempts: Math.max(3, Math.min(50, Number(config.tier2Attempts ?? current.tier2Attempts))),
    tier2LockoutMinutes: Math.max(5, Math.min(1440, Number(config.tier2LockoutMinutes ?? current.tier2LockoutMinutes))),
    cooldownMinutes: Math.max(1, Math.min(180, Number(config.cooldownMinutes ?? current.cooldownMinutes))),
    enabled: config.enabled !== false,
  };

  // Ensure tier 2 attempts is greater than tier 1
  if (updated.tier2Attempts <= updated.tier1Attempts) {
    updated.tier2Attempts = updated.tier1Attempts + 5;
  }

  await prisma.settings.upsert({
    where: { setting_key: 'admin_login_rate_limit_config' },
    update: {
      setting_value: JSON.stringify(updated),
      setting_group: 'security',
      updated_at: new Date(),
    },
    create: {
      setting_key: 'admin_login_rate_limit_config',
      setting_group: 'security',
      setting_value: JSON.stringify(updated),
    },
  });

  return updated;
}

/**
 * Retrieves security logs from the database table (most recent first).
 */
export async function getSecurityLogs(limit = 100): Promise<SecurityLogEntry[]> {
  try {
    const dbLogs = await prisma.security_logs.findMany({
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    return dbLogs.map(l => ({
      id: String(l.id),
      timestamp: l.created_at.toISOString(),
      ip: l.ip_address || 'unknown',
      identifier: l.identifier || 'unknown',
      eventType: (l.action.toLowerCase() as any),
      severity: (l.severity as any) || 'info',
      details: l.details || '',
      deviceType: l.device_type || 'desktop'
    }));
  } catch (error) {
    console.error('Failed to read security_logs table:', error);
    return [];
  }
}

/**
 * Appends a log entry to security logs database table.
 */
export async function logSecurityEvent(
  ip: string,
  identifier: string,
  eventType: SecurityLogEntry['eventType'],
  severity: SecurityLogEntry['severity'],
  details: string,
  userAgent = ''
): Promise<void> {
  try {
    const { detectDeviceType } = await import('./analytics');
    const device = userAgent ? detectDeviceType(userAgent) : 'desktop';

    await prisma.security_logs.create({
      data: {
        action: eventType.toUpperCase(),
        identifier: identifier ? identifier.trim().toLowerCase() : 'unknown',
        ip_address: ip,
        user_agent: userAgent ? userAgent.slice(0, 500) : null,
        device_type: device,
        severity,
        details,
      }
    });
  } catch (err) {
    console.error('Failed to write security log to database:', err);
  }
}

/**
 * Clears security logs from the database table.
 */
export async function clearSecurityLogs(): Promise<void> {
  try {
    await prisma.security_logs.deleteMany();
  } catch (err) {
    console.error('Failed to clear security_logs table:', err);
  }
}

function getRecord(key: string): AttemptRecord {
  let rec = memoryStore.get(key);
  if (!rec) {
    if (memoryStore.size >= MAX_TRACKED_TARGETS) {
      // Evict first key
      const first = memoryStore.keys().next().value;
      if (first) memoryStore.delete(first);
    }
    rec = { failedAttempts: 0, lastAttemptAt: Date.now(), lockedUntil: null };
    memoryStore.set(key, rec);
  }
  return rec;
}

/**
 * Checks if a login attempt is allowed or locked out.
 */
export async function checkLoginAttempt(
  ip: string,
  identifier: string
): Promise<{ allowed: boolean; remainingMinutes?: number; message?: string }> {
  const config = await getRateLimitConfig();
  if (!config.enabled) {
    return { allowed: true };
  }

  const now = Date.now();
  const ipKey = `ip:${ip}`;
  const accKey = `acc:${identifier.toLowerCase().trim()}`;

  const ipRecord = getRecord(ipKey);
  const accRecord = getRecord(accKey);

  // Check cooldown expiration: if no attempts during cooldown period, reset counter
  const cooldownMs = config.cooldownMinutes * 60 * 1000;
  if (ipRecord.failedAttempts > 0 && now - ipRecord.lastAttemptAt > cooldownMs && (!ipRecord.lockedUntil || ipRecord.lockedUntil < now)) {
    ipRecord.failedAttempts = 0;
    ipRecord.lockedUntil = null;
  }
  if (accRecord.failedAttempts > 0 && now - accRecord.lastAttemptAt > cooldownMs && (!accRecord.lockedUntil || accRecord.lockedUntil < now)) {
    accRecord.failedAttempts = 0;
    accRecord.lockedUntil = null;
  }

  // Check lockouts
  const activeLock = Math.max(
    ipRecord.lockedUntil && ipRecord.lockedUntil > now ? ipRecord.lockedUntil : 0,
    accRecord.lockedUntil && accRecord.lockedUntil > now ? accRecord.lockedUntil : 0
  );

  if (activeLock > now) {
    const remainingMs = activeLock - now;
    const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));

    // Log suspicious attempt while locked
    await logSecurityEvent(
      ip,
      identifier,
      'suspicious_activity',
      'danger',
      `Login attempted while locked out (${remainingMinutes}m remaining)`
    );

    return {
      allowed: false,
      remainingMinutes,
      message: `Too many failed login attempts. Access is locked. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
    };
  }

  return { allowed: true };
}

/**
 * Records a failed login attempt. Updates lockout states and logs security events.
 */
export async function recordFailedLogin(
  ip: string,
  identifier: string
): Promise<{ isLocked: boolean; remainingMinutes?: number; message?: string }> {
  const config = await getRateLimitConfig();
  const now = Date.now();
  const ipKey = `ip:${ip}`;
  const accKey = `acc:${identifier.toLowerCase().trim()}`;

  const ipRecord = getRecord(ipKey);
  const accRecord = getRecord(accKey);

  ipRecord.failedAttempts += 1;
  ipRecord.lastAttemptAt = now;

  accRecord.failedAttempts += 1;
  accRecord.lastAttemptAt = now;

  const maxAttempts = Math.max(ipRecord.failedAttempts, accRecord.failedAttempts);

  // Check Tier 2 lockout (e.g., 10 attempts -> 60 min lockout)
  if (maxAttempts >= config.tier2Attempts) {
    const lockoutMs = config.tier2LockoutMinutes * 60 * 1000;
    const lockedUntil = now + lockoutMs;
    ipRecord.lockedUntil = lockedUntil;
    accRecord.lockedUntil = lockedUntil;

    const remainingMinutes = config.tier2LockoutMinutes;
    await logSecurityEvent(
      ip,
      identifier,
      'tier2_lockout',
      'danger',
      `Account/IP locked out for ${remainingMinutes}m following ${maxAttempts} consecutive failed attempts (Tier 2 limit: ${config.tier2Attempts})`
    );

    return {
      isLocked: true,
      remainingMinutes,
      message: `Account temporarily locked due to repeated failed login attempts. Please try again in ${remainingMinutes} minutes.`,
    };
  }

  // Check Tier 1 lockout (e.g., 5 attempts -> 15 min lockout)
  if (maxAttempts >= config.tier1Attempts) {
    const lockoutMs = config.tier1LockoutMinutes * 60 * 1000;
    const lockedUntil = now + lockoutMs;
    ipRecord.lockedUntil = lockedUntil;
    accRecord.lockedUntil = lockedUntil;

    const remainingMinutes = config.tier1LockoutMinutes;
    await logSecurityEvent(
      ip,
      identifier,
      'tier1_lockout',
      'warning',
      `Account/IP locked out for ${remainingMinutes}m following ${maxAttempts} consecutive failed attempts (Tier 1 limit: ${config.tier1Attempts})`
    );

    return {
      isLocked: true,
      remainingMinutes,
      message: `Too many failed login attempts. Access is locked for ${remainingMinutes} minutes.`,
    };
  }

  // Normal failure before lockout
  await logSecurityEvent(
    ip,
    identifier,
    'failed_attempt',
    'warning',
    `Failed login attempt (${maxAttempts} of ${config.tier1Attempts} before lockout)`
  );

  return { isLocked: false };
}

/**
 * Resets failed attempt counters upon successful login.
 */
export async function recordSuccessfulLogin(ip: string, identifier: string): Promise<void> {
  const ipKey = `ip:${ip}`;
  const accKey = `acc:${identifier.toLowerCase().trim()}`;

  memoryStore.delete(ipKey);
  memoryStore.delete(accKey);

  await logSecurityEvent(
    ip,
    identifier,
    'login_success',
    'info',
    `Successful administrator login from IP ${ip}`
  );
}
