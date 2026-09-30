import { verifyJwt } from '../utils/jwt';

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event);

  // Only protect /api/admin routes
  if (path.startsWith('/api/admin')) {
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const { isIpBlocked } = await import('../utils/security');
    if (await isIpBlocked(clientIp)) {
      throw createError({
        statusCode: 403,
        statusMessage: `Access Denied - Your IP address (${clientIp}) is blocked by security policy`,
      });
    }

    const token = getCookie(event, 'auth_token');

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Missing token',
      });
    }

    const payload = await verifyJwt(token);

    if (!payload || !payload.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid token',
      });
    }

    const { prisma } = await import('../utils/prisma');
    const user = await prisma.users.findUnique({
      where: { id: Number(payload.id) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        role_id: true,
        is_active: true,
      }
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - User does not exist',
      });
    }

    if (user.is_active === false) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access Denied - Account is deactivated. Please contact an administrator.',
      });
    }

    // Attach user payload to the event context so it can be used in API endpoints
    event.context.user = {
      ...payload,
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      role_id: user.role_id,
      is_active: user.is_active,
    };
  }
});
