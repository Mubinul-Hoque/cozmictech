import { prisma } from './prisma';
import { detectDeviceType } from './analytics';

export interface SecurityPolicyConfig {
  sessionTimeoutHours: number;
  rateLimitEnabled: boolean;
  tier1Attempts: number;
  tier1LockoutMinutes: number;
  tier2Attempts: number;
  tier2LockoutMinutes: number;
  cooldownMinutes: number;
  ipBlockingEnabled: boolean;
  requireStrongPasswords: boolean;
  minPasswordLength: number;
}

export const DEFAULT_SECURITY_POLICY: SecurityPolicyConfig = {
  sessionTimeoutHours: 2,
  rateLimitEnabled: true,
  tier1Attempts: 5,
  tier1LockoutMinutes: 15,
  tier2Attempts: 10,
  tier2LockoutMinutes: 60,
  cooldownMinutes: 15,
  ipBlockingEnabled: true,
  requireStrongPasswords: true,
  minPasswordLength: 8,
};

// ─── Security Policies & IP Blocking Cache (30-second TTL) ────────────────────
let blockedIpsCache: Set<string> | null = null;
let blockedIpsCacheTime = 0;
let policiesCache: SecurityPolicyConfig | null = null;
let policiesCacheTime = 0;
const CACHE_TTL_MS = 30_000;

export async function isIpBlocked(ip: string): Promise<boolean> {
  if (!ip) return false;
  const policies = await getSecurityPolicies();
  if (!policies.ipBlockingEnabled) return false;

  const normalizedIp = ip.trim();
  const now = Date.now();
  if (!blockedIpsCache || now - blockedIpsCacheTime > CACHE_TTL_MS) {
    try {
      const records = await prisma.blocked_ips.findMany({ select: { ip_address: true } });
      blockedIpsCache = new Set(records.map(r => r.ip_address.trim()));
      blockedIpsCacheTime = now;
    } catch (e) {
      console.error('Error fetching blocked IPs:', e);
      return false;
    }
  }

  return blockedIpsCache.has(normalizedIp);
}

export function invalidateBlockedIpCache(): void {
  blockedIpsCache = null;
  blockedIpsCacheTime = 0;
  policiesCache = null;
  policiesCacheTime = 0;
}

// ─── Database-Backed Security Policies ───────────────────────────────────────

export async function getSecurityPolicies(): Promise<SecurityPolicyConfig> {
  const now = Date.now();
  if (policiesCache && now - policiesCacheTime < CACHE_TTL_MS) {
    return { ...policiesCache };
  }
  try {
    const rows = await prisma.settings.findMany({
      where: {
        setting_key: {
          in: [
            'admin_session_timeout',
            'admin_session_timeout_hours',
            'admin_rate_limit_enabled',
            'admin_rate_limit_tier1_attempts',
            'admin_rate_limit_tier1_lockout',
            'admin_rate_limit_tier2_attempts',
            'admin_rate_limit_tier2_lockout',
            'admin_rate_limit_cooldown',
            'admin_ip_blocking_enabled',
            'admin_require_strong_passwords',
            'admin_min_password_length',
            'admin_login_rate_limit_config', // backward compatibility fallback
          ],
        },
      },
    });

    const map = new Map<string, string>();
    rows.forEach(r => map.set(r.setting_key, r.setting_value || ''));

    // Check old JSON row if present for fallback
    let oldConfig: any = {};
    if (map.has('admin_login_rate_limit_config')) {
      try {
        oldConfig = JSON.parse(map.get('admin_login_rate_limit_config') || '{}');
      } catch {}
    }

    const sessionHours = Number(map.get('admin_session_timeout_hours')) || Number(map.get('admin_session_timeout')) || 2;
    const rateLimitEnabled = map.has('admin_rate_limit_enabled')
      ? map.get('admin_rate_limit_enabled') === 'true'
      : (oldConfig.enabled !== false);

    const tier1Attempts = Number(map.get('admin_rate_limit_tier1_attempts')) || Number(oldConfig.tier1Attempts) || DEFAULT_SECURITY_POLICY.tier1Attempts;
    const tier1LockoutMinutes = Number(map.get('admin_rate_limit_tier1_lockout')) || Number(oldConfig.tier1LockoutMinutes) || DEFAULT_SECURITY_POLICY.tier1LockoutMinutes;
    const tier2Attempts = Number(map.get('admin_rate_limit_tier2_attempts')) || Number(oldConfig.tier2Attempts) || DEFAULT_SECURITY_POLICY.tier2Attempts;
    const tier2LockoutMinutes = Number(map.get('admin_rate_limit_tier2_lockout')) || Number(oldConfig.tier2LockoutMinutes) || DEFAULT_SECURITY_POLICY.tier2LockoutMinutes;
    const cooldownMinutes = Number(map.get('admin_rate_limit_cooldown')) || Number(oldConfig.cooldownMinutes) || DEFAULT_SECURITY_POLICY.cooldownMinutes;

    const ipBlockingEnabled = map.has('admin_ip_blocking_enabled')
      ? map.get('admin_ip_blocking_enabled') === 'true'
      : true;

    const requireStrongPasswords = map.has('admin_require_strong_passwords')
      ? map.get('admin_require_strong_passwords') === 'true'
      : true;

    const minPasswordLength = Number(map.get('admin_min_password_length')) || DEFAULT_SECURITY_POLICY.minPasswordLength;

    const resolved: SecurityPolicyConfig = {
      sessionTimeoutHours: sessionHours,
      rateLimitEnabled,
      tier1Attempts,
      tier1LockoutMinutes,
      tier2Attempts,
      tier2LockoutMinutes,
      cooldownMinutes,
      ipBlockingEnabled,
      requireStrongPasswords,
      minPasswordLength,
    };

    policiesCache = resolved;
    policiesCacheTime = now;

    return resolved;
  } catch (error) {
    console.error('Error fetching security policies from DB:', error);
    return { ...DEFAULT_SECURITY_POLICY };
  }
}

