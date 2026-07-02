export default defineEventHandler((event) => {
  // Clear the auth cookie
  deleteCookie(event, 'auth_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  // Clear the CSRF token cookie
  deleteCookie(event, 'csrf_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return {
    success: true,
    message: 'Logged out successfully'
  };
});
