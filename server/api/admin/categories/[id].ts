import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const idStr = getRouterParam(event, 'id')
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing category ID' })
  }
  const id = parseInt(idStr)

  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const catName = String(body.name || '').trim()
      if (!catName) {
        throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
      }

      if (catName.length > 50) {
        throw createError({ statusCode: 400, statusMessage: 'Category name exceeds limit of 50 characters' })
      }

      const updated = await prisma.category.update({
        where: { id },
        data: {
          name: sanitizePlainText(catName)
        }
      })
      return { success: true, data: updated }
    } catch (error: any) {
      console.error('Error updating category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update category' })
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.category.delete({
        where: { id }
      })
      return { success: true, message: 'Category deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete category' })
    }
  }
})
