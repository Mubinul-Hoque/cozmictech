import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { id: 'asc' }
      })
      return { success: true, data: categories }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch categories' })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const catName = String(body.name || '').trim()
      if (!catName) {
        throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
      }

      if (catName.length > 50) {
        throw createError({ statusCode: 400, statusMessage: 'Category name exceeds limit of 50 characters' })
      }

      const newCategory = await prisma.category.create({
        data: {
          name: sanitizePlainText(catName)
        }
      })
      return { success: true, data: newCategory }
    } catch (error: any) {
      console.error('Error creating category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create category' })
    }
  }
})
