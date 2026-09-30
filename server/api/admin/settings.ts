import { prisma } from '../../utils/prisma'
import { getSessionTimeoutHours, setSessionTimeoutHours } from '../../utils/session'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // ─── GET ───────────────────────────────────────────────────────────────────
  if (method === 'GET') {
    await requirePermission(event, 'global_settings', 'view')
    try {
      const [homeSections, allSettings, socials] = await Promise.all([
        prisma.page_sections.findMany({ where: { page_slug: 'home' } }),
        prisma.settings.findMany(),
        prisma.social_links.findMany()
      ])

      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value || ''
      })

      const socialMap: Record<string, string> = { twitter: '#', fb: '#', insta: '#', linkedin: '#' }
      socials.forEach(s => {
        const name = s.platform_name?.toLowerCase()
        if (name === 'twitter') socialMap.twitter = s.url || '#'
        if (name === 'facebook') socialMap.fb = s.url || '#'
        if (name === 'instagram') socialMap.insta = s.url || '#'
        if (name === 'linkedin') socialMap.linkedin = s.url || '#'
      })

      // Construct homepage object from sections
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

      const homepage = {
        company_title: settingsMap['company_title'] || 'Cozmic Technology',
        slogan: settingsMap['slogan'] || "Let's work together to make great things possible.",
        hero_images: hero?.image ? JSON.parse(hero.image) : [],
        logo: settingsMap['logo'] || '',
        favicon: settingsMap['favicon'] || '',
        theme: settingsMap['theme'] || 'theme-default',

        glance_title: glance.title || 'At a Glance',
        glance_description: glance.content || '',
        glance_img: glance.image || 'glance.jpg',

        Exp_title: experience.title || 'Years of Experience',
        exp_year: experience.counter_number || '15+',
        
        pro_title: projects.title || 'Successful Projects',
        pro_nos: projects.counter_number || '250+',
        
        title1: '', tag1: '', title2: '', tag2: '', // left empty for backward compatibility
        title3: services.title || 'Our Services', tag3: services.subtitle_or_tag || '',
        title4: strength.title || 'Our Strengths', tag4: strength.subtitle_or_tag || '',
        title5: testimonials.title || 'Testimonials', tag5: testimonials.subtitle_or_tag || '',
        title6: recentBlog.title || 'Recent News & Insights', tag6: recentBlog.subtitle_or_tag || '',
        
        title7: sustainable.title || '', content7: sustainable.content || '', image7: sustainable.image || '',
        title8: buildingTech.title || '', content8: buildingTech.content || '', image8: buildingTech.image || '',
        title9: career.title || '', content9: career.content || '', image9: career.image || '',
      }

      const contact = {
        sec_title: 'Contact',
        company_title: settingsMap['company_title'] || 'Cozmic Technology',
        address: settingsMap['contact_address'] || '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207',
        phone: settingsMap['contact_phone'] || '+88 01894932401',
        cell: settingsMap['contact_cell'] || '+88 01894932401',
        email: settingsMap['contact_email'] || 'info@cozmictech.com',
        email2: settingsMap['contact_email2'] || 'info@cozmictech.com',
        map: settingsMap['contact_map'] || ''
      }

      const footer = {
        copyright_text: settingsMap['footer_copyright_text'] || settingsMap['company_title'] || 'Cozmic Technology',
        copyright_year: settingsMap['footer_copyright_year'] || '',
        copyright_auto_year: settingsMap['footer_copyright_auto_year'] !== 'false',
        designed_by_text: settingsMap['footer_designed_by_text'] || 'mDynamic',
        designed_by_prefix: settingsMap['footer_designed_by_prefix'] || 'Designed by',
        designed_by_url: settingsMap['footer_designed_by_url'] || 'https://mdynamic.us/'
      }

      const sessionTimeoutHours = await getSessionTimeoutHours();
      await clearPublicCache();
      return {
        success: true,
        homepage,
        contact,
        social: socialMap,
        footer,
        session_timeout_hours: sessionTimeoutHours,
        isSuperAdmin: event.context.user?.role === 'SuperAdmin'
      }
    } catch (error: any) {
      console.error('Error fetching admin settings:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings' })
    }
  }

  // ─── POST ──────────────────────────────────────────────────────────────────
  if (method === 'POST') {
    await requirePermission(event, 'global_settings', 'edit')
    try {
      const body = await readBody(event)
      const { homepage, contact, social, footer } = body

      const safeSanitize = (val: unknown): string => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      let hero_images: any = []
      if (Array.isArray(homepage?.hero_images)) {
        hero_images = homepage.hero_images.map((img: any) => String(img).trim()).filter(Boolean)
      } else if (homepage?.hero_images) {
        hero_images = [String(homepage.hero_images).trim()].filter(Boolean)
      }

      // 1. Update Global Settings
      const settingsToUpdate: Record<string, string> = {
        'company_title': safeSanitize(homepage?.company_title),
        'slogan': safeSanitize(homepage?.slogan),
        'logo': safeSanitize(homepage?.logo),
        'favicon': safeSanitize(homepage?.favicon),
        'theme': safeSanitize(homepage?.theme || 'theme-default'),
        'footer_copyright_text': safeSanitize(footer?.copyright_text),
        'footer_copyright_year': safeSanitize(footer?.copyright_year),
        'footer_copyright_auto_year': footer?.copyright_auto_year ? 'true' : 'false',
        'footer_designed_by_text': safeSanitize(footer?.designed_by_text),
        'footer_designed_by_prefix': safeSanitize(footer?.designed_by_prefix || 'Designed by'),
        'footer_designed_by_url': safeSanitize(footer?.designed_by_url)
      }

      if (contact) {
        settingsToUpdate['contact_address'] = safeSanitize(contact.address)
        settingsToUpdate['contact_phone'] = safeSanitize(contact.phone)
        settingsToUpdate['contact_cell'] = safeSanitize(contact.cell)
        settingsToUpdate['contact_email'] = safeSanitize(contact.email)
        settingsToUpdate['contact_email2'] = safeSanitize(contact.email2)
        settingsToUpdate['contact_map'] = safeSanitize(contact.map)
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      // Update session timeout if provided and user is SuperAdmin
      if (body.session_timeout_hours !== undefined) {
        const currentUser = event.context.user;
        if (currentUser?.role === 'SuperAdmin') {
          await setSessionTimeoutHours(Number(body.session_timeout_hours));
        }
      }

      // 2. Update Page Sections (Home)
      const homeSections = await prisma.page_sections.findMany({ where: { page_slug: 'home' } })
      
      const upsertSection = async (key: string, data: any) => {
        const existing = homeSections.find(s => s.section_key === key)
        if (existing) {
          await prisma.page_sections.update({ where: { id: existing.id }, data })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'home', section_key: key, ...data } })
        }
      }

      await upsertSection('hero_slider', { image: JSON.stringify(hero_images) })
      await upsertSection('glance', { title: safeSanitize(homepage?.glance_title), content: safeSanitize(homepage?.glance_description), image: safeSanitize(homepage?.glance_img) })
      await upsertSection('experience', { title: safeSanitize(homepage?.Exp_title), counter_number: safeSanitize(homepage?.exp_year) })
      await upsertSection('projects', { title: safeSanitize(homepage?.pro_title), counter_number: safeSanitize(homepage?.pro_nos) })
      await upsertSection('services_intro', { title: safeSanitize(homepage?.title3), subtitle_or_tag: safeSanitize(homepage?.tag3) })
      await upsertSection('strength_intro', { title: safeSanitize(homepage?.title4), subtitle_or_tag: safeSanitize(homepage?.tag4) })
      await upsertSection('testimonials_intro', { title: safeSanitize(homepage?.title5), subtitle_or_tag: safeSanitize(homepage?.tag5) })
      await upsertSection('recent_blog_intro', { title: safeSanitize(homepage?.title6), subtitle_or_tag: safeSanitize(homepage?.tag6) })
      await upsertSection('sustainable', { title: safeSanitize(homepage?.title7), content: safeSanitize(homepage?.content7), image: safeSanitize(homepage?.image7) })
      await upsertSection('building_tech', { title: safeSanitize(homepage?.title8), content: safeSanitize(homepage?.content8), image: safeSanitize(homepage?.image8) })
      await upsertSection('career_intro', { title: safeSanitize(homepage?.title9), content: safeSanitize(homepage?.content9), image: safeSanitize(homepage?.image9) })

      // 3. Update Social Links
      if (social) {
        const dbSocials = await prisma.social_links.findMany()
        const socialTypeMap: Record<string, { link: string; icon: string }> = {
          twitter:   { link: social.twitter || '#', icon: 'bi bi-twitter' },
          facebook:  { link: social.fb      || '#', icon: 'bi bi-facebook' },
          instagram: { link: social.insta   || '#', icon: 'bi bi-instagram' },
          linkedin:  { link: social.linkedin || '#', icon: 'bi bi-linkedin' },
        }
        for (const [type, { link, icon }] of Object.entries(socialTypeMap)) {
          const sanitizedLink = safeSanitize(link)
          const match = dbSocials.find(s => s.platform_name?.toLowerCase() === type)
          if (match) {
            await prisma.social_links.update({ where: { id: match.id }, data: { url: sanitizedLink } })
          } else {
            await prisma.social_links.create({
              data: { platform_name: type.charAt(0).toUpperCase() + type.slice(1), icon, url: sanitizedLink }
            })
          }
        }
      }

      await clearPublicCache();
      return { success: true, message: 'Settings saved successfully' }
    } catch (error: any) {
      console.error('Error saving admin settings:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save settings' })
    }
  }
})
