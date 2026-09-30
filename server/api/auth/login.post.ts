import { signJwt } from '../../utils/jwt';
import bcrypt from 'bcrypt';
import { prisma } from '../../utils/prisma';
import { getSessionTimeoutHours } from '../../utils/session';
import {
  checkLoginAttempt,
  recordFailedLogin,
  recordSuccessfulLogin
} from '../../utils/loginRateLimiter';

export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';

  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    });
  }

  const userAgent = getRequestHeader(event, 'user-agent') || '';

  // 1. IP Blocklist Enforcement
  const { isIpBlocked, logSecurityAudit } = await import('../../utils/security');
  if (await isIpBlocked(clientIp)) {
    await logSecurityAudit({
      action: 'BLOCKED_ACCESS_ATTEMPT',
      identifier: email || 'unknown',
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'critical',
      details: `Blocked IP address attempted login`
    });

    throw createError({
      statusCode: 403,
      statusMessage: `Access Denied: Your IP address (${clientIp}) has been blocked by security policies.`,
    });
  }

  // Pre-login Rate-Limit and Lockout Check (per IP and account)
  const lockCheck = await checkLoginAttempt(clientIp, email);
  if (!lockCheck.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: lockCheck.message || 'Too many login attempts. Access is temporarily locked.',
    });
  }

  // Enforce reasonable constraints on email and password length
  if (email.length > 100 || password.length > 72) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input length',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format',
    });
  }

  // Find user by email
  const user = await prisma.users.findFirst({
    where: { email },
  });

  // Verify credentials without revealing whether user exists
  let isMatch = false;
  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    // Perform dummy hash comparison to mitigate timing attacks
    await bcrypt.compare(password, '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGH');
  }

  if (!user || !isMatch) {
    const failResult = await recordFailedLogin(clientIp, email);
    await logSecurityAudit({
      action: 'LOGIN_FAILED',
      identifier: email,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: failResult.isLocked ? 'danger' : 'warning',
      details: failResult.isLocked
        ? `Account/IP locked out for ${failResult.remainingMinutes}m due to repeated invalid credentials`
        : `Failed login attempt with invalid credentials`,
    });

    if (failResult.isLocked) {
      throw createError({
        statusCode: 429,
        statusMessage: failResult.message,
      });
    }

    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  if (user.is_active === false) {
    await logSecurityAudit({
      action: 'LOGIN_FAILED',
      identifier: email,
      user_id: user.id,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'warning',
      details: `Deactivated user account attempted login`,
    });

    throw createError({
      statusCode: 403,
      statusMessage: 'Your account has been deactivated. Please contact an administrator.',
    });
  }

  // Reset failed attempt counters and log successful authentication
  await recordSuccessfulLogin(clientIp, email);
  await logSecurityAudit({
    action: 'LOGIN_SUCCESS',
    identifier: user.username || user.email,
    user_id: user.id,
    ip_address: clientIp,
    user_agent: userAgent,
    severity: 'info',
    details: `Successful ${user.role} login via web portal`,
  });

  // Get configured admin session timeout (in hours)
  const timeoutHours = await getSessionTimeoutHours();

  // Generate JWT token with configured expiration duration
  const token = await signJwt(
    { id: user.id, role: user.role, email: user.email, username: user.username },
    `${timeoutHours}h`
  );

  // Set HTTP-only cookie with matching maxAge
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * timeoutHours,
    path: '/',
  });

  // Fetch full RBAC permissions for the user
  const { getUserRbacProfile } = await import('../../utils/rbac');
  const rbacProfile = await getUserRbacProfile(user.id);

  // Return user without password and session timeout info
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    success: true,
    user: {
      ...userWithoutPassword,
      role: rbacProfile?.role_name || user.role,
      role_id: rbacProfile?.role_id || user.role_id,
      is_super_admin: rbacProfile?.is_super_admin || false,
      permissions: rbacProfile?.permissions || {},
    },
    sessionTimeoutHours: timeoutHours,
  };
});
