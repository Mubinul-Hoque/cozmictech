import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const updateData: any = {}
      if (body.name !== undefined) updateData.name = body.name
      if (body.active !== undefined) updateData.active = body.active

      const updated = await prisma.message_category.update({
        where: { id },
        data: updateData
      })
      return { success: true, data: updated }
    } catch (error: any) {
      console.error('Error updating admin message category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update category' })
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.message_category.delete({
        where: { id }
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting admin message category:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete category' })
    }
  }
})
