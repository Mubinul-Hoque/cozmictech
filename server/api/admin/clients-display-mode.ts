import { prisma } from '../../utils/prisma'
import { requirePermission } from '../../utils/rbac'

const VALID_MODES = ['static', 'scrolling']

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'clients', 'view')
    try {
      const setting = await prisma.settings.findUnique({ where: { setting_key: 'clients_display_mode' } })
      const mode = setting?.setting_value && VALID_MODES.includes(setting.setting_value) ? setting.setting_value : 'static'
      return { success: true, mode }
    } catch (error: any) {
      console.error('Error fetching clients display mode:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch display mode setting' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'clients', 'edit')
    try {
      const body = await readBody(event)
      const mode = String(body?.mode || '').trim()
      if (!VALID_MODES.includes(mode)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid display mode. Must be "static" or "scrolling".' })
      }

      await prisma.settings.upsert({
        where: { setting_key: 'clients_display_mode' },
        update: { setting_value: mode },
        create: { setting_key: 'clients_display_mode', setting_value: mode, setting_group: 'clients' }
      })

      await clearPublicCache()
      return { success: true, mode, message: 'Client logo display mode saved successfully' }
    } catch (error: any) {
      console.error('Error saving clients display mode:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save display mode setting' })
    }
  }
})
