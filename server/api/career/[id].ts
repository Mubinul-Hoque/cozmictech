import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing career ID' })
  }
  const id = parseInt(idStr)

  try {
    const career = await prisma.career.findUnique({
      where: { id }
    })
    if (!career || career.status !== 'Active') {
      throw createError({ statusCode: 404, statusMessage: 'Job opening not found' })
    }
    return {
      success: true,
      data: career
    }
  } catch (error: any) {
    console.error('Error fetching public career detail:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch job details' })
  }
})
