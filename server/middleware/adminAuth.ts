import { verifyJwt } from '../utils/jwt';

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event);

  // Only protect /api/admin routes
  if (path.startsWith('/api/admin')) {
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

    // Restrict administrative routes to 'Admin' or 'SuperAdmin' users only
    if (payload.role !== 'Admin' && payload.role !== 'SuperAdmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Administrative role required',
      });
    }

    // Attach user payload to the event context so it can be used in the API endpoint
    event.context.user = payload;
  }
});
