import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0')
  try {
    const post = await prisma.posts.findUnique({
      where: { id },
      include: { categories: true }
    })
    if (!post) {
      throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
    }

    const mappedPost = {
      ...post,
      author: post.author_name,
      post_catid: post.category_id,
      sdate: post.published_at ? post.published_at.toLocaleDateString() : post.created_at.toLocaleDateString(),
      date: post.created_at
    }

    const category = post.categories
    
    const [recentPosts, allCategories] = await Promise.all([
      prisma.posts.findMany({
        where: { NOT: { id } },
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          image: true,
          published_at: true,
          created_at: true
        }
      }),
      prisma.categories.findMany({
        where: { type: 'post' },
        select: {
          id: true,
          name: true
        }
      })
    ])

    const mappedRecentPosts = recentPosts.map(p => ({ 
      ...p, 
      sdate: p.published_at ? p.published_at.toLocaleDateString() : p.created_at.toLocaleDateString() 
    }))

    return {
      post: mappedPost,
      category,
      recentPosts: mappedRecentPosts,
      allCategories
    }
  } catch (error) {
    console.error('Error fetching blog post details:', error)
    return null
  }
})
