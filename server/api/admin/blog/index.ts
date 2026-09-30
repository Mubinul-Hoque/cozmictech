import { prisma } from '../../../utils/prisma';
import { requirePermission } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    await requirePermission(event, 'blog', 'view');
    try {
      const query = getQuery(event);
      
      let page = 1;
      if (query.page) {
        const parsedPage = parseInt(String(query.page));
        if (!isNaN(parsedPage) && parsedPage > 0) {
          page = parsedPage;
        }
      }

      let limit = 10;
      if (query.limit) {
        const parsedLimit = parseInt(String(query.limit));
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          limit = parsedLimit;
        }
      }

      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (query.search) {
        whereClause.title = { contains: String(query.search) };
      }
      if (query.catId) {
        const parsedCat = parseInt(String(query.catId));
        if (!isNaN(parsedCat)) {
          whereClause.category_id = parsedCat;
        }
      }

      const [posts, total] = await Promise.all([
        prisma.posts.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            title: true,
            image: true,
            author_name: true,
            category_id: true,
            published_at: true,
            created_at: true
          }
        }),
        prisma.posts.count({
          where: whereClause
        })
      ]);

      const mappedPosts = posts.map(p => ({
        ...p,
        author: p.author_name,
        post_catid: p.category_id,
        sdate: p.published_at ? p.published_at.toLocaleDateString() : p.created_at.toLocaleDateString(),
        date: p.created_at
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        data: mappedPosts,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error: any) {
      console.error('Error in api/admin/blog GET:', error);
      throw createError({ 
        statusCode: 500, 
        statusMessage: error.message || 'Failed to fetch posts' 
      });
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'blog', 'create');
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

      const post = await prisma.posts.create({
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
        message: 'Post created successfully',
        data: {
          ...post,
          author: post.author_name,
          post_catid: post.category_id,
          sdate: post.published_at ? post.published_at.toLocaleDateString() : post.created_at.toLocaleDateString(),
          date: post.created_at
        }
      };
    } catch (error: any) {
      console.error('Error in api/admin/blog POST:', error);
      throw createError({ 
        statusCode: error.statusCode || 500, 
        statusMessage: error.statusMessage || 'Failed to create post' 
      });
    }
  }
});
