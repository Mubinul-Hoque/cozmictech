import { prisma } from '../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  const [homeSections, allSettings, strengths, testimonials, clients, recentPosts] = await Promise.all([
    prisma.page_sections.findMany({ where: { page_slug: 'home' } }),
    prisma.settings.findMany(),
    prisma.strengths.findMany({
      select: { id: true, title: true, icon: true, content: true }
    }),
    prisma.testimonials.findMany({
      select: {
        id: true, name: true, designation: true,
        company: true, stars: true, image: true, story: true
      }
    }),
    prisma.clients.findMany({
      select: { id: true, logo: true, client_name: true }
    }),
    prisma.posts.findMany({
      take: 3,
      orderBy: { created_at: 'desc' },
      select: {
        id: true, title: true, image: true,
        post_date: true, content: true, author: true, category_id: true, created_at: true
      }
    })
  ])

  const settingsMap: Record<string, string> = {}
  allSettings.forEach(s => {
    settingsMap[s.setting_key] = s.setting_value || ''
  })

  const getSec = (key: string) => homeSections.find(s => s.section_key === key) || {} as any
  
  const hero = getSec('hero_slider')
  const glance = getSec('glance')
  const experience = getSec('experience')
  const projects = getSec('projects')
  const servicesSec = getSec('services_intro')
  const strengthSec = getSec('strength_intro')
  const testimonialsSec = getSec('testimonials_intro')
  const recentBlog = getSec('recent_blog_intro')
  const sustainable = getSec('sustainable')
  const buildingTech = getSec('building_tech')
  const career = getSec('career_intro')

  const homepage = {
    company_title: settingsMap['company_title'] || 'Cozmic Technology',
    slogan: settingsMap['slogan'] || "Let's work together to make great things possible.",
    hero_images: hero?.image ? JSON.parse(hero.image) : [],
    logo: settingsMap['logo'] || '',
    favicon: settingsMap['favicon'] || '',
    theme: settingsMap['theme'] || 'theme-default',

    glance_title: glance.title || 'At a Glance',
    glance_description: glance.content || '',
    glance_img: glance.image || 'glance.jpg',

    Exp_title: experience.title || 'Years of Experience',
    exp_year: experience.counter_number || '15+',
    
    pro_title: projects.title || 'Successful Projects',
    pro_nos: projects.counter_number || '250+',
    
    title1: '', tag1: '', title2: '', tag2: '', // left empty for backward compatibility
    title3: servicesSec.title || 'Our Services', tag3: servicesSec.subtitle_or_tag || '',
    title4: strengthSec.title || 'Our Strengths', tag4: strengthSec.subtitle_or_tag || '',
    title5: testimonialsSec.title || 'Testimonials', tag5: testimonialsSec.subtitle_or_tag || '',
    title6: recentBlog.title || 'Recent News & Insights', tag6: recentBlog.subtitle_or_tag || '',
    
    title7: sustainable.title || '', content7: sustainable.content || '', image7: sustainable.image || '',
    title8: buildingTech.title || '', content8: buildingTech.content || '', image8: buildingTech.image || '',
    title9: career.title || '', content9: career.content || '', image9: career.image || '',
  }

  const mappedRecentPosts = recentPosts.map(p => ({
    ...p,
    sdate: p.post_date,
    date: p.created_at
  }))

  return { homepage, strengths, services: [], testimonials, clients, recentPosts: mappedRecentPosts, sectors: [] }
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'homepage-data',
  getKey: () => 'homepage-v2'
})
