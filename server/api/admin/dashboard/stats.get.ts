import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';

let statsCache: { data: any; expiresAt: number } | null = null;

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'dashboard', 'view');

  const now = Date.now();
  if (statsCache && statsCache.expiresAt > now) {
    return statsCache.data;
  }

  try {
    const [projectsCount, messagesCount, usersCount, testimonialsCount, teamCount, postsCount, servicesCount] = await Promise.all([
      prisma.projects.count(),
      prisma.messages.count(),
      prisma.users.count(),
      prisma.testimonials.count(),
      prisma.team_members.count(),
      prisma.posts.count(),
      prisma.services.count()
    ]);

    const result = {
      projectsCount,
      messagesCount,
      usersCount,
      testimonialsCount,
      teamCount,
      postsCount,
      servicesCount
    };

    statsCache = {
      data: result,
      expiresAt: now + 30 * 1000 // 30-second cache
    };

    return result;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching stats',
    });
  }
});
