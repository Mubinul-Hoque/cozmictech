import { prisma } from '../../utils/prisma'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // ─── GET ───────────────────────────────────────────────────────────────────
  if (method === 'GET') {
    await requirePermission(event, 'pages', 'view')
    try {
      const homeSections = await prisma.page_sections.findMany({ where: { page_slug: 'home' } })
      const getSec = (key: string) => homeSections.find(s => s.section_key === key) || {} as any

      const hero = getSec('hero_slider')
      const glance = getSec('glance')
      const experience = getSec('experience')
      const projects = getSec('projects')
      const services = getSec('services_intro')
      const strength = getSec('strength_intro')
      const testimonials = getSec('testimonials_intro')
      const recentBlog = getSec('recent_blog_intro')
      const sustainable = getSec('sustainable')
      const buildingTech = getSec('building_tech')
      const career = getSec('career_intro')
      const cta = getSec('cta')
      const clients = getSec('clients_intro')

      const content = {
        hero_images: hero?.image ? JSON.parse(hero.image) : [],

        glance_title: glance.title || 'At a Glance',
        glance_description: glance.content || '',
        glance_img: glance.image || 'glance.jpg',

        Exp_title: experience.title || 'Years of Experience',
        exp_year: experience.counter_number || '15+',

        pro_title: projects.title || 'Successful Projects',
        pro_nos: projects.counter_number || '250+',

        title3: services.title || 'Our Services', tag3: services.subtitle_or_tag || '',
        title4: strength.title || 'Our Strengths', tag4: strength.subtitle_or_tag || '',
        strengths_image: strength.image || '',
        title5: testimonials.title || 'Testimonials', tag5: testimonials.subtitle_or_tag || '',
        title6: recentBlog.title || 'Recent News & Insights', tag6: recentBlog.subtitle_or_tag || '',
        title10: clients.title || 'Trusted By', tag10: clients.subtitle_or_tag || '',

        title7: sustainable.title || '', content7: sustainable.content || '', image7: sustainable.image || '',
        title8: buildingTech.title || '', content8: buildingTech.content || '', image8: buildingTech.image || '',
        title9: career.title || '', content9: career.content || '', image9: career.image || '',

        cta_title: cta.title || 'Ready to Build Bangladesh’s Next Infrastructure Milestone?',
        cta_content: cta.content || 'Our multi-disciplinary team of senior geotechnical consultants, structural specialists, and architects is ready to advise on your project from ground investigation through to full construction supervision.',
      }

      return { success: true, content }
    } catch (error: any) {
      console.error('Error fetching admin home page content:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch home page content' })
    }
  }

  // ─── POST ──────────────────────────────────────────────────────────────────
  if (method === 'POST') {
    await requirePermission(event, 'pages', 'edit')
    try {
      const body = await readBody(event)

      const safeSanitize = (val: unknown): string => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      let hero_images: any = []
      if (Array.isArray(body?.hero_images)) {
        hero_images = body.hero_images.map((img: any) => String(img).trim()).filter(Boolean)
      } else if (body?.hero_images) {
        hero_images = [String(body.hero_images).trim()].filter(Boolean)
      }

      const homeSections = await prisma.page_sections.findMany({ where: { page_slug: 'home' } })
      const upsertSection = async (key: string, data: any) => {
        const existing = homeSections.find(s => s.section_key === key)
        if (existing) {
          await prisma.page_sections.update({ where: { id: existing.id }, data })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'home', section_key: key, ...data } })
        }
      }

      if (body?.hero_images !== undefined) {
        await upsertSection('hero_slider', { image: JSON.stringify(hero_images) })
      }
      if (body?.glance_title !== undefined || body?.glance_description !== undefined || body?.glance_img !== undefined) {
        await upsertSection('glance', { title: safeSanitize(body?.glance_title), content: safeSanitize(body?.glance_description), image: safeSanitize(body?.glance_img) })
      }
      if (body?.Exp_title !== undefined || body?.exp_year !== undefined) {
        await upsertSection('experience', { title: safeSanitize(body?.Exp_title), counter_number: safeSanitize(body?.exp_year) })
      }
      if (body?.pro_title !== undefined || body?.pro_nos !== undefined) {
        await upsertSection('projects', { title: safeSanitize(body?.pro_title), counter_number: safeSanitize(body?.pro_nos) })
      }
      if (body?.title3 !== undefined || body?.tag3 !== undefined) {
        await upsertSection('services_intro', { title: safeSanitize(body?.title3), subtitle_or_tag: safeSanitize(body?.tag3) })
      }
      if (body?.title4 !== undefined || body?.tag4 !== undefined || body?.strengths_image !== undefined) {
        await upsertSection('strength_intro', { title: safeSanitize(body?.title4), subtitle_or_tag: safeSanitize(body?.tag4), image: safeSanitize(body?.strengths_image) })
      }
      if (body?.title5 !== undefined || body?.tag5 !== undefined) {
        await upsertSection('testimonials_intro', { title: safeSanitize(body?.title5), subtitle_or_tag: safeSanitize(body?.tag5) })
      }
      if (body?.title6 !== undefined || body?.tag6 !== undefined) {
        await upsertSection('recent_blog_intro', { title: safeSanitize(body?.title6), subtitle_or_tag: safeSanitize(body?.tag6) })
      }
      if (body?.title10 !== undefined || body?.tag10 !== undefined) {
        await upsertSection('clients_intro', { title: safeSanitize(body?.title10), subtitle_or_tag: safeSanitize(body?.tag10) })
      }
      if (body?.title7 !== undefined || body?.content7 !== undefined || body?.image7 !== undefined) {
        await upsertSection('sustainable', { title: safeSanitize(body?.title7), content: safeSanitize(body?.content7), image: safeSanitize(body?.image7) })
      }
      if (body?.title8 !== undefined || body?.content8 !== undefined || body?.image8 !== undefined) {
        await upsertSection('building_tech', { title: safeSanitize(body?.title8), content: safeSanitize(body?.content8), image: safeSanitize(body?.image8) })
      }
      if (body?.title9 !== undefined || body?.content9 !== undefined || body?.image9 !== undefined) {
        await upsertSection('career_intro', { title: safeSanitize(body?.title9), content: safeSanitize(body?.content9), image: safeSanitize(body?.image9) })
      }
      if (body?.cta_title !== undefined || body?.cta_content !== undefined) {
        await upsertSection('cta', { title: safeSanitize(body?.cta_title), content: safeSanitize(body?.cta_content) })
      }

      await clearPublicCache()
      return { success: true, message: 'Home page content saved successfully' }
    } catch (error: any) {
      console.error('Error saving admin home page content:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save home page content' })
    }
  }
})
