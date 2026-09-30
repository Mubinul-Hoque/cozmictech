import { prisma } from '../../utils/prisma'
import { sanitizePlainText } from '../../utils/sanitize'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // 1. GET: Fetch all strengths
  if (method === 'GET') {
    await requirePermission(event, 'global_settings', 'view');
    try {
      const strengths = await prisma.strengths.findMany({
        orderBy: { id: 'asc' }
      })
      await clearPublicCache();
      return {
        success: true,
        data: strengths
      }
    } catch (error) {
      console.error('Error fetching strengths:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch strengths' })
    }
  }

  // 2. POST: Create a new strength record
  if (method === 'POST') {
    await requirePermission(event, 'global_settings', 'edit');
    try {
      const body = await readBody(event)
      const { title, icon, content } = body

      if (!title) {
        throw createError({ statusCode: 400, statusMessage: 'Strength title is required' })
      }

      const newStrength = await prisma.strengths.create({
        data: {
          title: sanitizePlainText(title),
          icon: icon ? sanitizePlainText(icon) : 'lucide:activity',
          content: content ? sanitizePlainText(content) : null
        }
      })

      await clearPublicCache();
      return {
        success: true,
        message: 'Strength added successfully',
        data: newStrength
      }
    } catch (error: any) {
      console.error('Error creating strength:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create strength' })
    }
  }

  // 3. PUT: Update an existing strength record
  if (method === 'PUT') {
    await requirePermission(event, 'global_settings', 'edit');
    try {
      const body = await readBody(event)
      const { id, title, icon, content } = body

      if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Strength ID is required' })
      }

      if (!title) {
        throw createError({ statusCode: 400, statusMessage: 'Strength title is required' })
      }

      const updatedStrength = await prisma.strengths.update({
        where: { id: parseInt(id) },
        data: {
          title: sanitizePlainText(title),
          icon: icon ? sanitizePlainText(icon) : 'lucide:activity',
          content: content ? sanitizePlainText(content) : null
        }
      })

      await clearPublicCache();
      return {
        success: true,
        message: 'Strength updated successfully',
        data: updatedStrength
      }
    } catch (error: any) {
      console.error('Error updating strength:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update strength' })
    }
  }

  // 4. DELETE: Delete a strength record
  if (method === 'DELETE') {
    await requirePermission(event, 'global_settings', 'edit');
    try {
      const query = getQuery(event)
      const id = query.id ? parseInt(query.id as string) : null

      if (!id || isNaN(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or missing Strength ID' })
      }

      await prisma.strengths.delete({
        where: { id }
      })

      await clearPublicCache();
      return {
        success: true,
        message: 'Strength deleted successfully'
      }
    } catch (error: any) {
      console.error('Error deleting strength:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to delete strength' })
    }
  }
})
