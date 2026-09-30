import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'categories', 'view');
    try {
      const categories = await prisma.categories.findMany({
        orderBy: { id: 'asc' }
      })
      await clearPublicCache();
      return { success: true, data: categories }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch categories' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'categories', 'create');
    try {
      const body = await readBody(event)
      const catName = String(body.name || '').trim()
      if (!catName) {
        throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
      }

      if (catName.length > 50) {
        throw createError({ statusCode: 400, statusMessage: 'Category name exceeds limit of 50 characters' })
      }

      const newCategory = await prisma.categories.create({
        data: {
          name: sanitizePlainText(catName)
        }
      })
      await clearPublicCache();
      return { success: true, data: newCategory }
    } catch (error: any) {
      console.error('Error creating category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create category' })
    }
  }
})
