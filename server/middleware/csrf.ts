import { validateCsrfToken } from '../utils/csrf';

export default defineEventHandler((event) => {
  const path = getRequestPath(event);

  // Apply CSRF validation only to API endpoints
  if (path.startsWith('/api')) {
    const isValid = validateCsrfToken(event);

    if (!isValid) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - CSRF token verification failed',
      });
    }
  }
});
