import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 12
  const search = (query.search as string) || ''
  const sectorId = query.sectorId && query.sectorId !== 'all' ? parseInt(query.sectorId as string) : null

  const skip = (page - 1) * limit

  const whereClause: any = {}
  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { location: { contains: search } },
      { services_rendered: { contains: search } },
      { feature: { contains: search } },
      { description: { contains: search } }
    ]
  }
  if (sectorId) {
    whereClause.sector_id = sectorId
  }

  const [projects, totalProjects, sectorGroups, categories, sectors] = await Promise.all([
    // Paginated projects
    prisma.projects.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        title: true,
        images_json: true,
        status: true,
        start_date: true,
        end_date: true,
        sector_id: true,
        feature: true,
        location: true,
        services_rendered: true,
        project_cost: true,
        client_id: true,
        story: true,
        area: true,
        height: true,
        project_categories_link: {
          select: { category_id: true }
        }
      }
    }),
    // Total matched projects for pagination
    prisma.projects.count({ where: whereClause }),
    // Counts for each sector (independent of sector filter, but matching search)
    prisma.projects.groupBy({
      by: ['sector_id'],
      where: search ? { OR: whereClause.OR } : {},
      _count: { id: true }
    }),
    prisma.categories.findMany({
      select: { id: true, name: true }
    }),
    prisma.sectors.findMany({
      select: { id: true, name: true }
    })
  ])

  const mappedProjects = projects.map(p => ({
    ...p,
    images: p.images_json ? JSON.parse(p.images_json) : [],
    services: p.services_rendered || '',
    project_categories: p.project_categories_link.map(link => ({ category_id: link.category_id }))
  }))

  const mappedSectors = sectors.map(s => ({
    ...s,
    sector: s.name
  }))

  const sectorCounts: Record<string, number> = {}
  let allTotal = 0;
  sectorGroups.forEach(g => {
    if (g.sector_id) {
      sectorCounts[String(g.sector_id)] = g._count.id
      allTotal += g._count.id
    }
  })

  return { 
    projects: mappedProjects, 
    categories, 
    sectors: mappedSectors, 
    clients: [],
    sectorCounts,
    totalProjects: allTotal, // Total independent of sector filter (but with search)
    filteredTotal: totalProjects,
    totalPages: Math.ceil(totalProjects / limit),
    page
  }
})
