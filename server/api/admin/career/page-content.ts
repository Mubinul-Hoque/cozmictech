import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'

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
      return parsed.map((h: any) => ({
        label: String(h?.label || ''),
        value: String(h?.value || '')
      }))
    }
    return DEFAULT_HIGHLIGHTS
  } catch {
    return DEFAULT_HIGHLIGHTS
  }
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'careers', 'view')
    try {
      const [sections, allSettings] = await Promise.all([
        prisma.page_sections.findMany({ where: { page_slug: 'career' } }),
        prisma.settings.findMany()
      ])

      const getSec = (key: string) => sections.find(s => s.section_key === key) || {} as any
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')

      const highlightsSec = getSec('highlights')
      const speculative = getSec('speculative_box')

      return {
        success: true,
        content: {
          hero_eyebrow: settingsMap['career_hero_eyebrow'] || 'Careers • Culture • Opportunities',
          highlights: parseHighlights(highlightsSec.content),

          speculative_eyebrow: speculative.subtitle_or_tag || 'Speculative Opportunities',
          speculative_heading: speculative.title || 'Don’t see the exact position you are looking for?',
          speculative_body: speculative.content || 'We are always eager to meet talented geotechnical engineers, foundation consultants, CAD technicians, and project managers. Send your resume and portfolio directly to our recruitment desk.',
          speculative_button_label: settingsMap['career_speculative_button_label'] || 'Submit CV to Desk',

          contact_email: settingsMap['contact_email'] || 'career@cozmictech.com'
        }
      }
    } catch (error: any) {
      console.error('Error fetching career page content:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch career page content' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'careers', 'edit')
    try {
      const body = await readBody(event)

      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      const settingsToUpdate = {
        'career_hero_eyebrow': safeSanitize(body.hero_eyebrow || 'Careers • Culture • Opportunities'),
        'career_speculative_button_label': safeSanitize(body.speculative_button_label || 'Submit CV to Desk'),
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      const sections = await prisma.page_sections.findMany({ where: { page_slug: 'career' } })
      const upsertSection = async (key: string, data: any) => {
        const existing = sections.find(s => s.section_key === key)
        if (existing) {
          await prisma.page_sections.update({ where: { id: existing.id }, data })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'career', section_key: key, ...data } })
        }
      }

      const rawHighlights = Array.isArray(body.highlights) ? body.highlights : []
      const cleanHighlights = rawHighlights
        .map((h: any) => ({
          label: sanitizePlainText(String(h?.label || '').trim()).slice(0, 100),
          value: sanitizePlainText(String(h?.value || '').trim()).slice(0, 150)
        }))
        .filter((h: any) => h.label && h.value)

      await upsertSection('highlights', {
        content: JSON.stringify(cleanHighlights.length ? cleanHighlights : DEFAULT_HIGHLIGHTS)
      })
      await upsertSection('speculative_box', {
        title: safeSanitize(body.speculative_heading || 'Don’t see the exact position you are looking for?'),
        content: safeSanitize(body.speculative_body || 'We are always eager to meet talented geotechnical engineers, foundation consultants, CAD technicians, and project managers. Send your resume and portfolio directly to our recruitment desk.'),
        subtitle_or_tag: safeSanitize(body.speculative_eyebrow || 'Speculative Opportunities')
      })

      await clearPublicCache()
      return { success: true, message: 'Career page content saved successfully' }
    } catch (error: any) {
      console.error('Error saving career page content:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save career page content' })
    }
  }
})
