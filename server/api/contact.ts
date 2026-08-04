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
      const allSettings = await prisma.settings.findMany()
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')
      
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

      return {
        success: true,
        contact: contactInfo
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return {
        success: false,
        contact: null
      }
    }
  }
})
