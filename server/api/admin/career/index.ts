import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const careers = await prisma.career.findMany({
        orderBy: { published: 'desc' },
        select: {
          id: true,
          post: true,
          location: true,
          vacancy: true,
          emp_status: true,
          deadline: true,
          status: true,
          experience: true,
          published: true
        }
      })
      return {
        success: true,
        data: careers
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

      // Input validations matching the database schema limits
      const post = String(body.post).trim();
      const location = String(body.location || 'Dhaka').trim();
      const image = String(body.image || 'default.jpg').trim();
      const emp_status = String(body.emp_status || 'Full-Time').trim();
      const experience = String(body.experience || '').trim();
      const salary = String(body.salary || 'Negotiable').trim();
      const gender = String(body.gender || 'Any').trim();
      const Edu_Qlty = String(body.Edu_Qlty || '').trim();
      const status = String(body.status || 'Active').trim();

      if (
        post.length > 100 || location.length > 100 || image.length > 100 ||
        emp_status.length > 50 || experience.length > 100 || salary.length > 25 ||
        gender.length > 10 || Edu_Qlty.length > 255 || status.length > 15
      ) {
        throw createError({ statusCode: 400, statusMessage: 'Input exceeds maximum allowed length' });
      }

      const newCareer = await prisma.career.create({
        data: {
          post: sanitizePlainText(post),
          location: sanitizePlainText(location),
          image: sanitizePlainText(image),
          vacancy: body.vacancy ? parseInt(body.vacancy) : 1,
          emp_status: sanitizePlainText(emp_status),
          experience: sanitizePlainText(experience),
          salary: sanitizePlainText(salary),
          gender: sanitizePlainText(gender),
          deadline: body.deadline ? new Date(body.deadline) : null,
          description: sanitizeHtmlContent(body.description || ''),
          responsibilities: sanitizeHtmlContent(body.responsibilities || ''),
          Edu_Qlty: sanitizePlainText(Edu_Qlty),
          other_beninifs: sanitizeHtmlContent(body.other_beninifs || ''),
          published: new Date(),
          status: sanitizePlainText(status)
        }
      })

      return {
        success: true,
        message: 'Career opening added successfully',
        data: newCareer
      }
    } catch (error: any) {
      console.error('Error creating career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create career opening' })
    }
  }
})
