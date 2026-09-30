import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';
import { logSecurityAudit } from '../../../utils/security';
import { sanitizePlainText } from '../../../utils/sanitize';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    const userProfile = await requirePermission(event, 'users_roles', 'view');

    const whereClause: any = {};
    if (!userProfile.is_super_admin) {
      // Normal admins cannot see Super Admin accounts if configured
      whereClause.roles = {
        name: { not: 'Super Admin' }
      };
    }

    const users = await prisma.users.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        role_id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        image: true,
        roles: {
          select: {
            id: true,
            name: true,
            is_system: true,
          }
        }
      }
    });

    return users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.roles?.name || u.role,
      role_id: u.role_id,
      is_active: u.is_active !== false,
      created_at: u.created_at,
      updated_at: u.updated_at,
      image: u.image,
      role_details: u.roles,
    }));
  }
  
  if (method === 'POST') {
    const userProfile = await requirePermission(event, 'users_roles', 'create');
    const body = await readBody(event);
    const { username, email, password, role_id, role, is_active } = body;
    
    if (!username || !email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Username, email, and password are required' });
    }

    const cleanUsername = sanitizePlainText(username).trim();
    const cleanEmail = email.trim().toLowerCase();

    // Input length validations
    if (cleanEmail.length > 100 || cleanUsername.length > 50 || password.length > 72) {
      throw createError({ statusCode: 400, statusMessage: 'Input length exceeds maximum allowed limit' });
    }

    if (password.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters long' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid email address format' });
    }

    // Check duplicate email
    const existingUser = await prisma.users.findUnique({
      where: { email: cleanEmail }
    });
    if (existingUser) {
      throw createError({ statusCode: 409, statusMessage: 'An account with this email address already exists' });
    }

    // Resolve target role
    let targetRole: any = null;
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

    if (!targetRole) {
      // Fallback to default Admin role
      targetRole = await prisma.roles.findFirst({ where: { name: 'Admin' } });
    }

    if (!targetRole) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid role specified' });
    }

    const isTargetSuperAdmin =
      targetRole.name === 'Super Admin' ||
      targetRole.name.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin';

    // Guard: Only Super Admin can create accounts with Super Admin role
    if (isTargetSuperAdmin && !userProfile.is_super_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Only Super Admin can create Super Admin accounts',
      });
    }

    // Hash password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: targetRole.name,
        role_id: targetRole.id,
        is_active: is_active !== false,
      },
      include: {
        roles: true,
      }
    });

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';

    await logSecurityAudit({
      action: 'ADMIN_ACTION',
      identifier: newUser.email,
      user_id: newUser.id,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'info',
      details: `New administrator account created: ${newUser.username} (${newUser.email}, Role: ${targetRole.name}, Active: ${newUser.is_active}) by ${userProfile.username}`,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
