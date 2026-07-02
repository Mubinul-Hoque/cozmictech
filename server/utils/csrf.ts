import { randomUUID } from 'crypto';
import type { H3Event } from 'h3';

/**
 * Retrieves the current CSRF token stored in the client's cookie.
 */
export function getCsrfTokenFromCookie(event: H3Event): string | undefined {
  return getCookie(event, 'csrf_token');
}

/**
 * Generates a new cryptographically secure CSRF token, stores it in a secure,
 * HttpOnly cookie, and returns the token value.
 */
export function generateCsrfToken(event: H3Event): string {
  const token = randomUUID();
  setCookie(event, 'csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return token;
}

/**
 * Validates the CSRF token for state-changing HTTP requests.
 * Compares the client-sent X-CSRF-Token header with the secure HttpOnly cookie.
 */
export function validateCsrfToken(event: H3Event): boolean {
  const method = getMethod(event);
  
  // Safe HTTP methods do not require CSRF validation
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const cookieToken = getCsrfTokenFromCookie(event);
  if (!cookieToken) {
    return false;
  }

  const headerToken = getHeader(event, 'x-csrf-token') || getHeader(event, 'X-CSRF-Token');
  if (!headerToken) {
    return false;
  }

  // Exact comparison
  return cookieToken === headerToken;
}
