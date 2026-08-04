import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const careers = await prisma.careers.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          post: true,
          location: true,
          vacancy: true,
          employment_status: true,
          deadline: true,
          is_active: true,
          experience: true,
          created_at: true
        }
      })
      
      const mappedCareers = careers.map(c => ({
        ...c,
        emp_status: c.employment_status,
        status: c.is_active ? 'Active' : 'Inactive',
        published: c.created_at
      }))

      await clearPublicCache();
      return {
        success: true,
        data: mappedCareers
      }
    } catch (error: any) {
      console.error('Error fetching careers:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch career list' })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      if (!body.post) {
        throw createError({ statusCode: 400, statusMessage: 'Post title is required' });
      }

      const post = String(body.post).trim();
      const location = String(body.location || 'Dhaka').trim();
      const image = String(body.image || 'default.jpg').trim();
      const emp_status = String(body.emp_status || 'Full-Time').trim();
      const experience = String(body.experience || '').trim();
      const salary = String(body.salary || 'Negotiable').trim();
      const gender = String(body.gender || 'Any').trim();
      const Edu_Qlty = String(body.Edu_Qlty || '').trim();
      const status = String(body.status || 'Active').trim();

      const newCareer = await prisma.careers.create({
        data: {
          post: sanitizePlainText(post),
          location: sanitizePlainText(location),
          image: sanitizePlainText(image),
          vacancy: body.vacancy ? parseInt(body.vacancy) : 1,
          employment_status: sanitizePlainText(emp_status),
          experience: sanitizePlainText(experience),
          salary: sanitizePlainText(salary),
          gender: sanitizePlainText(gender),
          deadline: body.deadline ? new Date(body.deadline) : null,
          description: sanitizeHtmlContent(body.description || ''),
          responsibilities: sanitizeHtmlContent(body.responsibilities || ''),
          education_quality: sanitizePlainText(Edu_Qlty),
          other_benefits: sanitizeHtmlContent(body.other_beninifs || ''),
          is_active: status.toLowerCase() === 'active'
        }
      })

      const mappedData = {
        ...newCareer,
        emp_status: newCareer.employment_status,
        status: newCareer.is_active ? 'Active' : 'Inactive',
        published: newCareer.created_at
      }

      await clearPublicCache();
      return {
        success: true,
        message: 'Career opening added successfully',
        data: mappedData
      }
    } catch (error: any) {
      console.error('Error creating career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create career opening' })
    }
  }
})
