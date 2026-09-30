import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid Service ID' });

  const method = event.node.req.method;

  if (method === 'GET') {
    await requirePermission(event, 'services', 'view');
    try {
      const service = await prisma.services.findUnique({ where: { id } });
      if (!service) throw createError({ statusCode: 404, statusMessage: 'Service not found' });
      return service;
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to fetch service' });
    }
  }

  if (method === 'PUT') {
    await requirePermission(event, 'services', 'edit');
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

      const service = await prisma.services.update({
        where: { id },
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
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update service' });
    }
  }

  if (method === 'DELETE') {
    await requirePermission(event, 'services', 'delete');
    try {
      await prisma.services.delete({ where: { id } });
      await clearPublicCache();
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete service' });
    }
  }
});
