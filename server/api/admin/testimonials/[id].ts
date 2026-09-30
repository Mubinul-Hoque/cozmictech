import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid Testimonial ID' });

  const method = event.node.req.method;

  if (method === 'GET') {
    await requirePermission(event, 'testimonials', 'view');
    try {
      const testimonial = await prisma.testimonials.findUnique({ where: { id } });
      if (!testimonial) throw createError({ statusCode: 404, statusMessage: 'Testimonial not found' });
      return testimonial;
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to fetch testimonial' });
    }
  }

  if (method === 'PUT') {
    await requirePermission(event, 'testimonials', 'edit');
    try {
      const body = await readBody(event);
      if (!body.name || !body.designation || !body.story) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' });
      }

      const name = String(body.name).trim();
      const designation = String(body.designation).trim();
      const company = String(body.company || '').trim();
      const image = String(body.image || '').trim();
      const story = String(body.story).trim();
      const stars = parseInt(body.stars || '5');

      if (name.length > 255 || designation.length > 255 || company.length > 50 || image.length > 255) {
        throw createError({ statusCode: 400, statusMessage: 'Input exceeds database length limit' });
      }

      if (isNaN(stars) || stars < 1 || stars > 5) {
        throw createError({ statusCode: 400, statusMessage: 'Stars must be between 1 and 5' });
      }

      const testimonial = await prisma.testimonials.update({
        where: { id },
        data: {
          name: sanitizePlainText(name),
          designation: sanitizePlainText(designation),
          company: sanitizePlainText(company),
          stars,
          image: sanitizePlainText(image),
          story: sanitizePlainText(story)
        }
      });

      await clearPublicCache();
      return { success: true, testimonial };
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update testimonial' });
    }
  }

  if (method === 'DELETE') {
    await requirePermission(event, 'testimonials', 'delete');
    try {
      await prisma.testimonials.delete({ where: { id } });
      await clearPublicCache();
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete testimonial' });
    }
  }
});
