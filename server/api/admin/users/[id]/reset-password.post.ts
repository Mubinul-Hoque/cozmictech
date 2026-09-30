import { prisma } from '../../../../utils/prisma';
import { requirePermission } from '../../../../utils/rbac';
import { logSecurityAudit } from '../../../../utils/security';

export default defineEventHandler(async (event) => {
  const userProfile = await requirePermission(event, 'users_roles', 'edit');

  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  const targetUser = await prisma.users.findUnique({
    where: { id },
    include: { roles: true }
  });

  if (!targetUser) throw createError({ statusCode: 404, statusMessage: 'User not found' });

  const isTargetSuperAdmin =
    targetUser.role === 'SuperAdmin' ||
    targetUser.role === 'Super Admin' ||
    targetUser.roles?.name === 'Super Admin';

  if (isTargetSuperAdmin && !userProfile.is_super_admin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Cannot reset password of a Super Admin',
    });
  }

  const body = await readBody(event);
  const { new_password } = body;

  if (!new_password || new_password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'New password must be at least 8 characters long',
    });
  }

  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash(new_password, 12);

  await prisma.users.update({
    where: { id },
    data: {
      password: hashedPassword,
      updated_at: new Date(),
    }
  });

  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
  const userAgent = getRequestHeader(event, 'user-agent') || '';

  await logSecurityAudit({
    action: 'PASSWORD_RESET_ADMIN',
    identifier: targetUser.email,
    user_id: targetUser.id,
    ip_address: clientIp,
    user_agent: userAgent,
    severity: 'warning',
    details: `Password for user ${targetUser.username} (${targetUser.email}) was reset by admin ${userProfile.username}`,
  });

  return {
    success: true,
    message: `Password for ${targetUser.username} was successfully reset`,
  };
});
