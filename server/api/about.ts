import { prisma } from '../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  const [aboutSections, allSettings, team, services, socials] = await Promise.all([
    prisma.page_sections.findMany({ where: { page_slug: 'about' } }),
    prisma.settings.findMany(),
    prisma.team_members.findMany({
      orderBy: { id: 'asc' },
      take: 50,
      select: {
        id: true, name: true, designation: true,
        image: true, message: true, facebook_url: true,
        instagram_url: true, linkedin_url: true
      }
    }),
    prisma.services.findMany({
      select: { id: true, name: true }
    }),
    prisma.social_links.findMany()
  ])

  const mappedTeam = team.map(m => ({
    id: m.id,
    name: m.name,
    designation: m.designation,
    image: m.image,
    message: m.message,
    fb: m.facebook_url,
    insta: m.instagram_url,
    linkedin: m.linkedin_url
  }))

  const settingsMap: Record<string, string> = {}
  allSettings.forEach(s => settingsMap[s.setting_key] = s.setting_value || '')
  
  const getSec = (key: string) => aboutSections.find(s => s.section_key === key) || {} as any
  const story = getSec('our_story')
  const mission = getSec('mission')
  const vision = getSec('vision')
  const teamIntro = getSec('our_team_intro')

  const aboutUs = {
    tagline: settingsMap['about_tagline'] || 'Cozmic Technology - About Us',
    est: settingsMap['about_est'] || '2015',
    happy_icon: settingsMap['about_happy_icon'] || 'lucide:smile',
    happy_client: parseInt(settingsMap['about_happy_client'] || '120'),
    projects_icon: settingsMap['about_projects_icon'] || 'lucide:briefcase',
    project_nos: parseInt(settingsMap['about_project_nos'] || '250'),
    support_icon: settingsMap['about_support_icon'] || 'lucide:headset',
    hrs_support: parseInt(settingsMap['about_hrs_support'] || '1740'),
    emp_icon: settingsMap['about_emp_icon'] || 'lucide:hard-hat',
    emp_nos: parseInt(settingsMap['about_emp_nos'] || '35'),
    
    story_title: story.title || 'Our Story',
    story_body: story.content || '',
    story_body2: story.subtitle_or_tag || '',
    
    mission_title: mission.title || 'OUR MISSION',
    mission_body: mission.content || '',
    
    vision_title: vision.title || 'OUR VISION',
    vision_body: vision.content || '',
    
    values_title: settingsMap['about_values_title'] || 'OUR VALUES',
    values_body: parseInt(settingsMap['about_values_body'] || '0'),
    
    team_title: teamIntro.title || 'Our Team',
    team_description: teamIntro.content || ''
  }

  const socialMap: Record<string, string> = {
    twitter: '#',
    fb: '#',
    insta: '#',
    linkedin: '#'
  }
  socials.forEach(s => {
    const name = s.platform_name?.toLowerCase()
    if (name === 'twitter') socialMap.twitter = s.url || '#'
    if (name === 'facebook') socialMap.fb = s.url || '#'
    if (name === 'instagram') socialMap.insta = s.url || '#'
    if (name === 'linkedin') socialMap.linkedin = s.url || '#'
  })

  return { aboutUs, team: mappedTeam, social: socialMap, services }
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'about-page',
  getKey: () => 'about-v2'
})
