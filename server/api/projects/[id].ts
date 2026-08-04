import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  try {
    const project = await prisma.projects.findUnique({
      where: { id },
      include: {
        project_categories_link: {
          include: {
            categories: {
              select: { id: true, name: true }
            }
          }
        },
        sectors: {
          select: { id: true, name: true }
        },
        client: {
          select: { id: true, client_name: true }
        }
      }
    });
    if (!project) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' });
    }

    const categoryIds = project.project_categories_link.map(pc => pc.category_id);
    const categories = project.project_categories_link.map(pc => pc.categories).filter(Boolean);
    const sector = { ...project.sectors, sector: project.sectors?.name };
    const client = project.client;

    const mappedProject = {
      ...project,
      images: project.images_json ? JSON.parse(project.images_json) : [],
      services: project.services_rendered || '',
      project_categories: project.project_categories_link.map(link => ({ category_id: link.category_id }))
    };

    const [relatedProjects, prevProject, nextProject] = await Promise.all([
      prisma.projects.findMany({
        where: {
          project_categories_link: {
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
          images_json: true,
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

    const mappedRelatedProjects = relatedProjects.map(p => ({
      ...p,
      images: p.images_json ? JSON.parse(p.images_json) : []
    }));

    return {
      project: mappedProject,
      categories,
      sector,
      client,
      relatedProjects: mappedRelatedProjects,
      prevProjectId: prevProject?.id || null,
      nextProjectId: nextProject?.id || null
    };
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
});
