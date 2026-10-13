import { requirePermission } from '../../../utils/rbac'
import { getSmtpConfig, sendMail } from '../../../utils/mail'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'global_settings', 'edit')

  try {
    const body = await readBody(event)
    const to = String(body?.to || '').trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!to || !emailRegex.test(to)) {
      throw createError({ statusCode: 400, statusMessage: 'A valid recipient email address is required' })
    }

    const saved = await getSmtpConfig()

    const host = String(body?.host || saved.host)
    const port = Number(body?.port) || saved.port
    const user = String(body?.user || saved.user)
    const password = body?.password ? String(body.password).trim() : saved.password
    const fromName = String(body?.fromName || saved.fromName)
    const fromEmail = String(body?.fromEmail || saved.fromEmail || user)
    const secure = body?.secure !== undefined ? Boolean(body.secure) : saved.secure

    if (!user || !password) {
      throw createError({ statusCode: 400, statusMessage: 'SMTP account and app password are required before sending a test email' })
    }

    await sendMail(
      {
        to,
        subject: 'Cozmic Technology Admin Panel — SMTP Test Email',
        html: `<p>This is a test email confirming your Google SMTP configuration is working correctly.</p><p>Sent from the Cozmic Technology Admin Panel.</p>`,
        text: 'This is a test email confirming your Google SMTP configuration is working correctly.',
      },
      { host, port, secure, user, password, fromName, fromEmail }
    )

    return { success: true, message: `Test email sent successfully to ${to}` }
  } catch (error: any) {
    console.error('SMTP test email failed:', error)
    const providerMessage = error?.response || error?.message
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusCode ? error.statusMessage : `Failed to send test email: ${providerMessage || 'Unknown SMTP error'}`
    })
  }
})
