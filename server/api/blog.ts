import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const posts = await prisma.posts.findMany({
      orderBy: { date: 'desc' }
    })
    const categories = await prisma.post_category.findMany()

    return {
      posts,
      categories
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return {
      posts: [],
      categories: []
    }
  }
})