export async function saveSecurityPolicies(
  policies: Partial<SecurityPolicyConfig>,
  updatedBy: string
): Promise<SecurityPolicyConfig> {
  const current = await getSecurityPolicies();
  const merged: SecurityPolicyConfig = {
    sessionTimeoutHours: Number(policies.sessionTimeoutHours ?? current.sessionTimeoutHours),
    rateLimitEnabled: policies.rateLimitEnabled !== undefined ? Boolean(policies.rateLimitEnabled) : current.rateLimitEnabled,
    tier1Attempts: Math.max(2, Math.min(20, Number(policies.tier1Attempts ?? current.tier1Attempts))),
    tier1LockoutMinutes: Math.max(1, Math.min(180, Number(policies.tier1LockoutMinutes ?? current.tier1LockoutMinutes))),
    tier2Attempts: Math.max(3, Math.min(50, Number(policies.tier2Attempts ?? current.tier2Attempts))),
    tier2LockoutMinutes: Math.max(5, Math.min(1440, Number(policies.tier2LockoutMinutes ?? current.tier2LockoutMinutes))),
    cooldownMinutes: Math.max(1, Math.min(180, Number(policies.cooldownMinutes ?? current.cooldownMinutes))),
    ipBlockingEnabled: policies.ipBlockingEnabled !== undefined ? Boolean(policies.ipBlockingEnabled) : current.ipBlockingEnabled,
    requireStrongPasswords: policies.requireStrongPasswords !== undefined ? Boolean(policies.requireStrongPasswords) : current.requireStrongPasswords,
    minPasswordLength: Math.max(6, Math.min(32, Number(policies.minPasswordLength ?? current.minPasswordLength))),
  };

  if (merged.tier2Attempts <= merged.tier1Attempts) {
    merged.tier2Attempts = merged.tier1Attempts + 5;
  }

  const updates: Record<string, string> = {
    admin_session_timeout_hours: String(merged.sessionTimeoutHours),
    admin_session_timeout: String(merged.sessionTimeoutHours),
    admin_rate_limit_enabled: String(merged.rateLimitEnabled),
    admin_rate_limit_tier1_attempts: String(merged.tier1Attempts),
    admin_rate_limit_tier1_lockout: String(merged.tier1LockoutMinutes),
    admin_rate_limit_tier2_attempts: String(merged.tier2Attempts),
    admin_rate_limit_tier2_lockout: String(merged.tier2LockoutMinutes),
    admin_rate_limit_cooldown: String(merged.cooldownMinutes),
    admin_ip_blocking_enabled: String(merged.ipBlockingEnabled),
    admin_require_strong_passwords: String(merged.requireStrongPasswords),
    admin_min_password_length: String(merged.minPasswordLength),
    // sync backward-compatible JSON blob
    admin_login_rate_limit_config: JSON.stringify({
      enabled: merged.rateLimitEnabled,
      tier1Attempts: merged.tier1Attempts,
      tier1LockoutMinutes: merged.tier1LockoutMinutes,
      tier2Attempts: merged.tier2Attempts,
      tier2LockoutMinutes: merged.tier2LockoutMinutes,
      cooldownMinutes: merged.cooldownMinutes,
    }),
  };

  for (const [key, val] of Object.entries(updates)) {
    await prisma.settings.upsert({
      where: { setting_key: key },
      update: { setting_value: val, setting_group: 'security', updated_at: new Date() },
      create: { setting_key: key, setting_value: val, setting_group: 'security' },
    });
  }

  invalidateBlockedIpCache();

  await logSecurityAudit({
    action: 'SECURITY_POLICY_UPDATE',
    identifier: updatedBy,
    severity: 'warning',
    details: `Security policies updated by ${updatedBy}: Session timeout ${merged.sessionTimeoutHours}h, Rate Limit: ${merged.rateLimitEnabled ? 'ON' : 'OFF'} (Tier 1: ${merged.tier1Attempts} / ${merged.tier1LockoutMinutes}m, Tier 2: ${merged.tier2Attempts} / ${merged.tier2LockoutMinutes}m), IP Blocking: ${merged.ipBlockingEnabled ? 'ON' : 'OFF'}`,
  });

  return merged;
}

