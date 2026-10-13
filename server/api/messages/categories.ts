import { prisma } from '../../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  try {
    const categories = await prisma.categories.findMany({
      where: { type: 'message' },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
    return { success: true, data: categories }
  } catch (error: any) {
    console.error('Error fetching public active message categories:', error)
    return { success: false, data: [] }
  }
}, {
  maxAge: 60 * 10,
  name: 'message-categories',
  getKey: () => 'message-categories-v1'
})
