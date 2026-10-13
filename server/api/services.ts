import { prisma } from '../utils/prisma'

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
      return parsed.map((s: any) => ({ title: String(s?.title || ''), description: String(s?.description || '') }))
    }
    return DEFAULT_STEPS
  } catch {
    return DEFAULT_STEPS
  }
}

export default defineCachedEventHandler(async (_event) => {
  const [services, servicesIntro, pageSections, allSettings] = await Promise.all([
    prisma.services.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, name: true, icon: true, image: true, short_description: true, description: true }
    }),
    prisma.page_sections.findFirst({
      where: { page_slug: 'home', section_key: 'services_intro' }
    }),
    prisma.page_sections.findMany({ where: { page_slug: 'services' } }),
    prisma.settings.findMany({
      where: {
        setting_key: {
          in: [
            'company_title',
            'services_hero_eyebrow',
            'services_hero_caption_label',
            'services_hero_caption_location',
            'services_process_eyebrow',
            'services_process_caption'
          ]
        }
      }
    })
  ])

  const getSec = (key: string) => pageSections.find(s => s.section_key === key) || {} as any
  const settingsMap: Record<string, string> = {}
  allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')

  const hero = getSec('hero')
  const processSec = getSec('process')
  const cta = getSec('cta_banner')

  return {
    sectors: services,
    services,
    servicesChild: [],
    company_title: settingsMap['company_title'] || 'Cozmic Technology',
    homepage: {
      title3: servicesIntro?.title || 'Services',
      tag3: servicesIntro?.subtitle_or_tag || 'From concept to completion, Cozmic Technology delivers geotechnical investigation, engineering consultancy, architecture, and construction management under one roof — across Bangladesh.'
    },
    pageContent: {
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
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'services-page',
  getKey: () => 'services-v3'
})
