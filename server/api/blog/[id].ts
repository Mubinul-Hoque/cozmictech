import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0')
  try {
    const post = await prisma.posts.findUnique({
      where: { id }
    })
    if (!post) {
      throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
    }

    const [category, recentPosts, allCategories] = await Promise.all([
      prisma.post_category.findUnique({
        where: { id: post.post_catid }
      }),
      prisma.posts.findMany({
        where: { NOT: { id } },
        take: 5,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          image: true,
          sdate: true
        }
      }),
      prisma.post_category.findMany({
        select: {
          id: true,
          name: true
        }
      })
    ])

    return {
      post,
      category,
      recentPosts,
      allCategories
    }
  } catch (error) {
    console.error('Error fetching blog post details:', error)
    return null
  }
})
