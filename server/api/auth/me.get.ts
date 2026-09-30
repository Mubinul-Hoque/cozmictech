import { verifyJwt } from '../../utils/jwt';
import { prisma } from '../../utils/prisma';
import { getSessionTimeoutHours } from '../../utils/session';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const payload = await verifyJwt(token);

  if (!payload || !payload.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }

  const user = await prisma.users.findUnique({
    where: { id: Number(payload.id) }
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found',
    });
  }

  if (user.is_active === false) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied - Account is deactivated',
    });
  }

  const { getUserRbacProfile } = await import('../../utils/rbac');
  const rbacProfile = await getUserRbacProfile(user.id);

  const timeoutHours = await getSessionTimeoutHours();
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
