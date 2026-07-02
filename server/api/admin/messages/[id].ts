import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });

  if (event.node.req.method === 'GET') {
    const message = await prisma.messages.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
    if (!message) throw createError({ statusCode: 404, statusMessage: 'Message not found' });
    
    // Mark as read (status = 1) if it's currently 0
    if (message.status === 0) {
      await prisma.messages.update({
        where: { id },
        data: { status: 1 }
      });
      message.status = 1;
    }
    
    return message;
  }

  if (event.node.req.method === 'DELETE') {
    await prisma.messages.delete({ where: { id } });
    return { success: true };
  }
});
