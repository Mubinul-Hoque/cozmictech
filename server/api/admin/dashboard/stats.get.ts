import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const [projectsCount, messagesCount, usersCount, testimonialsCount, teamCount, postsCount, servicesCount] = await Promise.all([
      prisma.projects.count(),
      prisma.messages.count(),
      prisma.user.count(),
      prisma.testimonials.count(),
      prisma.team.count(),
      prisma.posts.count(),
      prisma.services.count()
    ]);

    return {
      projectsCount,
      messagesCount,
      usersCount,
      testimonialsCount,
      teamCount,
      postsCount,
      servicesCount
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching stats',
    });
  }
});
