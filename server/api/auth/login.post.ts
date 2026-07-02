import { signJwt } from '../../utils/jwt';
import bcrypt from 'bcrypt';
import { prisma } from '../../utils/prisma';
import { isRateLimited } from '../../utils/rateLimiter';

export default defineEventHandler(async (event) => {
  // IP Rate Limiting for brute-force protection
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
  if (isRateLimited(clientIp, 5, 60000)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Please try again later.',
    });
  }

  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    });
  }

  // Enforce reasonable constraints on email and password length
  if (email.length > 100 || password.length > 72) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input length',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format',
    });
  }

  // Find user by email
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Check password strictly using bcrypt
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Generate JWT token
  const token = await signJwt({ id: user.id, role: user.role, email: user.email, username: user.username });

  // Set HTTP-only cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    success: true,
    user: userWithoutPassword,
  };
});
