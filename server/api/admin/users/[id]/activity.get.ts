import { prisma } from '../../../../utils/prisma';
import { requirePermission } from '../../../../utils/rbac';

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'users_roles', 'view');

  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  const user = await prisma.users.findUnique({
    where: { id },
    select: { id: true, username: true, email: true }
  });

  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' });

  // Fetch recent activity from security_logs where user_id matches or identifier matches username/email
  const logs = await prisma.security_logs.findMany({
    where: {
      OR: [
        { user_id: user.id },
        { identifier: user.email },
        { identifier: user.username },
      ]
    },
    orderBy: { created_at: 'desc' },
    take: 50,
  });

  return {
    user,
    activities: logs,
  };
});
