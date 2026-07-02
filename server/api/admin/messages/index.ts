import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const query = getQuery(event)
    const catId = query.catId ? parseInt(query.catId as string) : undefined
    const search = query.search ? (query.search as string).trim() : undefined

    const whereClause: any = {}
    if (catId) {
      whereClause.message_cat_id = catId
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } }
      ]
    }

    const messages = await prisma.messages.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        date: true,
        message_cat_id: true,
        category: true
      },
      orderBy: { date: 'desc' }
    })
    return messages;
  }
})
