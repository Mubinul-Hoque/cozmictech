import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const idStr = getRouterParam(event, 'id')
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing sector ID' })
  }
  const id = parseInt(idStr)

  if (method === 'PUT') {
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
          sector: sanitizePlainText(sectorName)
        }
      })
      return { success: true, data: updated }
    } catch (error: any) {
      console.error('Error updating sector:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update sector' })
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.sectors.delete({
        where: { id }
      })
      return { success: true, message: 'Sector deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting sector:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete sector' })
    }
  }
})
