import { verifyJwt } from '../../utils/jwt';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const payload = await verifyJwt(token);

  if (!payload || !payload.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }

  const user = await prisma.users.findUnique({
    where: { id: Number(payload.id) }
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found',
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
  };
});
