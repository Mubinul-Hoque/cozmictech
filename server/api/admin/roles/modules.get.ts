import { requirePermission, RBAC_MODULES, RBAC_ACTIONS } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  // Any admin with view permissions on users_roles or dashboard can view module schema
  await requirePermission(event, 'users_roles', 'view');

  return {
    modules: RBAC_MODULES,
    actions: RBAC_ACTIONS,
  };
});
