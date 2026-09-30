import { verifyJwt } from '../../utils/jwt';
import { logSecurityAudit } from '../../utils/security';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
  const userAgent = getRequestHeader(event, 'user-agent') || '';

  if (token) {
    try {
      const payload = await verifyJwt(token);
      if (payload) {
        await logSecurityAudit({
          action: 'LOGOUT',
          identifier: payload.username || payload.email,
          user_id: payload.id,
          ip_address: clientIp,
          user_agent: userAgent,
          severity: 'info',
          details: `User ${payload.username} logged out`
        });
      }
    } catch {
      // Ignore token verification errors during logout
    }
  }

  // Clear the auth cookie
  deleteCookie(event, 'auth_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  // Clear the CSRF token cookie
  deleteCookie(event, 'csrf_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return {
    success: true,
    message: 'Logged out successfully'
  };
});
