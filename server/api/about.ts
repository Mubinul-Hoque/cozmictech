import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const [aboutUs, team] = await Promise.all([
      prisma.about_us.findFirst(),
      prisma.team.findMany({
        select: {
          id: true,
          name: true,
          designation: true,
          image: true,
          message: true,
          fb: true,
          insta: true,
          linkedin: true
        }
      })
    ])

    const socialMap: any = {
      twitter: '#',
      fb: '#',
      insta: '#',
      linkedin: '#'
    }

    return {
      aboutUs,
      team,
      social: socialMap
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
    return {
      aboutUs: null,
      team: []
    }
  }
})
