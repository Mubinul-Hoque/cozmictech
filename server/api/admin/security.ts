import {
  getSecurityPolicies,
  saveSecurityPolicies,
  getSecurityAuditLogs,
  clearSecurityAuditLogs,
  getBlockedIpList,
  blockIpAddress,
  unblockIpAddress,
} from '../../utils/security';

import { requirePermission } from '../../utils/rbac';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // ─── GET: Retrieve security configurations, blocked IPs, and audit logs ─────
  if (method === 'GET') {
    const userProfile = await requirePermission(event, 'security', 'view');
    const isSuperAdmin = userProfile.is_super_admin;

    const [policies, blockedIps, logs] = await Promise.all([
      getSecurityPolicies(),
      getBlockedIpList(),
      getSecurityAuditLogs(150),
    ]);

    return {
      success: true,
      isSuperAdmin,
      policies,
      blockedIps,
      logs: logs.map(l => ({
        id: l.id,
        timestamp: l.created_at.toISOString(),
        action: l.action,
        identifier: l.identifier || 'system',
        ip: l.ip_address || 'unknown',
        userAgent: l.user_agent || '',
        deviceType: l.device_type || 'desktop',
        severity: l.severity || 'info',
        details: l.details || '',
      })),
    };
  }

  // ─── POST: Modify policies, manage blocked IPs, or clear logs
  if (method === 'POST') {
    const userProfile = await requirePermission(event, 'security', 'manage_settings');

    const body = await readBody(event);
    const action = body?.action || 'save_policies';
    const actor = currentUser.username || currentUser.email || 'SuperAdmin';

    // 1. Clear audit logs
    if (action === 'clear_logs') {
      await clearSecurityAuditLogs(actor);
      return { success: true, message: 'Security audit logs cleared successfully' };
    }

    // 2. Block an IP address
    if (action === 'block_ip') {
      const ip = body.ip ? String(body.ip).trim() : '';
      const reason = body.reason ? String(body.reason).trim() : 'Suspicious activity';
      if (!ip) {
        throw createError({ statusCode: 400, statusMessage: 'IP address is required' });
      }

      await blockIpAddress(ip, reason, actor);
      const updatedBlocked = await getBlockedIpList();
      return {
        success: true,
        message: `IP address ${ip} has been successfully blocked`,
        blockedIps: updatedBlocked,
      };
    }

    // 3. Unblock an IP address
    if (action === 'unblock_ip') {
      const ip = body.ip ? String(body.ip).trim() : '';
      if (!ip) {
        throw createError({ statusCode: 400, statusMessage: 'IP address is required' });
      }

      await unblockIpAddress(ip, actor);
      const updatedBlocked = await getBlockedIpList();
      return {
        success: true,
        message: `IP address ${ip} has been unblocked`,
        blockedIps: updatedBlocked,
      };
    }

    // 4. Save Security & Access Policies to database
    if (action === 'save_policies' || body.policies) {
      const policiesPayload = body.policies || body;
      const updatedPolicies = await saveSecurityPolicies(policiesPayload, actor);
      return {
        success: true,
        message: 'Security & Access Policies saved to database successfully',
        policies: updatedPolicies,
      };
    }

    throw createError({ statusCode: 400, statusMessage: 'Invalid security action' });
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
