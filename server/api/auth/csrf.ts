import { getCsrfTokenFromCookie, generateCsrfToken } from '../../utils/csrf';

export default defineEventHandler((event) => {
  let token = getCsrfTokenFromCookie(event);
  
  // If the cookie is not present, generate and set a new one
  if (!token) {
    token = generateCsrfToken(event);
  }

  return {
    csrfToken: token
  };
});
