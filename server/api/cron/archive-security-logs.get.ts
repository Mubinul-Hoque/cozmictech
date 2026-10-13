import { archiveOldSecurityLogs } from '../../utils/security'

// Triggered by Vercel Cron (see vercel.json). When CRON_SECRET is configured,
// Vercel automatically sends it as a Bearer token on scheduled invocations —
// verifying it here stops this public path from being triggered by anyone else.
export default defineEventHandler(async (event) => {
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret) {
    const authHeader = getRequestHeader(event, 'authorization')
    if (authHeader !== `Bearer ${expectedSecret}`) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }

  const result = await archiveOldSecurityLogs('scheduled-cron')
  return { success: true, ...result }
})
