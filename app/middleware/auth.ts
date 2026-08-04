export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only apply to routes inside /admin
  if (to.path.startsWith('/admin')) {
    // Skip middleware for the login page
    if (to.path === '/admin/login') {
      return;
    }

    // Try to fetch current user to verify session if not already in state
    try {
      const authUser = useState('authUser');
      
      // Prevent unnecessary network execution on client-side navigations
      if (authUser.value) {
        return;
      }

      // Forward cookies during server-side rendering (SSR) fetch
      const headers = useRequestHeaders(['cookie']);
      const { user } = await $fetch('/api/auth/me', { headers });
      
      // If we got here, token is valid. Store user in global state
      authUser.value = user;
    } catch (error) {
      // If fetch fails (401), redirect to login
      return navigateTo('/admin/login');
    }
  }
});
