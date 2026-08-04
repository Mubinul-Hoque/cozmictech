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
          sectors: { select: { id: true, name: true } },
          client: { select: { id: true, client_name: true } },
          project_categories_link: {
            select: {
              category_id: true,
              categories: {
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
      
      const mappedProject = {
        ...project,
        images: project.images_json ? JSON.parse(project.images_json) : [],
        services: project.services_rendered || '',
        project_categories: project.project_categories_link.map(pcl => ({
          category_id: pcl.category_id,
          category: pcl.categories
        }))
      };
      
      return mappedProject;
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
        const dbCats = await prisma.categories.findMany({
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

      // Verify that the client exists
      if (client_id) {
        const clientExists = await prisma.clients.findUnique({
          where: { id: client_id }
        });
        if (!clientExists) {
          throw createError({ statusCode: 400, statusMessage: 'Invalid client ID: client does not exist' });
        }
      }

      const updatedProject = await prisma.$transaction(async (tx) => {
        // Delete all old associations
        await tx.project_categories_link.deleteMany({
          where: { project_id: id }
        });

        // String values with safety fallback and trimming
        const title = String(body.title || '').trim();
        let images: any = [];
        if (Array.isArray(body.images)) {
          images = body.images.map((img: any) => String(img).trim()).filter(Boolean);
        } else if (body.images) {
          images = [String(body.images).trim()].filter(Boolean);
        }
        const statusInput = String(body.status || '').trim();
        const status: 'Ongoing' | 'Completed' = statusInput === 'Ongoing' ? 'Ongoing' : 'Completed';
        
        const start_date = body.start_date ? new Date(body.start_date) : null;
        const end_date = body.end_date ? new Date(body.end_date) : null;

        const project_cost = String(body.project_cost || '').trim();
        const service_cost = String(body.service_cost || '').trim();
        const location = String(body.location || '').trim();
        const feature = String(body.feature || '').trim();
        const story = String(body.story || '').trim();
        const area = String(body.area || '').trim();
        const height = String(body.height || '').trim();

        // Enforce database limits
        if (
          title.length > 255 ||
          project_cost.length > 20 || service_cost.length > 20 ||
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
            images_json: JSON.stringify(images),
            description: sanitizeHtmlContent(body.description || ''),
            status: status,
            start_date: start_date,
            end_date: end_date,
            services_rendered: sanitizeHtmlContent(body.services || ''),
            project_cost: sanitizePlainText(project_cost),
            service_cost: sanitizePlainText(service_cost),
            location: sanitizePlainText(location),
            feature: sanitizePlainText(feature),
            story: sanitizePlainText(story),
            area: sanitizePlainText(area),
            height: sanitizePlainText(height),
            project_categories_link: {
              create: category_ids.map(catId => ({
                categories: { connect: { id: catId } }
              }))
            }
          }
        });
      });
      
      // Invalidate the public projects cache
      await useStorage('cache').removeItem('nitro:handlers:projects-page:projects-v3.json');
      
      return updatedProject;
    } catch (error: any) {
      console.error('Error updating admin project:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update project' });
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.projects.delete({ where: { id } });
      
      // Invalidate the public projects cache
      await useStorage('cache').removeItem('nitro:handlers:projects-page:projects-v3.json');
      
      await clearPublicCache();
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete project' });
    }
  }
});
