import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const project = await prisma.projects.findUnique({
        where: { id },
        include: {
          project_categories: {
            select: {
              category_id: true,
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' });
      return project;
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 550, statusMessage: error.statusMessage || 'Failed to fetch project' });
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      
      // Process integer conversions
      const sector_id = parseInt(body.sector_id) || 1;
      const client_id = body.client_id ? parseInt(body.client_id) : null;

      // Extract multiple category IDs
      let category_ids: number[] = [];
      if (Array.isArray(body.category_ids)) {
        category_ids = body.category_ids.map((id: any) => parseInt(id)).filter((id: number) => !isNaN(id));
      } else if (body.category_ids) {
        category_ids = [parseInt(body.category_ids)].filter((id: number) => !isNaN(id));
      } else if (body.cat_id) {
        category_ids = [parseInt(body.cat_id)].filter((id: number) => !isNaN(id));
      }

      // Verify that the categories exist
      if (category_ids.length > 0) {
        const dbCats = await prisma.category.findMany({
          where: { id: { in: category_ids } }
        });
        if (dbCats.length !== category_ids.length) {
          throw createError({ statusCode: 400, statusMessage: 'One or more category IDs are invalid' });
        }
      }

      // Verify that the sector exists
      const sectorExists = await prisma.sectors.findUnique({
        where: { id: sector_id }
      });
      if (!sectorExists) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid sector ID: sector does not exist' });
      }

      const updatedProject = await prisma.$transaction(async (tx) => {
        // Delete all old associations
        await tx.project_categories.deleteMany({
          where: { project_id: id }
        });

        // String values with safety fallback and trimming
        const title = String(body.title || '').trim();
        const images = String(body.images || '').trim();
        const status = String(body.status || 'Completed').trim();
        const show_status = String(body.show_status || '').trim();
        const project_cost = String(body.project_cost || '').trim();
        const service_cost = String(body.service_cost || '').trim();
        const location = String(body.location || '').trim();
        const feature = String(body.feature || '').trim();
        const story = String(body.story || '').trim();
        const area = String(body.area || '').trim();
        const height = String(body.height || '').trim();

        // Enforce database limits
        if (
          title.length > 255 || images.length > 100 || status.length > 10 ||
          show_status.length > 100 || project_cost.length > 20 || service_cost.length > 20 ||
          location.length > 100 || feature.length > 255 || story.length > 20 ||
          area.length > 50 || height.length > 25
        ) {
          throw createError({ statusCode: 400, statusMessage: 'Input exceeds database length limit' });
        }

        // Update main record and write new category associations
        return await tx.projects.update({
          where: { id },
          data: {
            sector_id,
            client_id,
            title: sanitizePlainText(title),
            images: sanitizePlainText(images),
            description: sanitizeHtmlContent(body.description || ''),
            status: sanitizePlainText(status),
            show_status: sanitizePlainText(show_status),
            services: sanitizeHtmlContent(body.services || ''),
            project_cost: sanitizePlainText(project_cost),
            service_cost: sanitizePlainText(service_cost),
            location: sanitizePlainText(location),
            feature: sanitizePlainText(feature),
            story: sanitizePlainText(story),
            area: sanitizePlainText(area),
            height: sanitizePlainText(height),
            project_categories: {
              create: category_ids.map(catId => ({
                category: { connect: { id: catId } }
              }))
            }
          }
        });
      });
      
      return updatedProject;
    } catch (error: any) {
      console.error('Error updating admin project:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update project' });
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.projects.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete project' });
    }
  }
});
