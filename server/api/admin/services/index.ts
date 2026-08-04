import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const servicesList = await prisma.services.findMany({
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          icon: true,
          short_description: true,
          image: true
        }
      });
      return servicesList;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch services' });
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const name = String(body.name || '').trim();
      if (!name) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required field: name' });
      }

      const icon = String(body.icon || 'lucide:activity').trim();
      const short_description = String(body.short_description || '').trim();
      const image = String(body.image || '').trim();

      // Enforce database limits
      if (name.length > 255 || icon.length > 100 || image.length > 255) {
        throw createError({ statusCode: 400, statusMessage: 'Input exceeds database length limit' });
      }

      const service = await prisma.services.create({
        data: {
          name: sanitizePlainText(name),
          icon: sanitizePlainText(icon),
          short_description: sanitizePlainText(short_description),
          image: sanitizePlainText(image),
          description: sanitizeHtmlContent(body.description || '')
        }
      });

      await clearPublicCache();
      return { success: true, service };
    } catch (error: any) {
      console.error('Error creating service:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create service' });
    }
  }
});
