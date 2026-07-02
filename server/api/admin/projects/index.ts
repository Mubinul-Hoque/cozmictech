import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    try {
      const query = getQuery(event);
      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 10;
      const search = (query.search as string) || '';
      const status = (query.status as string) || '';
      const catId = query.catId ? parseInt(query.catId as string) : null;
      const sectorId = query.sectorId ? parseInt(query.sectorId as string) : null;

      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (search) {
        whereClause.title = { contains: search };
      }
      if (status) {
        whereClause.status = status;
      }
      if (catId) {
        whereClause.project_categories = {
          some: {
            category_id: catId
          }
        };
      }
      if (sectorId) {
        whereClause.sector_id = sectorId;
      }

      const [projects, total] = await Promise.all([
        prisma.projects.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { id: 'desc' },
          select: {
            id: true,
            title: true,
            sector_id: true,
            status: true,
            images: true,
            project_categories: {
              select: {
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }),
        prisma.projects.count({
          where: whereClause
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: projects,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching admin projects:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch projects' });
    }
  }
  
  if (event.node.req.method === 'POST') {
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

      const newProject = await prisma.projects.create({
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

      return newProject;
    } catch (error: any) {
      console.error('Error creating admin project:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create project' });
    }
  }
});
