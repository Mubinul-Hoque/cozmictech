import type { H3Event } from 'h3';
import { prisma } from './prisma';

export interface ModuleDefinition {
  id: string;
  name: string;
  category: 'core' | 'content' | 'analytics' | 'system';
  actions: string[];
}

export const RBAC_MODULES: ModuleDefinition[] = [
  { id: 'dashboard', name: 'Dashboard', category: 'core', actions: ['view'] },
  { id: 'projects', name: 'Projects', category: 'content', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { id: 'sectors', name: 'Sectors', category: 'content', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'categories', name: 'Categories', category: 'content', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'services', name: 'Services', category: 'content', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { id: 'clients', name: 'Clients', category: 'content', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'testimonials', name: 'Testimonials', category: 'content', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'team', name: 'Team Members', category: 'content', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'blog', name: 'Blog', category: 'content', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { id: 'careers', name: 'Careers', category: 'content', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { id: 'contact', name: 'Contact & Messages', category: 'content', actions: ['view', 'edit', 'delete'] },
  { id: 'pages', name: 'Pages', category: 'content', actions: ['view', 'edit', 'publish'] },
  { id: 'advanced_search', name: 'Advanced Search', category: 'system', actions: ['view', 'manage_settings'] },
  { id: 'visitor_analytics', name: 'Visitor Analytics', category: 'analytics', actions: ['view'] },
  { id: 'security', name: 'Security & Audit Logs', category: 'system', actions: ['view', 'manage_settings'] },
  { id: 'users_roles', name: 'Users & Roles', category: 'system', actions: ['view', 'create', 'edit', 'delete', 'manage_settings'] },
  { id: 'global_settings', name: 'Global Settings', category: 'system', actions: ['view', 'edit', 'manage_settings'] },
];

export const RBAC_ACTIONS = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'publish', label: 'Publish/Unpublish' },
  { id: 'manage_settings', label: 'Manage Settings' },
];

export const SENSITIVE_MODULES = ['users_roles', 'security', 'global_settings'];

// In-memory cache for role permissions: roleId -> { timestamp, permissions: Record<string, string[]> }
interface RoleCacheEntry {
  timestamp: number;
  permissions: Record<string, string[]>;
  roleName: string;
  isSystem: boolean;
}

const rolePermissionsCache = new Map<number, RoleCacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export function clearRbacCache(roleId?: number) {
  if (roleId) {
    rolePermissionsCache.delete(roleId);
  } else {
    rolePermissionsCache.clear();
  }
}

/**
 * Fetch permissions map for a given role ID
 */
export async function getRolePermissionsMap(roleId: number): Promise<{
  roleName: string;
  isSystem: boolean;
  permissions: Record<string, string[]>;
}> {
  const cached = rolePermissionsCache.get(roleId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      roleName: cached.roleName,
      isSystem: cached.isSystem,
      permissions: cached.permissions,
    };
  }

  const role = await prisma.roles.findUnique({
    where: { id: roleId },
    include: {
      permissions: true,
    },
  });

  if (!role) {
    return { roleName: '', isSystem: false, permissions: {} };
  }

  const permissions: Record<string, string[]> = {};
  for (const perm of role.permissions) {
    if (!permissions[perm.module]) {
      permissions[perm.module] = [];
    }
    if (!permissions[perm.module].includes(perm.action)) {
      permissions[perm.module].push(perm.action);
    }
  }

  rolePermissionsCache.set(roleId, {
    timestamp: Date.now(),
    roleName: role.name,
    isSystem: role.is_system,
    permissions,
  });

  return {
    roleName: role.name,
    isSystem: role.is_system,
    permissions,
  };
}

export interface UserRbacProfile {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role_id: number | null;
  role_name: string;
  is_super_admin: boolean;
  permissions: Record<string, string[]>;
}

/**
 * Retrieve user's full RBAC profile including resolved permissions
 */
export async function getUserRbacProfile(userId: number): Promise<UserRbacProfile | null> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) return null;

  const roleName = user.roles?.name || user.role || 'Admin';
  const isSuperAdmin =
    roleName.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin' ||
    (user.roles?.is_system && user.roles.name === 'Super Admin');

  let permissionsMap: Record<string, string[]> = {};

  if (isSuperAdmin) {
    // Super Admin has full unrestricted access to all modules and all actions
    for (const mod of RBAC_MODULES) {
      permissionsMap[mod.id] = [...mod.actions];
    }
  } else if (user.roles) {
    for (const perm of user.roles.permissions) {
      if (!permissionsMap[perm.module]) {
        permissionsMap[perm.module] = [];
      }
      if (!permissionsMap[perm.module].includes(perm.action)) {
        permissionsMap[perm.module].push(perm.action);
      }
    }
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    is_active: user.is_active !== false,
    role_id: user.role_id,
    role_name: roleName,
    is_super_admin: isSuperAdmin,
    permissions: permissionsMap,
  };
}

/**
 * Check if user profile has permission for a specific module and action
 */
export function hasPermission(
  profile: { is_super_admin?: boolean; role_name?: string; permissions?: Record<string, string[]> } | null | undefined,
  module: string,
  action: string
): boolean {
  if (!profile) return false;
  
  // Super Admin has full unrestricted access and cannot be restricted
  if (
    profile.is_super_admin ||
    profile.role_name?.toLowerCase().replace(/[\s_-]/g, '') === 'superadmin'
  ) {
    return true;
  }

  const modulePerms = profile.permissions?.[module];
  if (!modulePerms || !Array.isArray(modulePerms)) {
    return false;
  }

  return modulePerms.includes(action);
}

/**
 * Enforce permission check server-side in API event handlers.
 * Throws 403 Forbidden if user lacks permission.
 */
export async function requirePermission(
  event: H3Event,
  module: string,
  action: string
): Promise<UserRbacProfile> {
  const user = event.context.user;

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Missing or invalid credentials',
    });
  }

  // Get full RBAC profile (cached or DB)
  const profile = await getUserRbacProfile(Number(user.id));

  if (!profile) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - User record not found',
    });
  }

  if (!profile.is_active) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied - Account is deactivated. Please contact an administrator.',
    });
  }

  // Attach enriched profile to context
  event.context.userProfile = profile;

  if (!hasPermission(profile, module, action)) {
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
    const userAgent = getRequestHeader(event, 'user-agent') || '';
    
    // Log unauthorized access attempt in security logs
    const { logSecurityAudit } = await import('./security');
    await logSecurityAudit({
      action: 'PERMISSION_DENIED',
      identifier: profile.username || profile.email,
      user_id: profile.id,
      ip_address: clientIp,
      user_agent: userAgent,
      severity: 'warning',
      details: `User attempted unauthorized action [${action}] on module [${module}]`,
    });

    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden: You do not have permission to ${action} ${module}.`,
    });
  }

  return profile;
}
