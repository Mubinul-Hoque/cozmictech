import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanOrphans() {
  console.log('Fetching valid IDs...')
  
  const [clients, sectors, services, categories, postCategories] = await Promise.all([
    prisma.clients.findMany({ select: { id: true } }),
    prisma.sectors.findMany({ select: { id: true } }),
    prisma.services.findMany({ select: { id: true } }),
    prisma.category.findMany({ select: { id: true } }),
    prisma.post_category.findMany({ select: { id: true } })
  ])
  
  const clientIds = new Set(clients.map(c => c.id))
  const sectorIds = new Set(sectors.map(c => c.id))
  const serviceIds = new Set(services.map(c => c.id))
  const categoryIds = new Set(categories.map(c => c.id))
  const postCatIds = new Set(postCategories.map(c => c.id))
  
  console.log('Cleaning projects (client_id)...')
  const projects = await prisma.projects.findMany()
  for (const p of projects) {
    if (p.client_id !== null && !clientIds.has(p.client_id)) {
      await prisma.projects.update({ where: { id: p.id }, data: { client_id: null } })
      console.log(`Cleaned client_id for project ${p.id}`)
    }
  }

  console.log('Cleaning posts (post_catid)...')
  const posts = await prisma.posts.findMany()
  for (const p of posts) {
    if (!postCatIds.has(p.post_catid)) {
      await prisma.posts.delete({ where: { id: p.id } })
      console.log(`Deleted orphan post ${p.id}`)
    }
  }

  console.log('Cleaning services_child...')
  const scs = await prisma.services_child.findMany()
  for (const sc of scs) {
    if (!sectorIds.has(sc.sector_id) || !serviceIds.has(sc.services_id)) {
      await prisma.services_child.delete({ where: { id: sc.id } })
      console.log(`Deleted orphan services_child ${sc.id}`)
    }
  }

  console.log('Cleaning sub_category...')
  const subs = await prisma.sub_category.findMany()
  for (const sub of subs) {
    if (!sectorIds.has(sub.sec_id) || !categoryIds.has(sub.cat_id)) {
      await prisma.sub_category.delete({ where: { id: sub.id } })
      console.log(`Deleted orphan sub_category ${sub.id}`)
    }
  }

  console.log('Done.')
}

cleanOrphans()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
