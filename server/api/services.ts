import { prisma } from '../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  const [services, servicesIntro] = await Promise.all([
    prisma.services.findMany({
      select: { id: true, name: true, icon: true, short_description: true }
    }),
    prisma.page_sections.findFirst({
      where: { page_slug: 'home', section_key: 'services_intro' }
    })
  ])

  return {
    sectors: services,
    services: [],
    servicesChild: [],
    homepage: {
      title3: servicesIntro?.title || 'Our Services',
      tag3: servicesIntro?.subtitle_or_tag || 'We provide reliable, efficient, and cost-effective geotechnical investigation and engineering consultancy services to firms nationwide.'
    }
  }
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'services-page',
  getKey: () => 'services-v2'
})
