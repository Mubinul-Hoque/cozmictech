import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const idStr = getRouterParam(event, 'id')
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing career ID' })
  }
  const id = parseInt(idStr)

  if (method === 'GET') {
    await requirePermission(event, 'careers', 'view');
    try {
      const career = await prisma.careers.findUnique({
        where: { id }
      })
      if (!career) {
        throw createError({ statusCode: 404, statusMessage: 'Career opening not found' })
      }
      return {
        ...career,
        emp_status: career.employment_status,
        status: career.is_active ? 'Active' : 'Inactive',
        published: career.created_at,
        Edu_Qlty: career.education_quality,
        other_beninifs: career.other_benefits
      }
    } catch (error: any) {
      console.error('Error fetching career details:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch career details' })
    }
  }

  if (method === 'PUT') {
    await requirePermission(event, 'careers', 'edit');
    try {
      const body = await readBody(event)
      if (!body.post) {
        throw createError({ statusCode: 400, statusMessage: 'Post title is required' })
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

      const updated = await prisma.careers.update({
        where: { id },
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

      await clearPublicCache();
      return {
        success: true,
        message: 'Career opening updated successfully',
        data: {
          ...updated,
          emp_status: updated.employment_status,
          status: updated.is_active ? 'Active' : 'Inactive',
          published: updated.created_at
        }
      }
    } catch (error: any) {
      console.error('Error updating career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update career opening' })
    }
  }

  if (method === 'DELETE') {
    await requirePermission(event, 'careers', 'delete');
    try {
      await prisma.careers.delete({
        where: { id }
      })
      await clearPublicCache();
      return { success: true, message: 'Career opening deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting career opening:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete career opening' })
    }
  }
})
