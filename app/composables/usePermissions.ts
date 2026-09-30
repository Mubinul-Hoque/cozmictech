import { computed } from 'vue';

export const usePermissions = () => {
  const authUser = useState<any>('authUser');

  const isSuperAdmin = computed(() => {
    if (!authUser.value) return false;
    if (authUser.value.is_super_admin) return true;
    const roleStr = String(authUser.value.role || '').toLowerCase().replace(/[\s_-]/g, '');
    return roleStr === 'superadmin';
  });

  const can = (module: string, action: string = 'view'): boolean => {
    if (!authUser.value) return false;
    if (isSuperAdmin.value) return true;

    const modulePerms = authUser.value.permissions?.[module];
    if (!modulePerms || !Array.isArray(modulePerms)) {
      return false;
    }

    return modulePerms.includes(action);
  };

  const canAny = (module: string, actions: string[]): boolean => {
    if (!authUser.value) return false;
    if (isSuperAdmin.value) return true;
    return actions.some(action => can(module, action));
  };

  const hasModule = (module: string): boolean => {
    return can(module, 'view');
  };

  return {
    isSuperAdmin,
    can,
    canAny,
    hasModule,
    userRole: computed(() => authUser.value?.role || 'Guest'),
    userPermissions: computed(() => authUser.value?.permissions || {}),
  };
};
