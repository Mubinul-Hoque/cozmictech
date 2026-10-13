import { requirePermission } from '../../utils/rbac'
import { getSmtpConfig, saveSmtpConfig } from '../../utils/mail'
import { sanitizePlainText } from '../../utils/sanitize'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'global_settings', 'view')
    try {
      const config = await getSmtpConfig()
      return {
        success: true,
        config: {
          host: config.host,
          port: config.port,
          secure: config.secure,
          user: config.user,
          fromName: config.fromName,
          fromEmail: config.fromEmail,
          hasPassword: Boolean(config.password),
        }
      }
    } catch (error: any) {
      console.error('Error fetching SMTP config:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch SMTP configuration' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'global_settings', 'edit')
    try {
      const body = await readBody(event)

      const host = sanitizePlainText(String(body?.host || 'smtp.gmail.com')).slice(0, 255)
      const port = Number(body?.port) || 587
      if (port < 1 || port > 65535) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid SMTP port' })
      }

      const user = sanitizePlainText(String(body?.user || '')).slice(0, 150)
      if (user) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(user)) {
          throw createError({ statusCode: 400, statusMessage: 'SMTP account must be a valid email address' })
        }
      }

      const fromEmail = sanitizePlainText(String(body?.fromEmail || '')).slice(0, 150)
      if (fromEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(fromEmail)) {
          throw createError({ statusCode: 400, statusMessage: 'From email must be a valid email address' })
        }
      }

      await saveSmtpConfig({
        host,
        port,
        secure: Boolean(body?.secure),
        user,
        password: body?.password ? String(body.password).trim() : undefined,
        fromName: sanitizePlainText(String(body?.fromName || 'Cozmic Technology')).slice(0, 100),
        fromEmail,
      })

      return { success: true, message: 'SMTP configuration saved successfully' }
    } catch (error: any) {
      console.error('Error saving SMTP config:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save SMTP configuration' })
    }
  }
})
