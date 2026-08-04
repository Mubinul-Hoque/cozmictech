import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const query = getQuery(event)
    const catId = query.catId ? parseInt(query.catId as string) : undefined
    const search = query.search ? (query.search as string).trim() : undefined

    const whereClause: any = {}
    if (catId) {
      whereClause.category_id = catId
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
        is_read: true,
        created_at: true,
        category_id: true,
        categories: true
      },
      orderBy: { created_at: 'desc' }
    })

    // Map fields back to what the frontend expects
    const mappedMessages = messages.map(m => ({
      ...m,
      status: m.is_read ? 'Read' : 'Unread',
      date: m.created_at,
      message_cat_id: m.category_id,
      category: m.categories ? { title: m.categories.name } : null
    }));

    return mappedMessages;
  }
})
