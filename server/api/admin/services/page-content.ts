import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'

const DEFAULT_STEPS = [
  { title: 'Initial consultation & site feasibility', description: 'We start by listening — your goals, the site conditions, regulatory zoning, and budget — conducting preliminary soil and site appraisals until the project brief is crystal clear.' },
  { title: 'Concept & schematic engineering', description: 'We explore structural directions through geotechnical modeling, massing, and architectural layouts, shaping an engineered scheme that works harmoniously before detailing begins.' },
  { title: 'Design development & documentation', description: 'We resolve structural calculations, soil parameters, material specifications, and MEP into coordinated, BNBC-compliant buildable construction drawings.' },
  { title: 'Construction coordination & supervision', description: 'We work directly alongside site engineers and contractors on-site, performing non-destructive testing, quality control, and ensuring engineering integrity as the project takes shape.' },
  { title: 'Handover & structural certification', description: 'Final inspections, integrity load audits, and compliance documentation — handed over ready to be safely occupied and operated.' }
]

function parseSteps(raw: string | null | undefined) {
  if (!raw) return DEFAULT_STEPS
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((s: any) => ({
        title: String(s?.title || ''),
        description: String(s?.description || '')
      }))
    }
    return DEFAULT_STEPS
  } catch {
    return DEFAULT_STEPS
  }
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'services', 'view')
    try {
      const [sections, allSettings, servicesIntro] = await Promise.all([
        prisma.page_sections.findMany({ where: { page_slug: 'services' } }),
        prisma.settings.findMany(),
        prisma.page_sections.findFirst({ where: { page_slug: 'home', section_key: 'services_intro' } })
      ])

      const getSec = (key: string) => sections.find(s => s.section_key === key) || {} as any
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')

      const hero = getSec('hero')
      const processSec = getSec('process')
      const cta = getSec('cta_banner')

      return {
        success: true,
        content: {
          section_title: servicesIntro?.title || 'Our Services',
          section_tagline: servicesIntro?.subtitle_or_tag || '',

          hero_eyebrow: settingsMap['services_hero_eyebrow'] || 'Disciplines • Capabilities',
          hero_image: hero.image || '',
          hero_caption_label: settingsMap['services_hero_caption_label'] || 'Completed Landmark Project',
          hero_caption_location: settingsMap['services_hero_caption_location'] || 'Dhaka',

          process_eyebrow: settingsMap['services_process_eyebrow'] || 'Methodology • Standards',
          process_heading: processSec.title || 'How we work, from first idea to handover',
          process_image: processSec.image || '',
          process_caption: settingsMap['services_process_caption'] || 'Rigorous execution from ground analysis to final structure',
          process_steps: parseSteps(processSec.content),

          cta_eyebrow: cta.subtitle_or_tag || 'Consultation • Engineering Precision',
          cta_heading: cta.title || 'Ready to Discuss Your Next Project?',
          cta_body: cta.content || 'From soil testing and structural design to turnkey engineering supervision, our licensed engineering consultants are ready to assist.'
        }
      }
    } catch (error: any) {
      console.error('Error fetching services page content:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch services page content' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'services', 'edit')
    try {
      const body = await readBody(event)

      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      const settingsToUpdate = {
        'services_hero_eyebrow': safeSanitize(body.hero_eyebrow || 'Disciplines • Capabilities'),
        'services_hero_caption_label': safeSanitize(body.hero_caption_label || 'Completed Landmark Project'),
        'services_hero_caption_location': safeSanitize(body.hero_caption_location || 'Dhaka'),
        'services_process_eyebrow': safeSanitize(body.process_eyebrow || 'Methodology & Standards'),
        'services_process_caption': safeSanitize(body.process_caption || 'Rigorous execution from ground analysis to final structure'),
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      const sections = await prisma.page_sections.findMany({ where: { page_slug: 'services' } })
      const upsertSection = async (key: string, data: any) => {
        const existing = sections.find(s => s.section_key === key)
        if (existing) {
          await prisma.page_sections.update({ where: { id: existing.id }, data })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'services', section_key: key, ...data } })
        }
      }

      const rawSteps = Array.isArray(body.process_steps) ? body.process_steps : []
      const cleanSteps = rawSteps
        .map((s: any) => ({
          title: sanitizePlainText(String(s?.title || '').trim()).slice(0, 255),
          description: sanitizePlainText(String(s?.description || '').trim()).slice(0, 2000)
        }))
        .filter((s: any) => s.title && s.description)

      await upsertSection('hero', { image: safeSanitize(body.hero_image) })
      await upsertSection('process', {
        title: safeSanitize(body.process_heading || 'How we work, from first idea to handover'),
        image: safeSanitize(body.process_image),
        content: JSON.stringify(cleanSteps.length ? cleanSteps : DEFAULT_STEPS)
      })
      await upsertSection('cta_banner', {
        title: safeSanitize(body.cta_heading || 'Ready to Discuss Your Next Project?'),
        content: safeSanitize(body.cta_body || 'From soil testing and structural design to turnkey engineering supervision, our licensed engineering consultants are ready to assist.'),
        subtitle_or_tag: safeSanitize(body.cta_eyebrow || 'Consultation • Engineering Precision')
      })

      if (body.section_title !== undefined || body.section_tagline !== undefined) {
        const existingIntro = await prisma.page_sections.findFirst({
          where: { page_slug: 'home', section_key: 'services_intro' }
        })
        const introData = {
          title: safeSanitize(body.section_title || 'Our Services'),
          subtitle_or_tag: safeSanitize(body.section_tagline || '')
        }
        if (existingIntro) {
          await prisma.page_sections.update({ where: { id: existingIntro.id }, data: introData })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'home', section_key: 'services_intro', ...introData } })
        }
      }

      await clearPublicCache()
      return { success: true, message: 'Services page content saved successfully' }
    } catch (error: any) {
      console.error('Error saving services page content:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save services page content' })
    }
  }
})
