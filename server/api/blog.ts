import { prisma } from '../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  const [posts, categories] = await Promise.all([
    prisma.posts.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        category_id: true,
        title: true,
        image: true,
        author_name: true,
        published_at: true,
        created_at: true,
      }
    }),
    prisma.categories.findMany()
  ])

  const mappedPosts = posts.map(p => ({
    ...p,
    author: p.author_name,
    post_catid: p.category_id,
    sdate: p.published_at ? p.published_at.toLocaleDateString() : p.created_at.toLocaleDateString(),
    date: p.created_at
  }))

  return { posts: mappedPosts, categories }
}, {
  maxAge: 60 * 5,      // 5-minute TTL — blog changes are infrequent
  name: 'blog-index',
  getKey: () => 'blog-v2'
})
