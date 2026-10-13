import { prisma } from '../utils/prisma'

export default defineCachedEventHandler(async (_event) => {
  const [posts, categories, heroSection, heroEyebrowSetting] = await Promise.all([
    prisma.posts.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        category_id: true,
        title: true,
        image: true,
        content: true,
        author_name: true,
        published_at: true,
        created_at: true,
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.categories.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.page_sections.findFirst({ where: { page_slug: 'blog', section_key: 'hero' } }),
    prisma.settings.findUnique({ where: { setting_key: 'blog_hero_eyebrow' } })
  ])

  const mappedPosts = posts.map(p => {
    const rawContent = p.content ? p.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : ''
    const excerpt = rawContent.length > 200 ? rawContent.substring(0, 195).trim() + '...' : rawContent

    let formattedDate = 'Recent'
    const targetDate = p.published_at || p.created_at
    if (targetDate) {
      try {
        const d = new Date(targetDate)
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        }
      } catch {}
    }

    return {
      id: p.id,
      category_id: p.category_id,
      title: p.title ? p.title.trim() : 'Untitled Post',
      image: p.image,
      content: p.content,
      excerpt,
      author: p.author_name || 'Admin',
      category_name: p.categories?.name || 'Engineering',
      post_catid: p.category_id,
      sdate: formattedDate,
      date: p.created_at
    }
  })

  return {
    posts: mappedPosts,
    categories,
    pageContent: {
      hero_eyebrow: heroEyebrowSetting?.setting_value || 'Perspectives • Journal • Insights',
      hero_heading: heroSection?.title || 'News & Perspectives',
      hero_body: heroSection?.content || 'Thought leadership, technical innovations, project milestones, and contemporary engineering discourse from our team across Bangladesh.'
    }
  }
}, {
  maxAge: 60 * 5,      // 5-minute TTL
  name: 'blog-index',
  getKey: () => 'blog-v3'
})
