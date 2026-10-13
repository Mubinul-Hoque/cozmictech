import { prisma } from '../../utils/prisma'

const DEFAULT_HIGHLIGHTS = [
  { label: 'Engineering Scope', value: 'Nationwide Megaprojects' },
  { label: 'Environment', value: 'Collaborative & Modern' },
  { label: 'Career Trajectory', value: 'Direct Mentorship & Growth' },
  { label: 'Headquarters', value: 'Dhaka, Bangladesh' }
]

function parseHighlights(raw: string | null | undefined) {
  if (!raw) return DEFAULT_HIGHLIGHTS
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((h: any) => ({ label: String(h?.label || ''), value: String(h?.value || '') }))
    }
    return DEFAULT_HIGHLIGHTS
  } catch {
    return DEFAULT_HIGHLIGHTS
  }
}

export default defineCachedEventHandler(async (_event) => {
  try {
    const [careers, homepageSection, careerSections, allSettings] = await Promise.all([
      prisma.careers.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          post: true,
          location: true,
          vacancy: true,
          employment_status: true,
          experience: true,
          salary: true,
          description: true,
          deadline: true
        }
      }),
      prisma.page_sections.findFirst({
        where: { page_slug: 'home', section_key: 'career_intro' }
      }),
      prisma.page_sections.findMany({ where: { page_slug: 'career' } }),
      prisma.settings.findMany({
        where: {
          setting_key: {
            in: [
              'career_hero_eyebrow',
              'career_speculative_button_label',
              'contact_email'
            ]
          }
        }
      })
    ])

    const mappedCareers = careers.map(c => ({
      ...c,
      emp_status: c.employment_status
    }))

    const getSec = (key: string) => careerSections.find(s => s.section_key === key) || {} as any
    const settingsMap: Record<string, string> = {}
    allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')

    const highlightsSec = getSec('highlights')
    const speculative = getSec('speculative_box')

    return {
      success: true,
      data: mappedCareers,
      homepage: {
        title9: homepageSection?.title || 'Join Our Team',
        content9: homepageSection?.content || 'Explore career opportunities and build a fulfilling future with us. We are always looking for passionate engineers and design experts to contribute to Bangladesh\'s premium consultancy projects.'
      },
      pageContent: {
        hero_eyebrow: settingsMap['career_hero_eyebrow'] || 'Careers • Culture • Opportunities',
        highlights: parseHighlights(highlightsSec.content),

        speculative_eyebrow: speculative.subtitle_or_tag || 'Speculative Opportunities',
        speculative_heading: speculative.title || 'Don’t see the exact position you are looking for?',
        speculative_body: speculative.content || 'We are always eager to meet talented geotechnical engineers, foundation consultants, CAD technicians, and project managers. Send your resume and portfolio directly to our recruitment desk.',
        speculative_button_label: settingsMap['career_speculative_button_label'] || 'Submit CV to Desk',

        contact_email: settingsMap['contact_email'] || 'career@cozmictech.com'
      }
    }
  } catch (error) {
    console.error('Error fetching public careers:', error)
    return {
      success: false,
      data: [],
      homepage: null,
      pageContent: null
    }
  }
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'career-page',
  getKey: () => 'career-v2'
})
