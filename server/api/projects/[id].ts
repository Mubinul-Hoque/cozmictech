import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  try {
    const project = await prisma.projects.findUnique({
      where: { id },
      include: {
        project_categories: {
          select: {
            category_id: true
          }
        }
      }
    });
    if (!project) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' });
    }

    const categoryIds = project.project_categories.map(pc => pc.category_id);

    const [categories, sector, client, relatedProjects, prevProject, nextProject] = await Promise.all([
      prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true }
      }),
      prisma.sectors.findUnique({
        where: { id: project.sector_id },
        select: { id: true, sector: true }
      }),
      project.client_id ? prisma.clients.findUnique({
        where: { id: project.client_id },
        select: { id: true, client_name: true }
      }) : Promise.resolve(null),
      prisma.projects.findMany({
        where: {
          project_categories: {
            some: {
              category_id: { in: categoryIds }
            }
          },
          NOT: { id: project.id }
        },
        take: 3,
        select: {
          id: true,
          title: true,
          images: true,
          location: true
        }
      }),
      prisma.projects.findFirst({
        where: { id: { lt: project.id } },
        orderBy: { id: 'desc' },
        select: { id: true }
      }),
      prisma.projects.findFirst({
        where: { id: { gt: project.id } },
        orderBy: { id: 'asc' },
        select: { id: true }
      })
    ]);

    return {
      project,
      categories,
      sector,
      client,
      relatedProjects,
      prevProjectId: prevProject?.id || null,
      nextProjectId: nextProject?.id || null
    };
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
});