// ─── Database-Backed Security Audit Logs ─────────────────────────────────────

export async function logSecurityAudit(options: {
  action: string;
  identifier?: string | null;
  user_id?: number | null;
  ip_address?: string | null;
  user_agent?: string | null;
  device_type?: string | null;
  severity?: 'info' | 'warning' | 'danger' | 'critical';
  details?: string | null;
}): Promise<void> {
  try {
    const ua = options.user_agent || '';
    const device = options.device_type || (ua ? detectDeviceType(ua) : 'desktop');

    await prisma.security_logs.create({
      data: {
        action: options.action.toUpperCase(),
        identifier: options.identifier ? String(options.identifier).slice(0, 150) : null,
        user_id: options.user_id ? Number(options.user_id) : null,
        ip_address: options.ip_address ? String(options.ip_address).slice(0, 100) : null,
        user_agent: ua ? String(ua).slice(0, 500) : null,
        device_type: device ? String(device).slice(0, 50) : 'desktop',
        severity: options.severity || 'info',
        details: options.details ? String(options.details) : null,
      },
    });
  } catch (err) {
    console.error('Failed to write security audit log to database:', err);
  }
}

export async function getSecurityAuditLogs(limit = 100): Promise<any[]> {
  try {
    const logs = await prisma.security_logs.findMany({
      take: Math.min(250, limit),
      orderBy: { created_at: 'desc' },
    });
    return logs;
  } catch (err) {
    console.error('Failed to fetch security audit logs from database:', err);
    return [];
  }
}

export async function clearSecurityAuditLogs(clearedBy: string): Promise<void> {
  await prisma.security_logs.deleteMany();
  await logSecurityAudit({
    action: 'AUDIT_LOGS_CLEARED',
    identifier: clearedBy,
    severity: 'danger',
    details: `Security audit logs were cleared by Super Admin (${clearedBy})`,
  });
}

// ─── IP Blocking Operations ──────────────────────────────────────────────────

export async function blockIpAddress(
  ip: string,
  reason: string,
  blockedBy: string
): Promise<void> {
  const cleanIp = ip.trim();
  if (!cleanIp) throw new Error('IP address is required');

  await prisma.blocked_ips.upsert({
    where: { ip_address: cleanIp },
    update: {
      reason: reason ? reason.trim().slice(0, 255) : 'Blocked due to suspicious activity',
      blocked_by: blockedBy,
      created_at: new Date(),
    },
    create: {
      ip_address: cleanIp,
      reason: reason ? reason.trim().slice(0, 255) : 'Blocked due to suspicious activity',
      blocked_by: blockedBy,
    },
  });

  invalidateBlockedIpCache();

  await logSecurityAudit({
    action: 'IP_BLOCKED',
    identifier: blockedBy,
    ip_address: cleanIp,
    severity: 'danger',
    details: `IP ${cleanIp} was blocked by ${blockedBy}. Reason: ${reason || 'Suspicious activity'}`,
  });
}

export async function unblockIpAddress(
  ip: string,
  unblockedBy: string
): Promise<void> {
  const cleanIp = ip.trim();
  if (!cleanIp) throw new Error('IP address is required');

  await prisma.blocked_ips.deleteMany({
    where: { ip_address: cleanIp },
  });

  invalidateBlockedIpCache();

  await logSecurityAudit({
    action: 'IP_UNBLOCKED',
    identifier: unblockedBy,
    ip_address: cleanIp,
    severity: 'info',
    details: `IP ${cleanIp} was unblocked by ${unblockedBy}`,
  });
}

export async function getBlockedIpList(): Promise<any[]> {
  try {
    const list = await prisma.blocked_ips.findMany({
      orderBy: { created_at: 'desc' },
    });
    return list;
  } catch (err) {
    console.error('Failed to fetch blocked IPs:', err);
    return [];
  }
}
