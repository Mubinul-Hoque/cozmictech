import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const idStr = getRouterParam(event, 'id')
  
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing career ID' })
  }
  const id = parseInt(idStr)

  if (method === 'GET') {
    try {
      const career = await prisma.career.findUnique({
        where: { id }
      })
      if (!career) {
        throw createError({ statusCode: 404, statusMessage: 'Career opening not found' })
      }
      return {
        success: true,
        data: career
      }
    } catch (error: any) {
      console.error('Error fetching career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch career details' })
    }
  }

  if (method === 'PUT') {
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

      const updated = await prisma.career.update({
        where: { id },
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
          status: sanitizePlainText(status)
        }
      })

      return {
        success: true,
        message: 'Career opening updated successfully',
        data: updated
      }
    } catch (error: any) {
      console.error('Error updating career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update career opening' })
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.career.delete({
        where: { id }
      })
      return {
        success: true,
        message: 'Career opening deleted successfully'
      }
    } catch (error: any) {
      console.error('Error deleting career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete career opening' })
    }
  }
})
