import { prisma } from '../../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  try {
    const [careers, homepageSection] = await Promise.all([
      prisma.careers.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          post: true,
          location: true,
          vacancy: true,
          employment_status: true,
          experience: true,
          salary: true,
          description: true,
          deadline: true
        }
      }),
      prisma.page_sections.findFirst({
        where: { page_slug: 'home', section_key: 'career_intro' }
      })
    ])

    const mappedCareers = careers.map(c => ({
      ...c,
      emp_status: c.employment_status
    }))

    return {
      success: true,
      data: mappedCareers,
      homepage: { 
        title9: homepageSection?.title || 'Join Our Team', 
        content9: homepageSection?.content || 'Explore career opportunities and build a fulfilling future with us. We are always looking for passionate engineers and design experts to contribute to Bangladesh\'s premium consultancy projects.' 
      }
    }
  } catch (error) {
    console.error('Error fetching public careers:', error)
    return {
      success: false,
      data: [],
      homepage: null
    }
  }
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'career-page',
  getKey: () => 'career-v2'
})
