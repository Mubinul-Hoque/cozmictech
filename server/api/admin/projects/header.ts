import { prisma } from '../../../utils/prisma'
import { requirePermission } from '../../../utils/rbac'
import { clearPublicCache } from '../../../utils/cache'

const DEFAULT_HEADER = {
  title: 'Our projects',
  content: 'Since 2009, REINCARNATION has shaped spaces across Bangladesh — from large-scale industrial and RMG facilities to corporate interiors, hospitality, mixed-use landmarks and private residences. Each project pairs architectural rigour with a careful eye for how people actually use a space.',
  subtitle_or_tag: '',
  is_active: true
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // 1. GET: Read current header configuration
  if (method === 'GET') {
    try {
      await requirePermission(event, 'projects', 'view')
    } catch {
      await requirePermission(event, 'global_settings', 'view')
    }

    try {
      const section = await prisma.page_sections.findFirst({
        where: {
          page_slug: 'projects',
          section_key: 'header'
        }
      })

      if (!section) {
        return {
          success: true,
          exists: false,
          data: {
            id: null,
            title: DEFAULT_HEADER.title,
            content: DEFAULT_HEADER.content,
            subtitle_or_tag: DEFAULT_HEADER.subtitle_or_tag,
            is_active: DEFAULT_HEADER.is_active,
            updated_at: null
          }
        }
      }

      return {
        success: true,
        exists: true,
        data: {
          id: section.id,
          title: section.title || DEFAULT_HEADER.title,
          content: section.content !== null && section.content !== undefined ? section.content : DEFAULT_HEADER.content,
          subtitle_or_tag: section.subtitle_or_tag || '',
          is_active: section.is_active ?? true,
          updated_at: section.updated_at
        }
      }
    } catch (error: any) {
      console.error('Error fetching projects header section:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Failed to fetch projects header configuration'
      })
    }
  }

  // 2. POST / PUT: Create or Update header configuration
  if (method === 'POST' || method === 'PUT') {
    try {
      await requirePermission(event, 'projects', 'edit')
    } catch {
      await requirePermission(event, 'global_settings', 'edit')
    }

    try {
      const body = await readBody(event)

      const title = (body?.title !== undefined && body?.title !== null) ? String(body.title).trim() : DEFAULT_HEADER.title
      const content = (body?.content !== undefined && body?.content !== null) ? String(body.content).trim() : DEFAULT_HEADER.content
      const subtitle = (body?.subtitle_or_tag !== undefined && body?.subtitle_or_tag !== null) ? String(body.subtitle_or_tag).trim() : ''
      const isActive = body?.is_active !== undefined ? Boolean(body.is_active) : true

      const existing = await prisma.page_sections.findFirst({
        where: {
          page_slug: 'projects',
          section_key: 'header'
        }
      })

      let result
      if (existing) {
        result = await prisma.page_sections.update({
          where: { id: existing.id },
          data: {
            title: title || DEFAULT_HEADER.title,
            content,
            subtitle_or_tag: subtitle,
            is_active: isActive,
            updated_at: new Date()
          }
        })
      } else {
        result = await prisma.page_sections.create({
          data: {
            page_slug: 'projects',
            section_key: 'header',
            title: title || DEFAULT_HEADER.title,
            content,
            subtitle_or_tag: subtitle,
            is_active: isActive
          }
        })
      }

      await clearPublicCache()

      return {
        success: true,
        message: 'Projects header content updated successfully',
        exists: true,
        data: {
          id: result.id,
          title: result.title,
          content: result.content,
          subtitle_or_tag: result.subtitle_or_tag,
          is_active: result.is_active,
          updated_at: result.updated_at
        }
      }
    } catch (error: any) {
      console.error('Error saving projects header section:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Failed to save projects header configuration'
      })
    }
  }

  // 3. DELETE: Reset header to defaults or delete record
  if (method === 'DELETE') {
    try {
      await requirePermission(event, 'projects', 'delete')
    } catch {
      try {
        await requirePermission(event, 'projects', 'edit')
      } catch {
        await requirePermission(event, 'global_settings', 'edit')
      }
    }

    try {
      const existing = await prisma.page_sections.findFirst({
        where: {
          page_slug: 'projects',
          section_key: 'header'
        }
      })

      if (existing) {
        await prisma.page_sections.delete({
          where: { id: existing.id }
        })
      }

      await clearPublicCache()

      return {
        success: true,
        message: 'Projects page header reset to system defaults',
        exists: false,
        data: {
          id: null,
          title: DEFAULT_HEADER.title,
          content: DEFAULT_HEADER.content,
          subtitle_or_tag: DEFAULT_HEADER.subtitle_or_tag,
          is_active: DEFAULT_HEADER.is_active,
          updated_at: null
        }
      }
    } catch (error: any) {
      console.error('Error resetting projects header section:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Failed to reset projects header configuration'
      })
    }
  }
})
