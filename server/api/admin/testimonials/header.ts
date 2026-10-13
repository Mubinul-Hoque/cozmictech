import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'
import { clearPublicCache } from '../../../utils/cache'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'testimonials', 'view')
    try {
      const section = await prisma.page_sections.findFirst({
        where: { page_slug: 'home', section_key: 'testimonials_intro' }
      })

      return {
        success: true,
        header: {
          title: section?.title || 'Client Endorsements',
          tagline: section?.subtitle_or_tag || 'What industry partners and project developers say about our engineering precision.'
        }
      }
    } catch (error: any) {
      console.error('Error fetching testimonials header:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch testimonials header' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'testimonials', 'edit')
    try {
      const body = await readBody(event)
      const safeSanitize = (val: any) => (val === undefined || val === null) ? '' : String(val)

      const existing = await prisma.page_sections.findFirst({
        where: { page_slug: 'home', section_key: 'testimonials_intro' }
      })

      const data = {
        title: safeSanitize(body.title || 'Client Endorsements'),
        subtitle_or_tag: safeSanitize(body.tagline || '')
      }

      if (existing) {
        await prisma.page_sections.update({ where: { id: existing.id }, data })
      } else {
        await prisma.page_sections.create({
          data: { page_slug: 'home', section_key: 'testimonials_intro', ...data }
        })
      }

      await clearPublicCache()
      return { success: true, message: 'Testimonials section header saved successfully' }
    } catch (error: any) {
      console.error('Error saving testimonials header:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save testimonials header' })
    }
  }
})
