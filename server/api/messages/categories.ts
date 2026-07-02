import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    try {
      const categories = await prisma.message_category.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
      })
      return { success: true, data: categories }
    } catch (error: any) {
      console.error('Error fetching public active message categories:', error)
      return { success: false, data: [] }
    }
  }
})
