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

      await clearPublicCache();
      return {
        success: true,
        about: {
          tagline: settingsMap['about_tagline'] || 'Cozmic Technology - About Us',
          est: settingsMap['about_est'] || '2015',
          happy_icon: settingsMap['about_happy_icon'] || 'lucide:smile',
          happy_client: parseInt(settingsMap['about_happy_client'] || '120'),
          projects_icon: settingsMap['about_projects_icon'] || 'lucide:briefcase',
          project_nos: parseInt(settingsMap['about_project_nos'] || '250'),
          support_icon: settingsMap['about_support_icon'] || 'lucide:headset',
          hrs_support: parseInt(settingsMap['about_hrs_support'] || '1740'),
          emp_icon: settingsMap['about_emp_icon'] || 'lucide:hard-hat',
          emp_nos: parseInt(settingsMap['about_emp_nos'] || '35'),
          
          story_title: story.title || 'Our Story',
          story_body: story.content || '',
          story_body2: story.subtitle_or_tag || '',
          
          mission_title: mission.title || 'OUR MISSION',
          mission_body: mission.content || '',
          
          vision_title: vision.title || 'OUR VISION',
          vision_body: vision.content || '',
          
          values_title: settingsMap['about_values_title'] || 'OUR VALUES',
          values_body: parseInt(settingsMap['about_values_body'] || '0'),
          
          team_title: team.title || 'Our Team',
          team_description: team.content || ''
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
        'about_happy_icon': safeSanitize(body.happy_icon || 'lucide:smile'),
        'about_happy_client': String(body.happy_client || 0),
        'about_projects_icon': safeSanitize(body.projects_icon || 'lucide:briefcase'),
        'about_project_nos': String(body.project_nos || 0),
        'about_support_icon': safeSanitize(body.support_icon || 'lucide:headset'),
        'about_hrs_support': String(body.hrs_support || 0),
        'about_emp_icon': safeSanitize(body.emp_icon || 'lucide:hard-hat'),
        'about_emp_nos': String(body.emp_nos || 0),
        'about_values_title': safeSanitize(body.values_title),
        'about_values_body': String(body.values_body || 0),
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

      await upsertSection('our_story', { title: safeSanitize(body.story_title), content: safeSanitize(body.story_body), subtitle_or_tag: safeSanitize(body.story_body2) })
      await upsertSection('mission', { title: safeSanitize(body.mission_title), content: safeSanitize(body.mission_body) })
      await upsertSection('vision', { title: safeSanitize(body.vision_title), content: safeSanitize(body.vision_body) })
      await upsertSection('our_team_intro', { title: safeSanitize(body.team_title), content: safeSanitize(body.team_description) })

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
