import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing career ID' })
  }
  const id = parseInt(idStr)

  try {
    const [career, contactSettings] = await Promise.all([
      prisma.careers.findUnique({
        where: { id }
      }),
      prisma.settings.findFirst({
        where: { setting_key: 'contact_email' }
      })
    ])

    if (!career || career.is_active !== true) {
      throw createError({ statusCode: 404, statusMessage: 'Job opening not found' })
    }

    const mappedCareer = {
      ...career,
      emp_status: career.employment_status,
      Edu_Qlty: career.education_quality,
      other_beninifs: career.other_benefits
    }

    return {
      success: true,
      data: mappedCareer,
      contactEmail: contactSettings?.setting_value || 'career@cozmictech.com'
    }
  } catch (error: any) {
    console.error('Error fetching public career detail:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch job details' })
  }
})
