import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'POST') {
    try {
      // IP Rate Limiting for contact form spam protection
      const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';
      if (isRateLimited(clientIp, 3, 60000)) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Too many requests. Please try again after a minute.',
        });
      }

      const body = await readBody(event)
      const { name, email, company, subject, message, message_cat_id } = body

      if (!name || !email || !company || !subject || !message || !message_cat_id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'All fields are required'
        })
      }

      // Input length validation
      if (name.length > 50 || email.length > 100 || company.length > 100 || subject.length > 100 || message.length > 5000) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Input size limit exceeded'
        })
      }

      const catId = parseInt(message_cat_id)
      if (isNaN(catId)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid message category'
        })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid email address format'
        })
      }

      await prisma.messages.create({
        data: {
          name: sanitizePlainText(name),
          email: email.trim().toLowerCase(),
          company: sanitizePlainText(company),
          subject: sanitizePlainText(subject),
          message: sanitizePlainText(message),
          is_read: false,
          category_id: catId
        }
      })

      return {
        success: true,
        message: 'Your message has been queued successfully. Thank you!',
      }
    } catch (error: any) {
      console.error('Error handling contact request:', error)
      return {
        success: false,
        message: error.statusMessage || 'An error occurred while sending your message. Please try again.'
      }
    }
  } else {
    // GET request returns the contact details configuration
    try {
      setResponseHeader(event, 'cache-control', 'public, max-age=300, stale-while-revalidate=600')
      const [allSettings, sections] = await Promise.all([
        prisma.settings.findMany({
          where: {
            setting_key: {
              in: [
                'company_title',
                'contact_address',
                'contact_phone',
                'contact_cell',
                'contact_email',
                'contact_email2',
                'contact_map',
                'contact_guarantee_assurance'
              ]
            }
          }
        }),
        prisma.page_sections.findMany({ where: { page_slug: 'contact' } })
      ])
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')
      const getSec = (key: string) => sections.find(s => s.section_key === key) || {} as any

      const hero = getSec('hero')
      const cardAddress = getSec('card_address')
      const cardEmail = getSec('card_email')
      const cardPhone = getSec('card_phone')
      const mapCard = getSec('map_card')
      const guarantee = getSec('guarantee_box')

      const contactInfo = {
        id: 1,
        sec_title: 'Contact',
        company_title: settingsMap['company_title'] || 'Cozmic Technology',
        address: settingsMap['contact_address'] || '',
        phone: settingsMap['contact_phone'] || '',
        cell: settingsMap['contact_cell'] || '',
        email: settingsMap['contact_email'] || '',
        email2: settingsMap['contact_email2'] || '',
        map: settingsMap['contact_map'] || ''
      }

      const pageContent = {
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

      return {
        success: true,
        contact: contactInfo,
        pageContent
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return {
        success: false,
        contact: null,
        pageContent: null
      }
    }
  }
})
