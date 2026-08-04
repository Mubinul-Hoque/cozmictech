import { prisma } from '../utils/prisma'

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
      theme: settingsMap['theme'] || 'theme-default' 
    },
    services: services || [],
    aboutUs: aboutStorySec ? { story_body: aboutStorySec.content } : null
  }
}, {
  maxAge: 60, // 1-minute TTL — shared header/footer data
  name: 'common-data',
  getKey: () => 'common-v2'
})
