import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const idStr = getRouterParam(event, 'id');
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing post ID' });
  }
  const id = parseInt(idStr);

  if (method === 'GET') {
    try {
      const post = await prisma.posts.findUnique({
        where: { id }
      });
      if (!post) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' });
      }
      return {
        ...post,
        author: post.author_name,
        post_catid: post.category_id,
        sdate: post.published_at ? post.published_at.toLocaleDateString() : post.created_at.toLocaleDateString(),
        date: post.created_at
      };
    } catch (error: any) {
      console.error('Error fetching post:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch post' });
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      if (!body.title || !body.post_catid || !body.content) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields (title, post_catid, content)' });
      }

      // Validate input lengths matching database structure
      const title = String(body.title || '').trim();
      const author = String(body.author || 'Authority').trim();
      const sdate = String(body.sdate || new Date().toLocaleDateString('en-GB')).trim();
      const image = String(body.image || '').trim();

      const post = await prisma.posts.update({
        where: { id },
        data: {
          title: sanitizePlainText(title),
          category_id: parseInt(body.post_catid),
          content: sanitizeHtmlContent(body.content),
          image: sanitizePlainText(image),
          author_name: sanitizePlainText(author),
          published_at: new Date()
        }
      });

      await clearPublicCache();
      return {
        success: true,
        message: 'Post updated successfully',
        data: {
          ...post,
          author: post.author_name,
          post_catid: post.category_id,
          sdate: post.published_at ? post.published_at.toLocaleDateString() : post.created_at.toLocaleDateString(),
          date: post.created_at
        }
      };
    } catch (error: any) {
      console.error('Error updating post:', error);
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update post' });
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.posts.delete({
        where: { id }
      });
      await clearPublicCache();
      return { success: true, message: 'Post deleted successfully' };
    } catch (error: any) {
      console.error('Error deleting post:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete post' });
    }
  }
});
