import { prisma } from '../../utils/prisma'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'pages', 'view');
    try {
      const [aboutSections, allSettings] = await Promise.all([
        prisma.page_sections.findMany({ where: { page_slug: 'about' } }),
        prisma.settings.findMany()
      ])

      const getSec = (key: string) => aboutSections.find(s => s.section_key === key) || {} as any
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')

      const story = getSec('our_story')
      const mission = getSec('mission')
      const vision = getSec('vision')
      const team = getSec('our_team_intro')
      const cta = getSec('cta_banner')

      await clearPublicCache();
      return {
        success: true,
        about: {
          tagline: settingsMap['about_tagline'] || 'Cozmic Technology - About Us',
          est: settingsMap['about_est'] || '2015',
          location_text: settingsMap['about_location_text'] || 'Dhaka, Bangladesh',
          happy_icon: settingsMap['about_happy_icon'] || 'lucide:smile',
          happy_client: parseInt(settingsMap['about_happy_client'] || '120'),
          happy_label: settingsMap['about_happy_label'] || 'Happy Clients',
          projects_icon: settingsMap['about_projects_icon'] || 'lucide:briefcase',
          project_nos: parseInt(settingsMap['about_project_nos'] || '250'),
          project_label: settingsMap['about_project_label'] || 'Projects Completed',
          support_icon: settingsMap['about_support_icon'] || 'lucide:headset',
          hrs_support: parseInt(settingsMap['about_hrs_support'] || '1740'),
          support_label: settingsMap['about_support_label'] || 'Hours of Support',
          emp_icon: settingsMap['about_emp_icon'] || 'lucide:hard-hat',
          emp_nos: parseInt(settingsMap['about_emp_nos'] || '35'),
          emp_label: settingsMap['about_emp_label'] || 'Hard Workers',

          hero_eyebrow: settingsMap['about_hero_eyebrow'] || 'Studio — Cozmic Technology',
          mission_eyebrow: settingsMap['about_mission_eyebrow'] || 'Mission & Focus',
          mission_label: settingsMap['about_mission_label'] || 'Committed to Precision',
          guarantee_label: settingsMap['about_guarantee_label'] || 'Our Guarantee',
          disciplines_label: settingsMap['about_disciplines_label'] || 'Core Disciplines',
          vision_eyebrow: settingsMap['about_vision_eyebrow'] || 'Looking Forward',
          team_eyebrow: settingsMap['about_team_eyebrow'] || 'The Team',

          story_title: story.title || 'Our Story',
          story_body: story.content || '',
          story_body2: story.subtitle_or_tag || '',
          story_image: story.image || '',

          mission_title: mission.title || 'OUR MISSION',
          mission_body: mission.content || '',
          mission_image: mission.image || '',
          mission_is_active: mission.is_active !== false,

          vision_title: vision.title || 'OUR VISION',
          vision_body: vision.content || '',
          vision_image: vision.image || '',
          vision_is_active: vision.is_active !== false,

          team_title: team.title || 'Our Team',
          team_description: team.content || 'At Cozmic Technology, we believe that great engineering and design begins with good people. Our team combines creativity, technical knowledge and a deep understanding of context to create environments that are thoughtful, sustainable and enduring.\n\nTogether, we are united by a shared commitment to design and engineering that serves people, respects place and stands the test of time.\n\nEvery project is shaped by a diverse group of engineers, architects, planners, researchers and project managers working together toward a common purpose. Different perspectives, experiences and expertise come together to transform complexity into clarity and ideas into reality.',

          cta_eyebrow: cta.subtitle_or_tag || 'Collaboration • Excellence',
          cta_heading: cta.title || 'Good People. Good Engineering.',
          cta_body: cta.content || 'Ready to turn your ambitious engineering, geotechnical, or architectural vision into enduring reality? Our team is here to collaborate with you.'
        }
      }
    } catch (error: any) {
      console.error('Error fetching admin about config:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch about config' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'pages', 'edit');
    try {
      const body = await readBody(event)
      
      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return '';
        return String(val);
      }

      // 1. Update Global Settings for about variables
      const settingsToUpdate = {
        'about_tagline': safeSanitize(body.tagline),
        'about_est': safeSanitize(body.est),
        'about_location_text': safeSanitize(body.location_text || 'Dhaka, Bangladesh'),
        'about_happy_icon': safeSanitize(body.happy_icon || 'lucide:smile'),
        'about_happy_client': String(body.happy_client || 0),
        'about_happy_label': safeSanitize(body.happy_label || 'Happy Clients'),
        'about_projects_icon': safeSanitize(body.projects_icon || 'lucide:briefcase'),
        'about_project_nos': String(body.project_nos || 0),
        'about_project_label': safeSanitize(body.project_label || 'Projects Completed'),
        'about_support_icon': safeSanitize(body.support_icon || 'lucide:headset'),
        'about_hrs_support': String(body.hrs_support || 0),
        'about_support_label': safeSanitize(body.support_label || 'Hours of Support'),
        'about_emp_icon': safeSanitize(body.emp_icon || 'lucide:hard-hat'),
        'about_emp_nos': String(body.emp_nos || 0),
        'about_emp_label': safeSanitize(body.emp_label || 'Hard Workers'),
        'about_hero_eyebrow': safeSanitize(body.hero_eyebrow || 'Studio — Cozmic Technology'),
        'about_mission_eyebrow': safeSanitize(body.mission_eyebrow || 'Mission & Focus'),
        'about_mission_label': safeSanitize(body.mission_label || 'Committed to Precision'),
        'about_guarantee_label': safeSanitize(body.guarantee_label || 'Our Guarantee'),
        'about_disciplines_label': safeSanitize(body.disciplines_label || 'Core Disciplines'),
        'about_vision_eyebrow': safeSanitize(body.vision_eyebrow || 'Looking Forward'),
        'about_team_eyebrow': safeSanitize(body.team_eyebrow || 'The Team'),
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      // 2. Update Page Sections (About)
      const aboutSections = await prisma.page_sections.findMany({ where: { page_slug: 'about' } })
      
      const upsertSection = async (key: string, data: any) => {
        const existing = aboutSections.find(s => s.section_key === key)
        if (existing) {
          await prisma.page_sections.update({ where: { id: existing.id }, data })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'about', section_key: key, ...data } })
        }
      }

      await upsertSection('our_story', { title: safeSanitize(body.story_title), content: safeSanitize(body.story_body), subtitle_or_tag: safeSanitize(body.story_body2), image: safeSanitize(body.story_image) })
      await upsertSection('mission', { title: safeSanitize(body.mission_title), content: safeSanitize(body.mission_body), image: safeSanitize(body.mission_image), is_active: body.mission_is_active !== false })
      await upsertSection('vision', { title: safeSanitize(body.vision_title), content: safeSanitize(body.vision_body), image: safeSanitize(body.vision_image), is_active: body.vision_is_active !== false })
      await upsertSection('our_team_intro', { title: safeSanitize(body.team_title), content: safeSanitize(body.team_description) })
      await upsertSection('cta_banner', { title: safeSanitize(body.cta_heading), content: safeSanitize(body.cta_body), subtitle_or_tag: safeSanitize(body.cta_eyebrow) })

      await clearPublicCache();
      return {
        success: true,
        message: 'About Us page saved successfully'
      }
    } catch (error: any) {
      console.error('Error saving admin about config:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save about config' })
    }
  }
})
