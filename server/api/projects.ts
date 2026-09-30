import { prisma } from '../utils/prisma'

let metadataCache: {
  categories: any[];
  sectors: any[];
  availableYears: number[];
  expiresAt: number;
} | null = null;

export function invalidateProjectsMetadataCache() {
  metadataCache = null;
}

async function getProjectsFilterMetadata() {
  const now = Date.now();
  if (metadataCache && metadataCache.expiresAt > now) {
    return metadataCache;
  }

  const [categories, sectors, allDates] = await Promise.all([
    prisma.categories.findMany({
      where: {
        project_categories_link: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: { project_categories_link: true }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.sectors.findMany({
      where: {
        projects: {
          some: {}
        }
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.projects.findMany({
      select: { start_date: true, end_date: true }
    })
  ]);

  const mappedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    count: c._count?.project_categories_link || 0
  }));

  const mappedSectors = sectors.map(s => ({
    ...s,
    sector: s.name
  }));

  const yearSet = new Set<number>();
  allDates.forEach(d => {
    if (d.start_date) yearSet.add(new Date(d.start_date).getFullYear());
    if (d.end_date) yearSet.add(new Date(d.end_date).getFullYear());
  });
  const availableYears = Array.from(yearSet).sort((a, b) => b - a);

  metadataCache = {
    categories: mappedCategories,
    sectors: mappedSectors,
    availableYears,
    expiresAt: now + 5 * 60 * 1000 // Cache for 5 minutes
  };

  return metadataCache;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 12
  const search = ((query.search as string) || '').trim()
  const sectorId = query.sectorId && query.sectorId !== 'all' ? parseInt(query.sectorId as string) : null
  // Category filter: supports single categoryId or multi-select categoryIds (array or comma-separated string)
  const rawCat = query.categoryIds || query.categoryId
  let categoryIds: number[] = []
  if (Array.isArray(rawCat)) {
    categoryIds = rawCat.map(c => parseInt(c as string)).filter(c => !isNaN(c) && c > 0)
  } else if (typeof rawCat === 'string' && rawCat !== 'all' && rawCat.trim() !== '') {
    categoryIds = rawCat.split(',').map(c => parseInt(c.trim())).filter(c => !isNaN(c) && c > 0)
  }

  const status = (query.status as string) || null
  const year = query.year && query.year !== 'all' ? query.year as string : null

  const minContract = query.minContractValue !== undefined && query.minContractValue !== '' ? parseFloat(query.minContractValue as string) : null
  const maxContract = query.maxContractValue !== undefined && query.maxContractValue !== '' ? parseFloat(query.maxContractValue as string) : null
  const minProject = query.minProjectValue !== undefined && query.minProjectValue !== '' ? parseFloat(query.minProjectValue as string) : null
  const maxProject = query.maxProjectValue !== undefined && query.maxProjectValue !== '' ? parseFloat(query.maxProjectValue as string) : null

  const skip = (page - 1) * limit

  const andConditions: any[] = []

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search } },
        { location: { contains: search } },
        { services_rendered: { contains: search } },
        { description: { contains: search } }
      ]
    })
  }

  if (sectorId) {
    andConditions.push({ sector_id: sectorId })
  }

  if (categoryIds.length > 0) {
    andConditions.push({
      project_categories_link: {
        some: {
          category_id: { in: categoryIds }
        }
      }
    })
  }

  if (status && (status === 'Completed' || status === 'Ongoing')) {
    andConditions.push({ status })
  }

  if (year) {
    const y = parseInt(year)
    if (!isNaN(y)) {
      const startOfYear = new Date(`${y}-01-01T00:00:00.000Z`)
      const endOfYear = new Date(`${y}-12-31T23:59:59.999Z`)
      andConditions.push({
        OR: [
          {
            start_date: { lte: endOfYear },
            end_date: { gte: startOfYear }
          },
          {
            start_date: { gte: startOfYear, lte: endOfYear }
          },
          {
            end_date: { gte: startOfYear, lte: endOfYear }
          }
        ]
      })
    }
  }

  // Contract value & Project value range filtering
  if (minContract !== null || maxContract !== null || minProject !== null || maxProject !== null) {
    const allCosts = await prisma.projects.findMany({
      select: { id: true, project_cost: true, service_cost: true }
    })
    const parseNum = (val: string | null) => {
      if (!val) return null
      const cleaned = val.replace(/[^0-9.]/g, '')
      if (!cleaned) return null
      const n = parseFloat(cleaned)
      return isNaN(n) ? null : n
    }
    const matchedIds = allCosts.filter(p => {
      if (minContract !== null || maxContract !== null) {
        const v = parseNum(p.service_cost)
        if (v === null) return false
        if (minContract !== null && v < minContract) return false
        if (maxContract !== null && v > maxContract) return false
      }
      if (minProject !== null || maxProject !== null) {
        const v = parseNum(p.project_cost)
        if (v === null) return false
        if (minProject !== null && v < minProject) return false
        if (maxProject !== null && v > maxProject) return false
      }
      return true
    }).map(p => p.id)

    andConditions.push({ id: { in: matchedIds } })
  }

  const whereClause = andConditions.length > 0 ? { AND: andConditions } : {}

  // For sector counts, keep all filters except sector_id so the tabs stay accurate
  const andConditionsWithoutSector = andConditions.filter(c => !('sector_id' in c))
  const whereWithoutSector = andConditionsWithoutSector.length > 0 ? { AND: andConditionsWithoutSector } : {}

  // Fetch metadata (categories, sectors, availableYears) from memory cache or DB
  const metadataPromise = getProjectsFilterMetadata();

  const [projects, totalProjects, sectorGroups, metadata] = await Promise.all([
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
        location: true,
        services_rendered: true,
        project_cost: true,
        service_cost: true,
        client_id: true,
        project_categories_link: {
          select: { category_id: true }
        }
      }
    }),
    // Total matched projects for pagination
    prisma.projects.count({ where: whereClause }),
    // Counts for each sector (independent of sector filter, but matching other filters)
    prisma.projects.groupBy({
      by: ['sector_id'],
      where: whereWithoutSector,
      _count: { id: true }
    }),
    metadataPromise
  ])

  const mappedProjects = projects.map(p => ({
    ...p,
    images: p.images_json ? JSON.parse(p.images_json) : [],
    services: p.services_rendered || '',
    project_categories: p.project_categories_link.map(link => ({ category_id: link.category_id }))
  }))

  const sectorCounts: Record<string, number> = {}
  let allTotal = 0
  sectorGroups.forEach(g => {
    if (g.sector_id) {
      sectorCounts[String(g.sector_id)] = g._count.id
      allTotal += g._count.id
    }
  })

  return { 
    projects: mappedProjects, 
    categories: metadata.categories, 
    sectors: metadata.sectors, 
    availableYears: metadata.availableYears,
    clients: [],
    sectorCounts,
    totalProjects: allTotal,
    filteredTotal: totalProjects,
    totalPages: Math.ceil(totalProjects / limit),
    page
  }
})
