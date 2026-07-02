import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const [homepage, strengths, testimonials, clients, recentPosts] = await Promise.all([
      prisma.homepage.findFirst(),
      prisma.strength.findMany({
        select: {
          id: true,
          title: true,
          icon: true,
          content: true
        }
      }),
      prisma.testimonials.findMany({
        select: {
          id: true,
          name: true,
          designation: true,
          company: true,
          stars: true,
          image: true,
          story: true
        }
      }),
      prisma.clients.findMany({
        select: {
          id: true,
          logo: true,
          client_name: true
        }
      }),
      prisma.posts.findMany({
        take: 3,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          image: true,
          sdate: true,
          content: true,
          author: true
        }
      })
    ])

    return {
      homepage,
      strengths,
      services: [],
      testimonials,
      clients,
      recentPosts,
      sectors: []
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return {
      homepage: null,
      strengths: [],
      services: [],
      testimonials: [],
      clients: [],
      recentPosts: [],
      sectors: []
    }
  }
})
