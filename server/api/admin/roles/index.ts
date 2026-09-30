import { prisma } from '../../../utils/prisma';
import { requirePermission, clearRbacCache, RBAC_MODULES } from '../../../utils/rbac';
import { logSecurityAudit } from '../../../utils/security';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    await requirePermission(event, 'users_roles', 'view');

    const roles = await prisma.roles.findMany({
      orderBy: [
        { is_system: 'desc' },
        { id: 'asc' }
      ],
      include: {
        _count: {
          select: {
            users: true,
            permissions: true,
          }
        },
        permissions: {
          select: {
            module: true,
            action: true,
          }
        }
      }
    });

    return roles.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      is_system: r.is_system,
      user_count: r._count.users,
      permission_count: r._count.permissions,
      created_at: r.created_at,
      updated_at: r.updated_at,
      permissions: r.permissions,
    }));
  }

  if (method === 'POST') {
    const userProfile = await requirePermission(event, 'users_roles', 'create');
    const body = await readBody(event);
    const { name, description, permissions } = body;

    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      throw createError({ statusCode: 400, statusMessage: 'Role name is required' });
    }

    if (trimmedName.length > 100) {
      throw createError({ statusCode: 400, statusMessage: 'Role name exceeds 100 characters' });
    }

    // Check for duplicate name
    const existing = await prisma.roles.findFirst({
      where: { name: trimmedName }
    });
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'A role with this name already exists' });
    }

    // Create role
    const newRole = await prisma.roles.create({
      data: {
        name: trimmedName,
        description: description ? String(description).trim() : null,
        is_system: false,
      }
    });

    // Add permissions if provided
    // permissions can be passed as Array<{ module: string, action: string }> or Record<string, string[]>
    const permissionsToInsert: { role_id: number; module: string; action: string }[] = [];
    if (Array.isArray(permissions)) {
      for (const p of permissions) {
        if (p.module && p.action) {
          permissionsToInsert.push({
            role_id: newRole.id,
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
              role_id: newRole.id,
              module: mod,
              action: act,
            });
          }
        }
      }
    }

    if (permissionsToInsert.length > 0) {
      await prisma.role_permissions.createMany({
        data: permissionsToInsert,
      });
    }

    clearRbacCache();

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';

    await logSecurityAudit({
      action: 'ADMIN_ACTION',
      identifier: newRole.name,
      user_id: userProfile.id,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'info',
      details: `Created new role "${newRole.name}" with ${permissionsToInsert.length} permissions by ${userProfile.username}`,
    });

    return {
      success: true,
      role: newRole,
      permissionCount: permissionsToInsert.length,
    };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
