import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const careers = await prisma.career.findMany({
      where: { status: 'Active' },
      orderBy: { published: 'desc' },
      select: {
        id: true,
        post: true,
        location: true,
        vacancy: true,
        emp_status: true,
        experience: true,
        salary: true,
        description: true,
        deadline: true
      }
    })
    return {
      success: true,
      data: careers
    }
  } catch (error) {
    console.error('Error fetching public careers:', error)
    return {
      success: false,
      data: []
    }
  }
})
