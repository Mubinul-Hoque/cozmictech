import { ofetch } from 'ofetch';

export default defineNuxtPlugin(async (nuxtApp) => {
  const csrfToken = useState<string | null>('csrfToken', () => null);

  // Initialize CSRF token on client startup
  if (import.meta.client && !csrfToken.value) {
    try {
      const response = await $fetch<{ csrfToken: string }>('/api/auth/csrf');
      csrfToken.value = response.csrfToken;
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
    }
  }

  // Intercept all global $fetch requests to inject the CSRF token header
  if (globalThis.$fetch) {
    const originalFetch = globalThis.$fetch;
    globalThis.$fetch = originalFetch.create({
      onRequest({ options }) {
        if (csrfToken.value) {
          options.headers = options.headers || {};
          if (options.headers instanceof Headers) {
            options.headers.set('X-CSRF-Token', csrfToken.value);
          } else if (Array.isArray(options.headers)) {
            (options.headers as any[]).push(['X-CSRF-Token', csrfToken.value]);
          } else {
            (options.headers as any)['X-CSRF-Token'] = csrfToken.value;
          }
        }
      }
    });
  }
});
