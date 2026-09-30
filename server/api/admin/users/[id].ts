import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';
import { logSecurityAudit } from '../../../utils/security';
import { sanitizePlainText } from '../../../utils/sanitize';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  // Fetch target user with roles
  const targetUser = await prisma.users.findUnique({
    where: { id },
    include: {
      roles: true,
    }
  });

  if (!targetUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  const isTargetSuperAdmin =
    targetUser.role === 'SuperAdmin' ||
    targetUser.role === 'Super Admin' ||
    targetUser.roles?.name === 'Super Admin';

  if (method === 'GET') {
    const userProfile = await requirePermission(event, 'users_roles', 'view');

    // Guard: Regular Admins are not authorized to view Super Admin records
    if (isTargetSuperAdmin && !userProfile.is_super_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Admins are not authorized to view Super Admin records'
      });
    }

    return {
      id: targetUser.id,
      username: targetUser.username,
      email: targetUser.email,
      role: targetUser.roles?.name || targetUser.role,
      role_id: targetUser.role_id,
      is_active: targetUser.is_active !== false,
      image: targetUser.image,
      created_at: targetUser.created_at,
      updated_at: targetUser.updated_at,
      role_details: targetUser.roles,
    };
  }

  if (method === 'PUT') {
    const userProfile = await requirePermission(event, 'users_roles', 'edit');
    const body = await readBody(event);
    const { username, email, role_id, role, password, is_active } = body;

    // Guard: Non-SuperAdmin cannot edit Super Admin records
    if (isTargetSuperAdmin && !userProfile.is_super_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Regular admins cannot edit Super Admin accounts'
      });
    }

    const cleanUsername = username ? sanitizePlainText(username).trim() : targetUser.username;
    const cleanEmail = email ? email.trim().toLowerCase() : targetUser.email;

    // Email format validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid email address format' });
      }

      // Check if email taken by someone else
      const existing = await prisma.users.findFirst({
        where: { email: cleanEmail, id: { not: id } }
      });
      if (existing) {
        throw createError({ statusCode: 409, statusMessage: 'Email is already in use by another account' });
      }
    }

    // Role resolution if role_id or role is passed
    let targetRole = targetUser.roles;
    if (role_id) {
      targetRole = await prisma.roles.findUnique({ where: { id: Number(role_id) } });
    } else if (role) {
      targetRole = await prisma.roles.findFirst({
        where: {
          OR: [
            { name: role },
            { name: role === 'SuperAdmin' ? 'Super Admin' : role }
          ]
        }
      });
    }

    if (!targetRole && (role_id || role)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid role specified' });
    }

    // Guard: Regular Admins cannot promote any user to SuperAdmin
    if (targetRole) {
      const isNewRoleSuperAdmin =
        targetRole.name === 'Super Admin' ||
        targetRole.name.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin';

      if (isNewRoleSuperAdmin && !userProfile.is_super_admin) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden - Admins are not authorized to promote accounts to Super Admin'
        });
      }
    }

    const updateData: any = {
      username: cleanUsername,
      email: cleanEmail,
      updated_at: new Date(),
    };

    if (targetRole) {
      updateData.role = targetRole.name;
      updateData.role_id = targetRole.id;
    }

    if (is_active !== undefined) {
      // Super Admin cannot deactivate themselves
      if (userProfile.id === id && is_active === false) {
        throw createError({
          statusCode: 400,
          statusMessage: 'You cannot deactivate your own account',
        });
      }
      updateData.is_active = Boolean(is_active);
    }

    if (password) {
      if (password.length < 8) {
        throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters long' });
      }
      const bcrypt = await import('bcrypt');
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updateData,
      include: { roles: true }
    });

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';

    // Log status or password changes
    if (password) {
      await logSecurityAudit({
        action: 'PASSWORD_CHANGE',
        identifier: updatedUser.email,
        user_id: updatedUser.id,
        ip_address: clientIp,
        user_agent: userAgent,
        severity: 'warning',
        details: `Password changed for user ${updatedUser.username} (${updatedUser.email}) by ${userProfile.username}`
      });
    }

    if (is_active !== undefined && targetUser.is_active !== Boolean(is_active)) {
      await logSecurityAudit({
        action: 'USER_STATUS_CHANGE',
        identifier: updatedUser.email,
        user_id: updatedUser.id,
        ip_address: clientIp,
        user_agent: userAgent,
        severity: is_active ? 'info' : 'warning',
        details: `User account ${updatedUser.username} was ${is_active ? 'ACTIVATED' : 'DEACTIVATED'} by ${userProfile.username}`
      });
    }

    if (targetRole && targetUser.role_id !== targetRole.id) {
      await logSecurityAudit({
        action: 'ROLE_ASSIGNMENT_CHANGE',
        identifier: updatedUser.email,
        user_id: updatedUser.id,
        ip_address: clientIp,
        user_agent: userAgent,
        severity: 'warning',
        details: `Role changed for user ${updatedUser.username} from "${targetUser.roles?.name || targetUser.role}" to "${targetRole.name}" by ${userProfile.username}`
      });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  if (method === 'DELETE') {
    const userProfile = await requirePermission(event, 'users_roles', 'delete');

    if (isTargetSuperAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Super Admin accounts cannot be deleted'
      });
    }

    if (userProfile.id === id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You cannot delete your own account'
      });
    }

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';

    await prisma.users.delete({ where: { id } });

    await logSecurityAudit({
      action: 'ADMIN_ACTION',
      identifier: targetUser.email,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'danger',
      details: `Administrator account ${targetUser.username} (${targetUser.email}) was deleted by ${userProfile.username}`
    });

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
