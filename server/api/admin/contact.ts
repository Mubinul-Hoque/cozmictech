import { prisma } from '../../utils/prisma'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'contact', 'view');
    try {
      const [allSettings, sections] = await Promise.all([
        prisma.settings.findMany(),
        prisma.page_sections.findMany({ where: { page_slug: 'contact' } })
      ])
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value || ''
      })
      const getSec = (key: string) => sections.find(s => s.section_key === key) || {} as any

      const hero = getSec('hero')
      const cardAddress = getSec('card_address')
      const cardEmail = getSec('card_email')
      const cardPhone = getSec('card_phone')
      const mapCard = getSec('map_card')
      const guarantee = getSec('guarantee_box')

      return {
        success: true,
        contact: {
          company_title: settingsMap['company_title'] || 'Cozmic Technology',
          address: settingsMap['contact_address'] || '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh',
          phone: settingsMap['contact_phone'] || '+88 01894932401',
          cell: settingsMap['contact_cell'] || '+88 01894932401',
          email: settingsMap['contact_email'] || 'info@cozmictech.com',
          email2: settingsMap['contact_email2'] || 'info@cozmictech.com',
          map: settingsMap['contact_map'] || ''
        },
        content: {
          hero_eyebrow: hero.subtitle_or_tag || 'Consultation • Inquiries • Reach Out',
          hero_heading: hero.title || 'Let’s Discuss Your Engineering Vision',
          hero_body: hero.content || 'Whether commencing comprehensive geotechnical ground investigations, commissioning structural designs, or seeking project management consultancy, our engineering directors in Dhaka are ready to assist.',

          card_address_label: cardAddress.subtitle_or_tag || 'Office Location',
          card_address_heading: cardAddress.title || 'Dhaka Headquarters',
          card_address_footer: cardAddress.content || 'Open Sun – Thu • 9:00 AM – 6:00 PM',

          card_email_label: cardEmail.subtitle_or_tag || 'Electronic Mail',
          card_email_heading: cardEmail.title || 'Direct Inquiries',
          card_email_footer: cardEmail.content || 'Average response within 24 business hours',

          card_phone_label: cardPhone.subtitle_or_tag || 'Telephone & Cellular',
          card_phone_heading: cardPhone.title || 'Direct Hotline',
          card_phone_footer: cardPhone.content || 'Urgent project consultations accommodated',

          map_card_label: mapCard.title || 'Head Office Location',
          map_card_badge: mapCard.subtitle_or_tag || 'Dhaka-1207',

          guarantee_eyebrow: guarantee.subtitle_or_tag || 'Response Guarantee',
          guarantee_heading: guarantee.title || 'Fast-Track Technical Review',
          guarantee_body: guarantee.content || 'Every project submission is routed directly to our designated discipline leads. For urgent soil testing or architectural tender proposals, please mention your target project milestones in the narrative.',
          guarantee_assurance: settingsMap['contact_guarantee_assurance'] || 'Confidentiality & NDA Assured on Inquiries'
        }
      }
    } catch (error: any) {
      console.error('Error fetching admin contact config:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch contact config' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'contact', 'edit');
    try {
      const body = await readBody(event)
      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      const settingsToUpdate = {
        'contact_address': safeSanitize(body.address),
        'contact_phone': safeSanitize(body.phone),
        'contact_cell': safeSanitize(body.cell),
        'contact_email': safeSanitize(body.email),
        'contact_email2': safeSanitize(body.email2),
        'contact_map': safeSanitize(body.map),
        'contact_guarantee_assurance': safeSanitize(body.guarantee_assurance || 'Confidentiality & NDA Assured on Inquiries')
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      const sections = await prisma.page_sections.findMany({ where: { page_slug: 'contact' } })
      const upsertSection = async (key: string, data: any) => {
        const existing = sections.find(s => s.section_key === key)
        if (existing) {
          await prisma.page_sections.update({ where: { id: existing.id }, data })
        } else {
          await prisma.page_sections.create({ data: { page_slug: 'contact', section_key: key, ...data } })
        }
      }

      await upsertSection('hero', {
        title: safeSanitize(body.hero_heading || 'Let’s Discuss Your Engineering Vision'),
        content: safeSanitize(body.hero_body || 'Whether commencing comprehensive geotechnical ground investigations, commissioning structural designs, or seeking project management consultancy, our engineering directors in Dhaka are ready to assist.'),
        subtitle_or_tag: safeSanitize(body.hero_eyebrow || 'Consultation • Inquiries • Reach Out')
      })
      await upsertSection('card_address', {
        title: safeSanitize(body.card_address_heading || 'Dhaka Headquarters'),
        content: safeSanitize(body.card_address_footer || 'Open Sun – Thu • 9:00 AM – 6:00 PM'),
        subtitle_or_tag: safeSanitize(body.card_address_label || 'Office Location')
      })
      await upsertSection('card_email', {
        title: safeSanitize(body.card_email_heading || 'Direct Inquiries'),
        content: safeSanitize(body.card_email_footer || 'Average response within 24 business hours'),
        subtitle_or_tag: safeSanitize(body.card_email_label || 'Electronic Mail')
      })
      await upsertSection('card_phone', {
        title: safeSanitize(body.card_phone_heading || 'Direct Hotline'),
        content: safeSanitize(body.card_phone_footer || 'Urgent project consultations accommodated'),
        subtitle_or_tag: safeSanitize(body.card_phone_label || 'Telephone & Cellular')
      })
      await upsertSection('map_card', {
        title: safeSanitize(body.map_card_label || 'Head Office Location'),
        subtitle_or_tag: safeSanitize(body.map_card_badge || 'Dhaka-1207')
      })
      await upsertSection('guarantee_box', {
        title: safeSanitize(body.guarantee_heading || 'Fast-Track Technical Review'),
        content: safeSanitize(body.guarantee_body || 'Every project submission is routed directly to our designated discipline leads. For urgent soil testing or architectural tender proposals, please mention your target project milestones in the narrative.'),
        subtitle_or_tag: safeSanitize(body.guarantee_eyebrow || 'Response Guarantee')
      })

      await clearPublicCache()
      return {
        success: true,
        message: 'Contact details saved successfully'
      }
    } catch (error: any) {
      console.error('Error saving admin contact config:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save contact config' })
    }
  }
})
