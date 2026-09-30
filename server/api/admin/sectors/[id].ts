import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const idStr = getRouterParam(event, 'id')
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing sector ID' })
  }
  const id = parseInt(idStr)

  if (method === 'PUT') {
    await requirePermission(event, 'sectors', 'edit');
    try {
      const body = await readBody(event)
      const sectorName = String(body.sector || body.name || '').trim()
      if (!sectorName) {
        throw createError({ statusCode: 400, statusMessage: 'Sector name is required' })
      }

      if (sectorName.length > 50) {
        throw createError({ statusCode: 400, statusMessage: 'Sector name exceeds limit of 50 characters' })
      }

      const updated = await prisma.sectors.update({
        where: { id },
        data: {
          name: sanitizePlainText(sectorName)
        }
      })
      await clearPublicCache();
      return { success: true, data: updated }
    } catch (error: any) {
      console.error('Error updating sector:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update sector' })
    }
  }

  if (method === 'DELETE') {
    await requirePermission(event, 'sectors', 'delete');
    try {
      await prisma.sectors.delete({
        where: { id }
      })
      await clearPublicCache();
      return { success: true, message: 'Sector deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting sector:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete sector' })
    }
  }
})
