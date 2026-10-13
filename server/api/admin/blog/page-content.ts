import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'blog', 'view')
    try {
      const [section, settingRow, recentBlogIntro] = await Promise.all([
        prisma.page_sections.findFirst({ where: { page_slug: 'blog', section_key: 'hero' } }),
        prisma.settings.findUnique({ where: { setting_key: 'blog_hero_eyebrow' } }),
        prisma.page_sections.findFirst({ where: { page_slug: 'home', section_key: 'recent_blog_intro' } })
      ])

      return {
        success: true,
        content: {
          hero_eyebrow: settingRow?.setting_value || 'Perspectives • Journal • Insights',
          hero_heading: section?.title || 'News & Perspectives',
          hero_body: section?.content || 'Thought leadership, technical innovations, project milestones, and contemporary engineering discourse from our team across Bangladesh.',
          home_section_title: recentBlogIntro?.title || 'Recent News & Perspectives',
          home_section_tag: recentBlogIntro?.subtitle_or_tag || 'Discourse, field studies, and infrastructure progress from our engineering desk.'
        }
      }
    } catch (error: any) {
      console.error('Error fetching blog page content:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch blog page content' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'blog', 'edit')
    try {
      const body = await readBody(event)
      const safeSanitize = (val: any) => (val === undefined || val === null) ? '' : String(val)

      await prisma.settings.upsert({
        where: { setting_key: 'blog_hero_eyebrow' },
        update: { setting_value: safeSanitize(body.hero_eyebrow || 'Perspectives • Journal • Insights') },
        create: { setting_key: 'blog_hero_eyebrow', setting_value: safeSanitize(body.hero_eyebrow || 'Perspectives • Journal • Insights') }
      })

      const existing = await prisma.page_sections.findFirst({ where: { page_slug: 'blog', section_key: 'hero' } })
      const data = {
        title: safeSanitize(body.hero_heading || 'News & Perspectives'),
        content: safeSanitize(body.hero_body || 'Thought leadership, technical innovations, project milestones, and contemporary engineering discourse from our team across Bangladesh.')
      }
      if (existing) {
        await prisma.page_sections.update({ where: { id: existing.id }, data })
      } else {
        await prisma.page_sections.create({ data: { page_slug: 'blog', section_key: 'hero', ...data } })
      }

      if (body.home_section_title !== undefined || body.home_section_tag !== undefined) {
        const existingRecent = await prisma.page_sections.findFirst({
          where: { page_slug: 'home', section_key: 'recent_blog_intro' }
        })
        const recentData = {
          title: safeSanitize(body.home_section_title || 'Recent News & Perspectives'),
          subtitle_or_tag: safeSanitize(body.home_section_tag || '')
        }
        if (existingRecent) {
          await prisma.page_sections.update({ where: { id: existingRecent.id }, data: recentData })
        } else {
          await prisma.page_sections.create({
            data: { page_slug: 'home', section_key: 'recent_blog_intro', ...recentData }
          })
        }
      }

      await clearPublicCache()
      return { success: true, message: 'Blog page header saved successfully' }
    } catch (error: any) {
      console.error('Error saving blog page content:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save blog page content' })
    }
  }
})
