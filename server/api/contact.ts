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

      const newMessage = await prisma.messages.create({
        data: {
          name: sanitizePlainText(name),
          email: email.trim().toLowerCase(),
          company: sanitizePlainText(company),
          subject: sanitizePlainText(subject),
          message: sanitizePlainText(message),
          status: 0,
          message_cat_id: catId
        }
      })

      return {
        success: true,
        message: 'Your message has been sent successfully. Thank you!',
        data: newMessage
      }
    } catch (error: any) {
      console.error('Error saving contact request:', error)
      return {
        success: false,
        message: error.statusMessage || 'An error occurred while sending your message. Please try again.'
      }
    }
  } else {
    // GET request returns the contact details configuration
    try {
      const contactInfo = await prisma.contact.findFirst({
        select: {
          id: true,
          sec_title: true,
          company_title: true,
          address: true,
          phone: true,
          cell: true,
          email: true,
          email2: true,
          map: true
        }
      })
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
