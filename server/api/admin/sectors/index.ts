import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const sectors = await prisma.sectors.findMany({
        orderBy: { id: 'asc' }
      })
      return { success: true, data: sectors }
    } catch (error: any) {
      console.error('Error fetching sectors:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch sectors' })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const sectorName = String(body.sector || body.name || '').trim()
      if (!sectorName) {
        throw createError({ statusCode: 400, statusMessage: 'Sector name is required' })
      }

      if (sectorName.length > 50) {
        throw createError({ statusCode: 400, statusMessage: 'Sector name exceeds limit of 50 characters' })
      }

      const newSector = await prisma.sectors.create({
        data: {
          sector: sanitizePlainText(sectorName)
        }
      })
      return { success: true, data: newSector }
    } catch (error: any) {
      console.error('Error creating sector:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create sector' })
    }
  }
})
