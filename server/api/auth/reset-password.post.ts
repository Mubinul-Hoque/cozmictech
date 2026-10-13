import { createHash } from 'crypto'
import bcrypt from 'bcrypt'
import { prisma } from '../../utils/prisma'
import { checkAndRecordAttempt } from '../../utils/passwordResetLimiter'

export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const body = await readBody(event)
  const token = String(body?.token || '').trim()
  const password = String(body?.password || '')

  if (!token || token.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing reset token' })
  }

  if (!checkAndRecordAttempt(`ip:${clientIp}`)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Please try again later.' })
  }

  if (password.length < 8 || password.length > 72) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be between 8 and 72 characters long' })
  }

  const hashedToken = createHash('sha256').update(token).digest('hex')

  const user = await prisma.users.findFirst({
    where: {
      reset_token: hashedToken,
      reset_token_expires: { gt: new Date() },
    }
  })

  if (!user) {
    throw createError({ statusCode: 400, statusMessage: 'This password reset link is invalid or has expired. Please request a new one.' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
    }
  })

  const { logSecurityAudit } = await import('../../utils/security')
  await logSecurityAudit({
    action: 'PASSWORD_RESET_COMPLETED',
    identifier: user.email,
    user_id: user.id,
    ip_address: clientIp,
    user_agent: getRequestHeader(event, 'user-agent') || '',
    severity: 'info',
    details: 'Password successfully reset via emailed link',
  })

  return { success: true, message: 'Your password has been reset successfully. You may now log in.' }
})
