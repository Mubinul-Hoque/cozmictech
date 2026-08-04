import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const categories = await prisma.categories.findMany({
        where: { type: 'message' },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          type: true
        }
      });
      
      await clearPublicCache();
      return { success: true, data: categories.map(c => ({
        ...c,
        category_name: c.name,
        active: 1
      })) };
    } catch (error: any) {
      console.error('Error fetching message categories:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch categories' });
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      if (!body.category_name) {
        throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
      }

      const newCategory = await prisma.categories.create({
        data: {
          name: sanitizePlainText(body.category_name),
          slug: sanitizePlainText(body.category_name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: 'message'
        }
      })
      await clearPublicCache();
      return { success: true, data: newCategory }
    } catch (error: any) {
      console.error('Error creating admin message category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create category' })
    }
  }
})
