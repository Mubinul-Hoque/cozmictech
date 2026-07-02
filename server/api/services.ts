import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const services = await prisma.services.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        short_description: true
      }
    })

    return {
      sectors: services,
      services: [],
      servicesChild: []
    }
  } catch (error) {
    console.error('Error fetching services data:', error)
    return {
      sectors: [],
      services: [],
      servicesChild: []
    }
  }
})
