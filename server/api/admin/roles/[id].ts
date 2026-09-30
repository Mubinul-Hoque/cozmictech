import { prisma } from '../../../utils/prisma';
import { requirePermission, clearRbacCache, RBAC_MODULES } from '../../../utils/rbac';
import { logSecurityAudit } from '../../../utils/security';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = parseInt(event.context.params?.id || '0');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Role ID' });
  }

  const role = await prisma.roles.findUnique({
    where: { id },
    include: {
      permissions: true,
      _count: {
        select: { users: true }
      }
    }
  });

  if (!role) {
    throw createError({ statusCode: 404, statusMessage: 'Role not found' });
  }

  if (method === 'GET') {
    await requirePermission(event, 'users_roles', 'view');

    // Build permissions map: Record<string, string[]>
    const permissionsMap: Record<string, string[]> = {};
    for (const p of role.permissions) {
      if (!permissionsMap[p.module]) {
        permissionsMap[p.module] = [];
      }
      permissionsMap[p.module].push(p.action);
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      is_system: role.is_system,
      user_count: role._count.users,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: permissionsMap,
    };
  }

  if (method === 'PUT') {
    const userProfile = await requirePermission(event, 'users_roles', 'edit');
    const body = await readBody(event);
    const { name, description, permissions } = body;

    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      throw createError({ statusCode: 400, statusMessage: 'Role name is required' });
    }

    // Guard: Prevent renaming system roles
    if (role.is_system && trimmedName !== role.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'System roles cannot be renamed'
      });
    }

    // Guard: Super Admin role permissions cannot be restricted or altered
    const isSuperAdminRole =
      role.name.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin' ||
      (role.is_system && role.name === 'Super Admin');

    if (isSuperAdminRole && userProfile.role_name !== 'Super Admin' && !userProfile.is_super_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Only Super Admin can modify administrative roles'
      });
    }

    // Check for duplicate name if renamed
    if (trimmedName !== role.name) {
      const existing = await prisma.roles.findFirst({
        where: { name: trimmedName, id: { not: id } }
      });
      if (existing) {
        throw createError({ statusCode: 409, statusMessage: 'A role with this name already exists' });
      }
    }

    // Update role metadata
    const updatedRole = await prisma.roles.update({
      where: { id },
      data: {
        name: trimmedName,
        description: description !== undefined ? (description ? String(description).trim() : null) : role.description,
        updated_at: new Date(),
      }
    });

    // Update permissions if provided (and not Super Admin role being degraded)
    let permCount = role.permissions.length;
    if (permissions !== undefined) {
      if (isSuperAdminRole) {
        // Super Admin always maintains all permissions
      } else {
        const permissionsToInsert: { role_id: number; module: string; action: string }[] = [];
        if (Array.isArray(permissions)) {
          for (const p of permissions) {
            if (p.module && p.action) {
              permissionsToInsert.push({
                role_id: id,
                module: p.module,
                action: p.action,
              });
            }
          }
        } else if (permissions && typeof permissions === 'object') {
          for (const [mod, acts] of Object.entries(permissions)) {
            if (Array.isArray(acts)) {
              for (const act of acts) {
                permissionsToInsert.push({
                  role_id: id,
                  module: mod,
                  action: act,
                });
              }
            }
          }
        }

        // Delete old permissions and insert new ones
        await prisma.role_permissions.deleteMany({
          where: { role_id: id }
        });

        if (permissionsToInsert.length > 0) {
          await prisma.role_permissions.createMany({
            data: permissionsToInsert,
          });
        }
        permCount = permissionsToInsert.length;
      }
    }

    clearRbacCache(id);

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';

    await logSecurityAudit({
      action: 'ADMIN_ACTION',
      identifier: updatedRole.name,
      user_id: userProfile.id,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'warning',
      details: `Role "${updatedRole.name}" (ID: ${id}) updated with ${permCount} permissions by ${userProfile.username}`,
    });

    return {
      success: true,
      role: updatedRole,
      permissionCount: permCount,
    };
  }

  if (method === 'DELETE') {
    const userProfile = await requirePermission(event, 'users_roles', 'delete');

    if (role.is_system) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete system role "${role.name}"`,
      });
    }

    if (role._count.users > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete role "${role.name}" because ${role._count.users} user(s) are currently assigned to it. Please reassign the users first.`,
      });
    }

    await prisma.roles.delete({
      where: { id }
    });

    clearRbacCache(id);

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';

    await logSecurityAudit({
      action: 'ADMIN_ACTION',
      identifier: role.name,
      user_id: userProfile.id,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'danger',
      details: `Custom role "${role.name}" (ID: ${id}) deleted by ${userProfile.username}`,
    });

    return {
      success: true,
      message: `Role "${role.name}" successfully deleted`,
    };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
