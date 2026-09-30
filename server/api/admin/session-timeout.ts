import {
  ALLOWED_SESSION_TIMEOUTS,
  getSessionTimeoutHours,
  setSessionTimeoutHours
} from '../../utils/session';
import { requirePermission } from '../../utils/rbac';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET: Read current session timeout setting
  if (method === 'GET') {
    const userProfile = await requirePermission(event, 'global_settings', 'view');
    const timeoutHours = await getSessionTimeoutHours();
    return {
      success: true,
      timeoutHours,
      allowedOptions: ALLOWED_SESSION_TIMEOUTS,
      isSuperAdmin: userProfile.is_super_admin
    };
  }

  // POST: Update session timeout setting
  if (method === 'POST') {
    await requirePermission(event, 'global_settings', 'manage_settings');

    const body = await readBody(event);
    const hours = Number(body?.timeoutHours);

    const updatedHours = await setSessionTimeoutHours(hours);

    return {
      success: true,
      timeoutHours: updatedHours,
      message: `Admin session timeout updated to ${updatedHours} hour${updatedHours > 1 ? 's' : ''}`
    };
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  });
});
