import { prisma } from '../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  const [aboutSections, allSettings, team, services, socials] = await Promise.all([
    prisma.page_sections.findMany({ where: { page_slug: 'about' } }),
    prisma.settings.findMany({
      where: {
        OR: [
          { setting_key: 'company_title' },
          { setting_key: { startsWith: 'about_' } }
        ]
      }
    }),
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
    prisma.social_links.findMany({
      select: { platform_name: true, url: true }
    })
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
  const cta = getSec('cta_banner')

  const aboutUs = {
    company_title: settingsMap['company_title'] || 'Cozmic Technology',
    tagline: settingsMap['about_tagline'] || 'Cozmic Technology - About Us',
    est: settingsMap['about_est'] || '2015',
    location_text: settingsMap['about_location_text'] || 'Dhaka, Bangladesh',
    happy_icon: settingsMap['about_happy_icon'] || 'lucide:smile',
    happy_client: parseInt(settingsMap['about_happy_client'] || '120'),
    happy_label: settingsMap['about_happy_label'] || 'Happy Clients',
    projects_icon: settingsMap['about_projects_icon'] || 'lucide:briefcase',
    project_nos: parseInt(settingsMap['about_project_nos'] || '250'),
    project_label: settingsMap['about_project_label'] || 'Projects Completed',
    support_icon: settingsMap['about_support_icon'] || 'lucide:headset',
    hrs_support: parseInt(settingsMap['about_hrs_support'] || '1740'),
    support_label: settingsMap['about_support_label'] || 'Hours of Support',
    emp_icon: settingsMap['about_emp_icon'] || 'lucide:hard-hat',
    emp_nos: parseInt(settingsMap['about_emp_nos'] || '35'),
    emp_label: settingsMap['about_emp_label'] || 'Hard Workers',

    hero_eyebrow: settingsMap['about_hero_eyebrow'] || 'Studio — Cozmic Technology',
    mission_eyebrow: settingsMap['about_mission_eyebrow'] || 'Mission & Focus',
    mission_label: settingsMap['about_mission_label'] || 'Committed to Precision',
    guarantee_label: settingsMap['about_guarantee_label'] || 'Our Guarantee',
    disciplines_label: settingsMap['about_disciplines_label'] || 'Core Disciplines',
    vision_eyebrow: settingsMap['about_vision_eyebrow'] || 'Looking Forward',
    team_eyebrow: settingsMap['about_team_eyebrow'] || 'The Team',

    story_title: story.title || 'Our Story',
    story_body: story.content || '',
    story_body2: story.subtitle_or_tag || '',
    story_image: story.image || '',

    mission_title: mission.title || 'OUR MISSION',
    mission_body: mission.content || '',
    mission_image: mission.image || '',
    mission_is_active: mission.is_active !== false,

    vision_title: vision.title || 'OUR VISION',
    vision_body: vision.content || '',
    vision_image: vision.image || '',
    vision_is_active: vision.is_active !== false,

    team_title: teamIntro.title || 'Our Team',
    team_description: teamIntro.content || 'At Cozmic Technology, we believe that great engineering and design begins with good people. Our team combines creativity, technical knowledge and a deep understanding of context to create environments that are thoughtful, sustainable and enduring.\n\nTogether, we are united by a shared commitment to design and engineering that serves people, respects place and stands the test of time.\n\nEvery project is shaped by a diverse group of engineers, architects, planners, researchers and project managers working together toward a common purpose. Different perspectives, experiences and expertise come together to transform complexity into clarity and ideas into reality.',

    cta_eyebrow: cta.subtitle_or_tag || 'Collaboration • Excellence',
    cta_heading: cta.title || 'Good People. Good Engineering.',
    cta_body: cta.content || 'Ready to turn your ambitious engineering, geotechnical, or architectural vision into enduring reality? Our team is here to collaborate with you.'
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
