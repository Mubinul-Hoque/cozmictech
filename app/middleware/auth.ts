export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only apply to routes inside /admin
  if (to.path.startsWith('/admin')) {
    // Skip middleware for the login page
    if (to.path === '/admin/login') {
      return;
    }

    // Try to fetch current user to verify session
    try {
      // Forward cookies during server-side rendering (SSR) fetch
      const headers = useRequestHeaders(['cookie']);
      const { user } = await $fetch('/api/auth/me', { headers });
      
      // If we got here, token is valid. Store user in global state if needed
      const authUser = useState('authUser');
      authUser.value = user;
    } catch (error) {
      // If fetch fails (401), redirect to login
      return navigateTo('/admin/login');
    }
  }
});
