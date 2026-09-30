import { prisma } from '../../utils/prisma'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    await requirePermission(event, 'contact', 'view');
    try {
      const allSettings = await prisma.settings.findMany()
      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value || ''
      })

      return {
        success: true,
        contact: {
          company_title: settingsMap['company_title'] || 'Cozmic Technology',
          address: settingsMap['contact_address'] || '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh',
          phone: settingsMap['contact_phone'] || '+88 01894932401',
          cell: settingsMap['contact_cell'] || '+88 01894932401',
          email: settingsMap['contact_email'] || 'info@cozmictech.com',
          email2: settingsMap['contact_email2'] || 'info@cozmictech.com',
          map: settingsMap['contact_map'] || ''
        }
      }
    } catch (error: any) {
      console.error('Error fetching admin contact config:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch contact config' })
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'contact', 'edit');
    try {
      const body = await readBody(event)
      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      const settingsToUpdate = {
        'contact_address': safeSanitize(body.address),
        'contact_phone': safeSanitize(body.phone),
        'contact_cell': safeSanitize(body.cell),
        'contact_email': safeSanitize(body.email),
        'contact_email2': safeSanitize(body.email2),
        'contact_map': safeSanitize(body.map)
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      await clearPublicCache()
      return {
        success: true,
        message: 'Contact details saved successfully'
      }
    } catch (error: any) {
      console.error('Error saving admin contact config:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save contact config' })
    }
  }
})
