import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'
import { clearPublicCache } from '../../../utils/cache'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'projects', 'view')
    try {
      const setting = await prisma.settings.findUnique({
        where: { setting_key: 'projects_page_layout' }
      })
      return {
        success: true,
        layout: setting?.setting_value === 'list' ? 'list' : 'grid'
      }
    } catch (error: any) {
      console.error('Error fetching project view layout:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch project view layout' })
    }
  }

  if (method === 'POST') {
    // Allow either projects:edit or global_settings:edit
    try {
      await requirePermission(event, 'projects', 'edit')
    } catch {
      await requirePermission(event, 'global_settings', 'edit')
    }

    try {
      const body = await readBody(event)
      const layout = body?.layout === 'list' ? 'list' : 'grid'

      await prisma.settings.upsert({
        where: { setting_key: 'projects_page_layout' },
        update: { setting_value: layout, setting_group: 'projects' },
        create: { setting_key: 'projects_page_layout', setting_value: layout, setting_group: 'projects' }
      })

      await clearPublicCache()

      return {
        success: true,
        layout,
        message: `Frontend project view switched to ${layout === 'list' ? 'Modern List View' : 'Existing Card / Grid View'}`
      }
    } catch (error: any) {
      console.error('Error updating project view layout:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update project view layout' })
    }
  }
})
