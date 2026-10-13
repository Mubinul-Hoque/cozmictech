import { prisma } from '../../../../utils/prisma'
import { requirePermission } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  if (method === 'PUT') {
    await requirePermission(event, 'contact', 'edit');
    try {
      const body = await readBody(event)
      const updateData: any = {}
      if (body.name !== undefined) {
        updateData.name = body.name
      }

      const updated = await prisma.categories.update({
        where: { id },
        data: updateData
      })
      await clearPublicCache();
      return { success: true, data: updated }
    } catch (error: any) {
      console.error('Error updating admin message category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update category' })
    }
  }

  if (method === 'DELETE') {
    await requirePermission(event, 'contact', 'delete');
    try {
      await prisma.categories.delete({
        where: { id }
      })
      await clearPublicCache();
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting admin message category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete category' })
    }
  }
})
