import { prisma } from '../../utils/prisma'
import { getSessionTimeoutHours, setSessionTimeoutHours } from '../../utils/session'
import { requirePermission } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // ─── GET ───────────────────────────────────────────────────────────────────
  if (method === 'GET') {
    const userProfile = await requirePermission(event, 'global_settings', 'view')
    try {
      const [allSettings, socials] = await Promise.all([
        prisma.settings.findMany(),
        prisma.social_links.findMany()
      ])

      const settingsMap: Record<string, string> = {}
      allSettings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value || ''
      })

      const socialMap: Record<string, string> = { twitter: '#', fb: '#', insta: '#', linkedin: '#' }
      socials.forEach(s => {
        const name = s.platform_name?.toLowerCase()
        if (name === 'twitter') socialMap.twitter = s.url || '#'
        if (name === 'facebook') socialMap.fb = s.url || '#'
        if (name === 'instagram') socialMap.insta = s.url || '#'
        if (name === 'linkedin') socialMap.linkedin = s.url || '#'
      })

      const homepage = {
        company_title: settingsMap['company_title'] || 'Cozmic Technology',
        slogan: settingsMap['slogan'] || "Let's work together to make great things possible.",
        logo: settingsMap['logo'] || '',
        favicon: settingsMap['favicon'] || '',
        theme: settingsMap['theme'] || 'theme-default',
      }

      const footer = {
        copyright_text: settingsMap['footer_copyright_text'] || settingsMap['company_title'] || 'Cozmic Technology',
        copyright_year: settingsMap['footer_copyright_year'] || '',
        copyright_auto_year: settingsMap['footer_copyright_auto_year'] !== 'false',
        designed_by_text: settingsMap['footer_designed_by_text'] || 'mDynamic',
        designed_by_prefix: settingsMap['footer_designed_by_prefix'] || 'Designed by',
        designed_by_url: settingsMap['footer_designed_by_url'] || 'https://mdynamic.us/'
      }

      const sessionTimeoutHours = await getSessionTimeoutHours();
      return {
        success: true,
        homepage,
        social: socialMap,
        footer,
        session_timeout_hours: sessionTimeoutHours,
        isSuperAdmin: userProfile.is_super_admin
      }
    } catch (error: any) {
      console.error('Error fetching admin settings:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings' })
    }
  }

  // ─── POST ──────────────────────────────────────────────────────────────────
  if (method === 'POST') {
    const userProfile = await requirePermission(event, 'global_settings', 'edit')
    try {
      const body = await readBody(event)
      const { homepage, social, footer } = body

      const safeSanitize = (val: unknown): string => {
        if (val === undefined || val === null) return ''
        return String(val)
      }

      // 1. Update Global Settings
      const settingsToUpdate: Record<string, string> = {
        'company_title': safeSanitize(homepage?.company_title),
        'slogan': safeSanitize(homepage?.slogan),
        'logo': safeSanitize(homepage?.logo),
        'favicon': safeSanitize(homepage?.favicon),
        'theme': safeSanitize(homepage?.theme || 'theme-default'),
        'footer_copyright_text': safeSanitize(footer?.copyright_text),
        'footer_copyright_year': safeSanitize(footer?.copyright_year),
        'footer_copyright_auto_year': footer?.copyright_auto_year ? 'true' : 'false',
        'footer_designed_by_text': safeSanitize(footer?.designed_by_text),
        'footer_designed_by_prefix': safeSanitize(footer?.designed_by_prefix || 'Designed by'),
        'footer_designed_by_url': safeSanitize(footer?.designed_by_url)
      }

      for (const [key, val] of Object.entries(settingsToUpdate)) {
        await prisma.settings.upsert({
          where: { setting_key: key },
          update: { setting_value: val },
          create: { setting_key: key, setting_value: val }
        })
      }

      // Update session timeout if provided and user is Super Admin
      if (body.session_timeout_hours !== undefined) {
        if (userProfile.is_super_admin) {
          await setSessionTimeoutHours(Number(body.session_timeout_hours));
        }
      }

      // 2. Update Social Links
      if (social) {
        const dbSocials = await prisma.social_links.findMany()
        const socialTypeMap: Record<string, { link: string; icon: string }> = {
          twitter:   { link: social.twitter || '#', icon: 'bi bi-twitter' },
          facebook:  { link: social.fb      || '#', icon: 'bi bi-facebook' },
          instagram: { link: social.insta   || '#', icon: 'bi bi-instagram' },
          linkedin:  { link: social.linkedin || '#', icon: 'bi bi-linkedin' },
        }
        for (const [type, { link, icon }] of Object.entries(socialTypeMap)) {
          const sanitizedLink = safeSanitize(link)
          const match = dbSocials.find(s => s.platform_name?.toLowerCase() === type)
          if (match) {
            await prisma.social_links.update({ where: { id: match.id }, data: { url: sanitizedLink } })
          } else {
            await prisma.social_links.create({
              data: { platform_name: type.charAt(0).toUpperCase() + type.slice(1), icon, url: sanitizedLink }
            })
          }
        }
      }

      await clearPublicCache();
      return { success: true, message: 'Settings saved successfully' }
    } catch (error: any) {
      console.error('Error saving admin settings:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save settings' })
    }
  }
})
