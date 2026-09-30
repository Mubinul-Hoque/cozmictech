import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    await requirePermission(event, 'projects', 'view');
    try {
      const query = getQuery(event);
      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 10;
      const search = (query.search as string) || '';
      const status = (query.status as string) || '';
      const catId = query.catId ? parseInt(query.catId as string) : null;
      const sectorId = query.sectorId ? parseInt(query.sectorId as string) : null;
      const sortBy = ((query.sortBy as string) || 'id').toLowerCase();
      const sortOrder = ((query.sortOrder as string) || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (search) {
        whereClause.title = { contains: search };
      }
      if (status) {
        whereClause.status = status;
      }
      if (catId) {
        whereClause.project_categories_link = {
          some: {
            category_id: catId
          }
        };
      }
      if (sectorId) {
        whereClause.sector_id = sectorId;
      }

      const projectSelect = {
        id: true,
        title: true,
        sector_id: true,
        status: true,
        images_json: true,
        start_date: true,
        end_date: true,
        service_cost: true,
        project_cost: true,
        created_at: true,
        project_categories_link: {
          select: {
            categories: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      };

      let projects: any[] = [];
      let total = 0;

      // Handle custom sorting
      if (sortBy === 'service_cost' || sortBy === 'contract_value') {
        const parseNum = (val: string | null) => {
          if (!val) return null;
          const cleaned = val.replace(/[^0-9.]/g, '');
          if (!cleaned) return null;
          const n = parseFloat(cleaned);
          return isNaN(n) ? null : n;
        };

        const allRecords = await prisma.projects.findMany({
          where: whereClause,
          select: { id: true, service_cost: true }
        });

        allRecords.sort((a, b) => {
          const numA = parseNum(a.service_cost);
          const numB = parseNum(b.service_cost);

          if (numA === null && numB === null) return b.id - a.id;
          if (numA === null) return 1; // non-numeric/null values pushed to the end
          if (numB === null) return -1;

          return sortOrder === 'asc' ? numA - numB : numB - numA;
        });

        total = allRecords.length;
        const pagedIds = allRecords.slice(skip, skip + limit).map(r => r.id);

        if (pagedIds.length > 0) {
          const fetchedProjects = await prisma.projects.findMany({
            where: { id: { in: pagedIds } },
            select: projectSelect
          });
          const projectsMap = new Map(fetchedProjects.map(p => [p.id, p]));
          projects = pagedIds.map(id => projectsMap.get(id)).filter(Boolean);
        }
      } else if (sortBy === 'end_date' || sortBy === 'start_date') {
        const [fetchedProjects, count] = await Promise.all([
          prisma.projects.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            select: projectSelect
          }),
          prisma.projects.count({
            where: whereClause
          })
        ]);
        projects = fetchedProjects;
        total = count;
      } else {
        // Default sort by id or created_at
        const [fetchedProjects, count] = await Promise.all([
          prisma.projects.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { id: sortOrder },
            select: projectSelect
          }),
          prisma.projects.count({
            where: whereClause
          })
        ]);
        projects = fetchedProjects;
        total = count;
      }

      const mappedProjects = projects.map(p => ({
        ...p,
        images: p.images_json ? JSON.parse(p.images_json) : [],
        project_categories: p.project_categories_link.map(pcl => ({
          category: pcl.categories
        }))
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        data: mappedProjects,
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
    await requirePermission(event, 'projects', 'create');
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

      // Enforce database limits
      if (
        title.length > 255 ||
        project_cost.length > 100 || service_cost.length > 100 ||
        location.length > 255
      ) {
        throw createError({ statusCode: 400, statusMessage: 'Input exceeds database length limit' });
      }

      // Build free-form specifications array [{title, value}]
      const rawSpecs = Array.isArray(body.specifications) ? body.specifications : [];
      const cleanSpecs = rawSpecs
        .map((item: any) => ({
          title: sanitizePlainText(String(item?.title ?? '').trim()).slice(0, 200),
          value: sanitizePlainText(String(item?.value ?? '').trim()).slice(0, 2000)
        }))
        .filter(item => item.title && item.value);

      // Build dynamic services array [{title, details}]
      const rawServices = Array.isArray(body.services) ? body.services : [];
      const cleanServices = rawServices
        .map((item: any) => ({
          title: sanitizePlainText(String(item?.title ?? '').trim()).slice(0, 255),
          details: sanitizePlainText(String(item?.details ?? '').trim()).slice(0, 3000)
        }))
        .filter(item => item.title);

      const servicesSummary = cleanServices
        .map(s => s.details ? `${s.title}: ${s.details}` : s.title)
        .join('\n');

      const newProject = await prisma.projects.create({
        data: {
          sector_id,
          client_id,
          title: sanitizePlainText(title),
          images_json: JSON.stringify(images),
          description: sanitizeHtmlContent(body.description || ''),
          status: status,
          start_date: start_date,
          end_date: end_date,
          services_rendered: servicesSummary,
          services_json: JSON.stringify(cleanServices),
          project_cost: sanitizePlainText(project_cost),
          service_cost: sanitizePlainText(service_cost),
          location: sanitizePlainText(location),
          specifications_json: JSON.stringify(cleanSpecs),
          project_categories_link: {
            create: category_ids.map(catId => ({
              categories: { connect: { id: catId } }
            }))
          }
        }
      });
      
      // Invalidate the public projects cache
      await useStorage('cache').removeItem('nitro:handlers:projects-page:projects-v3.json');

      return newProject;
    } catch (error: any) {
      console.error('Error creating admin project:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create project' });
    }
  }
});
