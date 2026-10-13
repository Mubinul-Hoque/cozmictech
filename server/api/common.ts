import { prisma } from '../utils/prisma'
import { DEFAULT_TYPOGRAPHY, generateTypographyCss, getGoogleFontsLinks, type TypographyConfig } from '../utils/typography'

export default defineCachedEventHandler(async (_event) => {
  const [allSettings, socials, services, aboutStorySec] = await Promise.all([
    prisma.settings.findMany(),
    prisma.social_links.findMany(),
    prisma.services.findMany({
      select: { id: true, name: true }
    }),
    prisma.page_sections.findFirst({
      where: { page_slug: 'about', section_key: 'our_story' }
    })
  ])

  const settingsMap: Record<string, string> = {}
  allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')

  const socialMap: Record<string, string> = { twitter: '#', fb: '#', insta: '#', linkedin: '#' }
  socials.forEach(s => {
    const name = s.platform_name?.toLowerCase()
    if (name === 'twitter') socialMap.twitter = s.url || '#'
    if (name === 'facebook') socialMap.fb = s.url || '#'
    if (name === 'instagram') socialMap.insta = s.url || '#'
    if (name === 'linkedin') socialMap.linkedin = s.url || '#'
  })

  // Parse Typography configuration with fallback to defaults
  let typoConfig: TypographyConfig = DEFAULT_TYPOGRAPHY
  const typoRaw = settingsMap['site_typography']
  if (typoRaw) {
    try {
      const parsed = JSON.parse(typoRaw)
      typoConfig = {
        body: { ...DEFAULT_TYPOGRAPHY.body, ...(parsed.body || {}) },
        headings: { ...DEFAULT_TYPOGRAPHY.headings, ...(parsed.headings || {}) },
        h1: { ...DEFAULT_TYPOGRAPHY.h1, ...(parsed.h1 || {}) },
        h2: { ...DEFAULT_TYPOGRAPHY.h2, ...(parsed.h2 || {}) },
        h3: { ...DEFAULT_TYPOGRAPHY.h3, ...(parsed.h3 || {}) },
        h4: { ...DEFAULT_TYPOGRAPHY.h4, ...(parsed.h4 || {}) },
        h5: { ...DEFAULT_TYPOGRAPHY.h5, ...(parsed.h5 || {}) },
        h6: { ...DEFAULT_TYPOGRAPHY.h6, ...(parsed.h6 || {}) },
        display: { ...DEFAULT_TYPOGRAPHY.display, ...(parsed.display || {}) },
        navigation: { ...DEFAULT_TYPOGRAPHY.navigation, ...(parsed.navigation || {}) },
        button: { ...DEFAULT_TYPOGRAPHY.button, ...(parsed.button || {}) },
        projectTitle: { ...DEFAULT_TYPOGRAPHY.projectTitle, ...(parsed.projectTitle || {}) }
      }
    } catch {
      typoConfig = DEFAULT_TYPOGRAPHY
    }
  }
  const typoCss = generateTypographyCss(typoConfig)
  const typoFontLinks = getGoogleFontsLinks(typoConfig)

  return {
    contact: {
      address: settingsMap['contact_address'] || '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh',
      phone: settingsMap['contact_phone'] || '+88 01894932401', 
      cell: settingsMap['contact_cell'] || '+88 01894932401',
      email: settingsMap['contact_email'] || 'info@cozmictech.com', 
      email2: settingsMap['contact_email2'] || 'info@cozmictech.com',
      company_title: settingsMap['company_title'] || 'Cozmic Technology', 
      sec_title: 'Contact',
      map: settingsMap['contact_map'] || ''
    },
    social: socialMap,
    homepage: { 
      company_title: settingsMap['company_title'] || 'Cozmic Technology', 
      logo: settingsMap['logo'] || '', 
      favicon: settingsMap['favicon'] || '', 
      theme: settingsMap['theme'] || 'theme-default',
      projects_page_layout: settingsMap['projects_page_layout'] || 'grid'
    },
    footer: {
      copyright_text: settingsMap['footer_copyright_text'] || settingsMap['company_title'] || 'Cozmic Technology',
      copyright_year: settingsMap['footer_copyright_year'] || '',
      copyright_auto_year: settingsMap['footer_copyright_auto_year'] !== 'false',
      designed_by_text: settingsMap['footer_designed_by_text'] || 'mDynamic',
      designed_by_prefix: settingsMap['footer_designed_by_prefix'] || 'Designed by',
      designed_by_url: settingsMap['footer_designed_by_url'] || 'https://mdynamic.us/'
    },
    services: services || [],
    aboutUs: aboutStorySec ? { story_body: aboutStorySec.content } : null,
    typography: {
      config: typoConfig,
      css: typoCss,
      fontLinks: typoFontLinks
    }
  }
}, {
  maxAge: 60, // 1-minute TTL — shared header/footer data
  name: 'common-data',
  getKey: () => 'common-v2'
})
