import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid Post ID' });

  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const post = await prisma.posts.findUnique({ where: { id } });
      if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' });
      return post;
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to fetch post' });
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      if (!body.title || !body.post_catid || !body.content) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' });
      }

      const title = String(body.title || '').trim();
      const author = String(body.author || 'Authority').trim();
      const sdate = String(body.sdate || new Date().toLocaleDateString('en-GB')).trim();
      const image = String(body.image || '').trim();

      if (title.length > 255 || author.length > 50 || sdate.length > 50 || image.length > 255) {
        throw createError({ statusCode: 400, statusMessage: 'Input length exceeds maximum allowed limit' });
      }

      const post = await prisma.posts.update({
        where: { id },
        data: {
          title: sanitizePlainText(title),
          post_catid: parseInt(body.post_catid),
          content: sanitizeHtmlContent(body.content),
          image: sanitizePlainText(image),
          author: sanitizePlainText(author),
          sdate: sanitizePlainText(sdate)
        }
      });

      return { success: true, post };
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update post' });
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.posts.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete post' });
    }
  }
});
