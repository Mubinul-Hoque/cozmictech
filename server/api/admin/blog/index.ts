import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
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
          whereClause.post_catid = parsedCat;
        }
      }

      const [posts, total] = await Promise.all([
        prisma.posts.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { date: 'desc' },
          select: {
            id: true,
            title: true,
            image: true,
            author: true,
            post_catid: true,
            sdate: true,
            date: true
          }
        }),
        prisma.posts.count({
          where: whereClause
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: posts,
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

      if (title.length > 255 || author.length > 50 || sdate.length > 50 || image.length > 255) {
        throw createError({ statusCode: 400, statusMessage: 'Input length exceeds maximum allowed limit' });
      }

      const post = await prisma.posts.create({
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
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create blog post' });
    }
  }
});
