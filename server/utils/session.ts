import { prisma } from './prisma';

export const ALLOWED_SESSION_TIMEOUTS = [1, 2, 6, 12, 24] as const;
export type SessionTimeoutHours = typeof ALLOWED_SESSION_TIMEOUTS[number];
export const DEFAULT_SESSION_TIMEOUT_HOURS: SessionTimeoutHours = 2;

/**
 * Retrieves the currently configured admin session auto-logout duration in hours.
 * Defaults to 2 hours if not configured or if the stored value is invalid.
 */
export async function getSessionTimeoutHours(): Promise<SessionTimeoutHours> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { setting_key: 'admin_session_timeout' }
    });

    if (setting?.setting_value) {
      const parsed = parseInt(setting.setting_value, 10);
      if (ALLOWED_SESSION_TIMEOUTS.includes(parsed as SessionTimeoutHours)) {
        return parsed as SessionTimeoutHours;
      }
    }
  } catch (error) {
    console.error('Failed to read admin_session_timeout setting:', error);
  }

  return DEFAULT_SESSION_TIMEOUT_HOURS;
}

/**
 * Updates the admin session auto-logout duration in hours.
 * Validates that the provided hours value is one of the allowed options.
 */
export async function setSessionTimeoutHours(hours: number): Promise<SessionTimeoutHours> {
  if (!ALLOWED_SESSION_TIMEOUTS.includes(hours as SessionTimeoutHours)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid session timeout duration. Must be 1, 2, 6, 12, or 24 hours.'
    });
  }

  const validHours = hours as SessionTimeoutHours;

  await prisma.settings.upsert({
    where: { setting_key: 'admin_session_timeout' },
    update: {
      setting_value: String(validHours),
      setting_group: 'security',
      updated_at: new Date()
    },
    create: {
      setting_key: 'admin_session_timeout',
      setting_group: 'security',
      setting_value: String(validHours)
    }
  });

  await prisma.settings.upsert({
    where: { setting_key: 'admin_session_timeout_hours' },
    update: {
      setting_value: String(validHours),
      setting_group: 'security',
      updated_at: new Date()
    },
    create: {
      setting_key: 'admin_session_timeout_hours',
      setting_group: 'security',
      setting_value: String(validHours)
    }
  });

  return validHours;
}
