import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const [projects, categories, sectors] = await Promise.all([
      prisma.projects.findMany({
        include: {
          project_categories: {
            select: {
              category_id: true
            }
          }
        }
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true
        }
      }),
      prisma.sectors.findMany({
        select: {
          id: true,
          sector: true
        }
      })
    ])

    return {
      projects,
      categories,
      sectors,
      clients: []
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return {
      projects: [],
      categories: [],
      sectors: [],
      clients: []
    }
  }
})
