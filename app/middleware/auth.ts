export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only apply to routes inside /admin
  if (to.path.startsWith('/admin')) {
    // Skip middleware for the login page
    if (to.path === '/admin/login') {
      return;
    }

    // Check inactivity timeout on client-side route navigation
    const authUser = useState('authUser');

    if (import.meta.client) {
      const lastActivityStr = localStorage.getItem('cozmic_admin_last_activity');
      const timeoutHours = Number(localStorage.getItem('cozmic_admin_timeout_hours')) || 2;
      if (lastActivityStr) {
        const elapsed = Date.now() - parseInt(lastActivityStr, 10);
        if (elapsed >= timeoutHours * 3600 * 1000) {
          authUser.value = null;
          localStorage.removeItem('cozmic_admin_last_activity');
          return navigateTo('/admin/login?reason=timeout');
        }
      }
    }

    // Try to fetch current user to verify session if not already in state
    try {
      if (!authUser.value) {
        // Forward cookies during server-side rendering (SSR) fetch
        const headers = useRequestHeaders(['cookie']);
        const response = await $fetch<any>('/api/auth/me', { headers });
        
        // If we got here, token is valid. Store user in global state
        authUser.value = response.user;

        if (response.sessionTimeoutHours) {
          const sessionTimeoutHoursState = useState('adminSessionTimeoutHours', () => 2);
          sessionTimeoutHoursState.value = response.sessionTimeoutHours;
        }
      }

      // RBAC Page-Level Permission Enforcement
      const user = authUser.value;
      if (user) {
        const isSuperAdmin =
          user.is_super_admin ||
          String(user.role || '').toLowerCase().replace(/[\s_-]/g, '') === 'superadmin';

        if (!isSuperAdmin) {
          const ROUTE_MODULE_MAP: Array<{ prefix: string; module: string }> = [
            { prefix: '/admin/projects', module: 'projects' },
            { prefix: '/admin/services', module: 'services' },
            { prefix: '/admin/blog', module: 'blog' },
            { prefix: '/admin/career', module: 'careers' },
            { prefix: '/admin/contact', module: 'contact' },
            { prefix: '/admin/messages', module: 'contact' },
            { prefix: '/admin/about', module: 'pages' },
            { prefix: '/admin/clients', module: 'clients' },
            { prefix: '/admin/advanced-search', module: 'advanced_search' },
            { prefix: '/admin/testimonials', module: 'testimonials' },
            { prefix: '/admin/team', module: 'team' },
            { prefix: '/admin/settings', module: 'global_settings' },
            { prefix: '/admin/analytics', module: 'visitor_analytics' },
            { prefix: '/admin/security', module: 'security' },
            { prefix: '/admin/users', module: 'users_roles' },
            { prefix: '/admin/roles', module: 'users_roles' },
          ];

          const matched = ROUTE_MODULE_MAP.find(r => to.path === r.prefix || to.path.startsWith(r.prefix + '/'));
          if (matched) {
            const hasAccess = user.permissions?.[matched.module]?.includes('view');
            if (!hasAccess) {
              return navigateTo('/admin?error=forbidden');
            }
          } else if (to.path === '/admin') {
            // Dashboard root check
            const hasDashboard = user.permissions?.['dashboard']?.includes('view');
            if (!hasDashboard) {
              // Redirect to first permitted route
              const firstPermitted = ROUTE_MODULE_MAP.find(r => user.permissions?.[r.module]?.includes('view'));
              if (firstPermitted) {
                return navigateTo(firstPermitted.prefix);
              }
            }
          }
        }
      }
    } catch (error) {
      // If fetch fails (401), redirect to login
      return navigateTo('/admin/login');
    }
  }
});
