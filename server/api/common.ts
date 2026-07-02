import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const [contactInfo, socials, homepage] = await Promise.all([
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
      prisma.social.findMany(),
      prisma.homepage.findFirst({
        select: {
          company_title: true,
          logo: true,
          favicon: true,
          theme: true
        }
      })
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

    return {
      contact: contactInfo || {
        address: '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh',
        phone: '+88 01894932401',
        cell: '+88 01894932401',
        email: 'info@cozmictech.com',
        email2: 'info@cozmictech.com',
        company_title: 'Cozmic Technology',
        sec_title: 'Contact'
      },
      social: socialMap,
      homepage: homepage || {
        company_title: 'Cozmic Technology',
        logo: '',
        favicon: '',
        theme: 'theme-default'
      }
    }
  } catch (error) {
    console.error('Error fetching common data:', error)
    return {
      contact: {
        address: '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh',
        phone: '+88 01894932401',
        cell: '+88 01894932401',
        email: 'info@cozmictech.com',
        email2: 'info@cozmictech.com',
        company_title: 'Cozmic Technology',
        sec_title: 'Contact'
      },
      social: {
        twitter: '#',
        fb: '#',
        insta: '#',
        linkedin: '#'
      },
      homepage: {
        company_title: 'Cozmic Technology',
        logo: '',
        favicon: '',
        theme: 'theme-default'
      }
    }
  }
})
