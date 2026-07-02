import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const [homepage, contact, socials] = await Promise.all([
        prisma.homepage.findFirst(),
        prisma.contact.findFirst({
          select: {
            id: true,
            sec_title: true,
            company_title: true,
            address: true,
            phone: true,
            cell: true,
            email: true,
            email2: true,
            map: true
          }
        }),
        prisma.social.findMany()
      ])

      const socialMap: any = {
        twitter: '#',
        fb: '#',
        insta: '#',
        linkedin: '#'
      }
      socials.forEach(s => {
        if (s.name?.toLowerCase() === 'twitter') socialMap.twitter = s.link || '#'
        if (s.name?.toLowerCase() === 'facebook') socialMap.fb = s.link || '#'
        if (s.name?.toLowerCase() === 'instagram') socialMap.insta = s.link || '#'
        if (s.name?.toLowerCase() === 'linkedin') socialMap.linkedin = s.link || '#'
      })

      const defaultHomepage = {
        company_title: "Cozmic Technology",
        slogan: "Let's work together to make great things possible.",
        bgslide_img: "/assets/img/hero-carousel/hero-carousel-1.jpg,/assets/img/hero-carousel/hero-carousel-2.jpg,/assets/img/hero-carousel/hero-carousel-3.jpg",
        logo: "",
        favicon: "",
        theme: "theme-default",
        glance_title: "At a Glance",
        glance_description: "We are a collective of geotechnical engineers, architects, designers, and planners working together to build a better future.\n\nWe work closely with our clients to interpret their dreams and visions accurately, bringing them to reality through construction and engineering solutions.",
        glance_img: "glance.jpg",
        Exp_title: "Years of Experience",
        exp_year: "15+",
        pro_title: "Successful Projects",
        pro_nos: "250+",
        title1: "15+", tag1: "Years of Experience",
        title2: "250+", tag2: "Successful Projects",
        title3: "Our Services", tag3: "We provide a broad assortment of geotechnical investigation, detail engineering consultancy, and project management services.",
        title4: "Our Strengths", tag4: "We have an experienced team of Geotechnical Engineers & Architects. Our motive is to provide effective, efficient & economical services.",
        title5: "Testimonials", tag5: "What Our Clients Say",
        title6: "Recent News & Insights", tag6: "Stay updated with our latest engineering insights, project milestones, and company news.",
        title7: "", content7: "", image7: "",
        title8: "", content8: "", image8: "",
        title9: "", content9: "", image9: "",
      }

      const mergedHomepage = homepage ? { ...defaultHomepage, ...homepage } : defaultHomepage

      return {
        success: true,
        homepage: mergedHomepage,
        contact: contact || {
          sec_title: "Contact",
          company_title: "Cozmic Technology",
          address: "8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh",
          phone: "+88 01894932401",
          cell: "+88 01894932401",
          email: "info@cozmictech.com",
          email2: "info@cozmictech.com",
          map: ""
        },
        social: socialMap
      }
    } catch (error: any) {
      console.error('Error fetching admin settings:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings' })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { homepage, contact, social } = body

      // Helper helper to safely handle nullable values with sanitizePlainText
      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return '';
        return sanitizePlainText(String(val));
      }

      // 1. Update or create Homepage (Hero) config
      const existingHomepage = await prisma.homepage.findFirst()
      const homepageData = {
        slogan: safeSanitize(homepage?.slogan),
        company_title: safeSanitize(homepage?.company_title),
        bgslide_img: safeSanitize(homepage?.bgslide_img),
        logo: safeSanitize(homepage?.logo),
        favicon: safeSanitize(homepage?.favicon),
        theme: safeSanitize(homepage?.theme || 'theme-default'),
        glance_title: safeSanitize(homepage?.glance_title),
        glance_description: safeSanitize(homepage?.glance_description),
        glance_img: safeSanitize(homepage?.glance_img),
        Exp_title: safeSanitize(homepage?.Exp_title || 'Years of Experience'),
        exp_year: safeSanitize(homepage?.exp_year || '15+'),
        pro_title: safeSanitize(homepage?.pro_title || 'Successful Projects'),
        pro_nos: safeSanitize(homepage?.pro_nos || '250+'),
        title1: safeSanitize(homepage?.title1),
        tag1: safeSanitize(homepage?.tag1),
        title2: safeSanitize(homepage?.title2),
        tag2: safeSanitize(homepage?.tag2),
        title3: safeSanitize(homepage?.title3),
        tag3: safeSanitize(homepage?.tag3),
        title4: safeSanitize(homepage?.title4),
        tag4: safeSanitize(homepage?.tag4),
        title5: safeSanitize(homepage?.title5),
        tag5: safeSanitize(homepage?.tag5),
        title6: safeSanitize(homepage?.title6),
        tag6: safeSanitize(homepage?.tag6),
        title7: safeSanitize(homepage?.title7),
        content7: safeSanitize(homepage?.content7),
        image7: safeSanitize(homepage?.image7),
        title8: safeSanitize(homepage?.title8),
        content8: safeSanitize(homepage?.content8),
        image8: safeSanitize(homepage?.image8),
        title9: safeSanitize(homepage?.title9),
        content9: safeSanitize(homepage?.content9),
        image9: safeSanitize(homepage?.image9),
      }

      if (existingHomepage) {
        await prisma.homepage.update({
          where: { id: existingHomepage.id },
          data: homepageData
        })
      } else {
        await prisma.homepage.create({
          data: homepageData
        })
      }

      // 2. Update or create Contact config
      const existingContact = await prisma.contact.findFirst()
      const contactData = {
        sec_title: safeSanitize(contact?.sec_title || 'Contact'),
        company_title: safeSanitize(contact?.company_title || 'Cozmic Technology'),
        address: safeSanitize(contact?.address),
        phone: safeSanitize(contact?.phone),
        cell: safeSanitize(contact?.cell),
        email: safeSanitize(contact?.email),
        email2: safeSanitize(contact?.email2),
        map: safeSanitize(contact?.map)
      }
      
      // Enforce database limits for contact email
      if (contactData.email.length > 100 || contactData.email2.length > 100) {
        throw createError({ statusCode: 400, statusMessage: 'Email length exceeds limit of 100 characters' })
      }

      if (existingContact) {
        await prisma.contact.update({
          where: { id: existingContact.id },
          data: contactData
        })
      } else {
        await prisma.contact.create({
          data: contactData
        })
      }

      // 3. Update or create Social config
      if (social) {
        const dbSocials = await prisma.social.findMany()
        const types = ['twitter', 'facebook', 'instagram', 'linkedin']
        
        for (const type of types) {
          let linkVal = '#'
          if (type === 'twitter') linkVal = social.twitter || '#'
          if (type === 'facebook') linkVal = social.fb || '#'
          if (type === 'instagram') linkVal = social.insta || '#'
          if (type === 'linkedin') linkVal = social.linkedin || '#'

          const sanitizedLink = safeSanitize(linkVal);

          const match = dbSocials.find(s => s.name?.toLowerCase() === type)
          if (match) {
            await prisma.social.update({
              where: { id: match.id },
              data: { link: sanitizedLink }
            })
          } else {
            let iconVal = 'bi bi-link'
            if (type === 'twitter') iconVal = 'bi bi-twitter'
            if (type === 'facebook') iconVal = 'bi bi-facebook'
            if (type === 'instagram') iconVal = 'bi bi-instagram'
            if (type === 'linkedin') iconVal = 'bi bi-linkedin'
            
            await prisma.social.create({
              data: {
                name: type.charAt(0).toUpperCase() + type.slice(1),
                icon: iconVal,
                link: sanitizedLink
              }
            })
          }
        }
      }

      return {
        success: true,
        message: 'Settings saved successfully'
      }
    } catch (error: any) {
      console.error('Error saving admin settings:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save settings' })
    }
  }
})
