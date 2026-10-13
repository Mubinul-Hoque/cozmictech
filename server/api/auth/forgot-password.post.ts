import { randomBytes, createHash } from 'crypto'
import { prisma } from '../../utils/prisma'
import { isSmtpConfigured, sendMail } from '../../utils/mail'
import { checkAndRecordAttempt } from '../../utils/passwordResetLimiter'

export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const body = await readBody(event)
  const email = String(body?.email || '').trim().toLowerCase()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email) || email.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email address is required' })
  }

  if (!checkAndRecordAttempt(`ip:${clientIp}`) || !checkAndRecordAttempt(`email:${email}`)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many password reset requests. Please try again later.' })
  }

  const smtpReady = await isSmtpConfigured()
  if (!smtpReady) {
    throw createError({ statusCode: 503, statusMessage: 'Password reset emails are not configured yet. Please contact a Super Admin.' })
  }

  const genericMessage = 'If an account exists for that email address, a password reset link has been sent.'

  try {
    const user = await prisma.users.findFirst({ where: { email } })

    if (user && user.is_active) {
      const rawToken = randomBytes(32).toString('hex')
      const hashedToken = createHash('sha256').update(rawToken).digest('hex')
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.users.update({
        where: { id: user.id },
        data: { reset_token: hashedToken, reset_token_expires: expires }
      })

      const origin = getRequestURL(event).origin
      const resetUrl = `${origin}/admin/reset-password?token=${rawToken}`

      const { logSecurityAudit } = await import('../../utils/security')

      try {
        await sendMail({
          to: user.email,
          subject: 'Reset Your Cozmic Technology Admin Password',
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1e293b;">Password Reset Request</h2>
              <p>We received a request to reset the password for your Cozmic Technology Admin Panel account.</p>
              <p><a href="${resetUrl}" style="display:inline-block;background:#feb900;color:#1e293b;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Reset Password</a></p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #64748b;">${resetUrl}</p>
              <p>This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
          text: `Reset your password using this link (expires in 1 hour): ${resetUrl}`,
        })

        await logSecurityAudit({
          action: 'PASSWORD_RESET_REQUESTED',
          identifier: user.email,
          user_id: user.id,
          ip_address: clientIp,
          user_agent: getRequestHeader(event, 'user-agent') || '',
          severity: 'info',
          details: 'Password reset link requested and emailed',
        })
      } catch (mailError: any) {
        console.error('Failed to send password reset email:', mailError)
        await logSecurityAudit({
          action: 'PASSWORD_RESET_REQUESTED',
          identifier: user.email,
          user_id: user.id,
          ip_address: clientIp,
          user_agent: getRequestHeader(event, 'user-agent') || '',
          severity: 'danger',
          details: `Reset token generated but email delivery failed: ${mailError?.message || 'Unknown SMTP error'}`,
        })
      }
    }

    return { success: true, message: genericMessage }
  } catch (error: any) {
    console.error('Error processing forgot-password request:', error)
    // Never leak internal errors to the client for this public endpoint
    return { success: true, message: genericMessage }
  }
})
