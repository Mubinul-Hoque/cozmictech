import { prisma } from '../../utils/prisma'
import { requirePermission } from '../../utils/rbac'
import { clearPublicCache } from '../../utils/cache'
import { 
  getTypographyConfig, 
  generateTypographyCss, 
  getGoogleFontsLinks, 
  AVAILABLE_FONTS, 
  DEFAULT_TYPOGRAPHY,
  type TypographyConfig 
} from '../../utils/typography'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // 1. GET: Fetch typography settings
  if (method === 'GET') {
    try {
      await requirePermission(event, 'global_settings', 'view')
    } catch {
      await requirePermission(event, 'projects', 'view')
    }

    try {
      const { config, isDefault, updatedAt } = await getTypographyConfig()
      const css = generateTypographyCss(config)
      const fontLinks = getGoogleFontsLinks(config)

      return {
        success: true,
        config,
        css,
        fontLinks,
        isDefault,
        updatedAt,
        availableFonts: AVAILABLE_FONTS,
        defaults: DEFAULT_TYPOGRAPHY
      }
    } catch (error: any) {
      console.error('Error in GET /api/admin/typography:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Failed to fetch typography configuration'
      })
    }
  }

  // 2. POST / PUT: Update typography settings
  if (method === 'POST' || method === 'PUT') {
    try {
      await requirePermission(event, 'global_settings', 'edit')
    } catch {
      await requirePermission(event, 'projects', 'edit')
    }

    try {
      const body = await readBody(event)
      const incomingConfig: Partial<TypographyConfig> = body?.typography || body?.config || body

      if (!incomingConfig || typeof incomingConfig !== 'object') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid typography configuration payload'
        })
      }

      // Merge incoming with default to guarantee completeness
      const merged: TypographyConfig = {
        body: { ...DEFAULT_TYPOGRAPHY.body, ...(incomingConfig.body || {}) },
        headings: { ...DEFAULT_TYPOGRAPHY.headings, ...(incomingConfig.headings || {}) },
        h1: { ...DEFAULT_TYPOGRAPHY.h1, ...(incomingConfig.h1 || {}) },
        h2: { ...DEFAULT_TYPOGRAPHY.h2, ...(incomingConfig.h2 || {}) },
        h3: { ...DEFAULT_TYPOGRAPHY.h3, ...(incomingConfig.h3 || {}) },
        h4: { ...DEFAULT_TYPOGRAPHY.h4, ...(incomingConfig.h4 || {}) },
        h5: { ...DEFAULT_TYPOGRAPHY.h5, ...(incomingConfig.h5 || {}) },
        h6: { ...DEFAULT_TYPOGRAPHY.h6, ...(incomingConfig.h6 || {}) },
        display: { ...DEFAULT_TYPOGRAPHY.display, ...(incomingConfig.display || {}) },
        navigation: { ...DEFAULT_TYPOGRAPHY.navigation, ...(incomingConfig.navigation || {}) },
        button: { ...DEFAULT_TYPOGRAPHY.button, ...(incomingConfig.button || {}) },
        projectTitle: { ...DEFAULT_TYPOGRAPHY.projectTitle, ...(incomingConfig.projectTitle || {}) }
      }

      const jsonStr = JSON.stringify(merged)

      await prisma.settings.upsert({
        where: { setting_key: 'site_typography' },
        update: {
          setting_value: jsonStr,
          setting_group: 'typography',
          updated_at: new Date()
        },
        create: {
          setting_key: 'site_typography',
          setting_value: jsonStr,
          setting_group: 'typography'
        }
      })

      // Invalidate public caches immediately
      await clearPublicCache()

      const css = generateTypographyCss(merged)
      const fontLinks = getGoogleFontsLinks(merged)

      return {
        success: true,
        message: 'Website typography settings saved successfully',
        config: merged,
        css,
        fontLinks,
        isDefault: false
      }
    } catch (error: any) {
      console.error('Error in POST /api/admin/typography:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Failed to save typography configuration'
      })
    }
  }

  // 3. DELETE: Reset typography to system defaults
  if (method === 'DELETE') {
    try {
      await requirePermission(event, 'global_settings', 'edit')
    } catch {
      await requirePermission(event, 'projects', 'edit')
    }

    try {
      await prisma.settings.deleteMany({
        where: { setting_key: 'site_typography' }
      })

      await clearPublicCache()

      const defaults = JSON.parse(JSON.stringify(DEFAULT_TYPOGRAPHY))
      const css = generateTypographyCss(defaults)
      const fontLinks = getGoogleFontsLinks(defaults)

      return {
        success: true,
        message: 'Typography settings reset to system defaults',
        config: defaults,
        css,
        fontLinks,
        isDefault: true
      }
    } catch (error: any) {
      console.error('Error in DELETE /api/admin/typography:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Failed to reset typography configuration'
      })
    }
  }
})
