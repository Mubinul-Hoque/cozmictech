import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  if (event.node.req.method === 'GET') {
    await requirePermission(event, 'contact', 'view');
    const message = await prisma.messages.findUnique({
      where: { id },
      include: {
        categories: true
      }
    });
    if (!message) throw createError({ statusCode: 404, statusMessage: 'Message not found' });
    
    // Mark as read (is_read = true) if it's currently false
    if (message.is_read === false) {
      await prisma.messages.update({
        where: { id },
        data: { is_read: true }
      });
      message.is_read = true;
    }
    
    // Map for frontend
    return {
      ...message,
      status: message.is_read ? 1 : 0,
      category: message.categories
    };
  }

  if (event.node.req.method === 'DELETE') {
    await requirePermission(event, 'contact', 'delete');
    await prisma.messages.delete({ where: { id } });
    await clearPublicCache();
    return { success: true };
  }
});
