import { prisma } from '../../utils/prisma'
import { sanitizePlainText } from '../../utils/sanitize'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // 1. GET: Fetch all clients
  if (method === 'GET') {
    try {
      const clients = await prisma.clients.findMany({
        orderBy: { id: 'desc' }
      })
      await clearPublicCache();
      return {
        success: true,
        data: clients
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch clients' })
    }
  }

  // 2. POST: Create a new client logo record
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { client_name, logo } = body

      if (!client_name) {
        throw createError({ statusCode: 400, statusMessage: 'Client name is required' })
      }

      const newClient = await prisma.clients.create({
        data: {
          client_name: sanitizePlainText(client_name),
          logo: logo ? sanitizePlainText(logo) : null
        }
      })

      await clearPublicCache();
      return {
        success: true,
        message: 'Client logo added successfully',
        data: newClient
      }
    } catch (error: any) {
      console.error('Error creating client logo:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create client' })
    }
  }

  // 3. PUT: Update an existing client logo record
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const { id, client_name, logo } = body

      if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Client ID is required' })
      }

      if (!client_name) {
        throw createError({ statusCode: 400, statusMessage: 'Client name is required' })
      }

      const updatedClient = await prisma.clients.update({
        where: { id: parseInt(id) },
        data: {
          client_name: sanitizePlainText(client_name),
          logo: logo ? sanitizePlainText(logo) : null
        }
      })

      await clearPublicCache();
      return {
        success: true,
        message: 'Client logo updated successfully',
        data: updatedClient
      }
    } catch (error: any) {
      console.error('Error updating client logo:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to update client' })
    }
  }

  // 4. DELETE: Delete a client logo record
  if (method === 'DELETE') {
    try {
      const query = getQuery(event)
      const id = query.id ? parseInt(query.id as string) : null

      if (!id || isNaN(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or missing Client ID' })
      }

      await prisma.clients.delete({
        where: { id }
      })

      await clearPublicCache();
      return {
        success: true,
        message: 'Client logo deleted successfully'
      }
    } catch (error: any) {
      console.error('Error deleting client logo:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to delete client' })
    }
  }
})
