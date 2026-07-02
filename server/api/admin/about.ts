import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const about = await prisma.about_us.findFirst()
      return {
        success: true,
        about: about || {
          tagline: 'Cozmic Technology - About Us',
          est: '2015',
          happy_icon: 'bi bi-emoji-smile',
          happy_client: 120,
          projects_icon: 'bi bi-journal-richtext',
          project_nos: 250,
          support_icon: 'bi bi-headset',
          hrs_support: 1740,
          emp_icon: 'bi bi-people',
          emp_nos: 35,
          story_title: 'Our Story',
          story_body: '',
          story_body2: '',
          mission_title: 'OUR MISSION',
          mission_body: '',
          vision_title: 'OUR VISION',
          vision_body: '',
          values_title: 'OUR VALUES',
          values_body: 0,
          team_title: 'Our Team',
          team_description: ''
        }
      }
    } catch (error: any) {
      console.error('Error fetching admin about config:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch about config' })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const existing = await prisma.about_us.findFirst()
      
      const safeSanitize = (val: any) => {
        if (val === undefined || val === null) return '';
        return sanitizePlainText(String(val));
      }

      const tagline = safeSanitize(body.tagline);
      const est = safeSanitize(body.est);
      const happy_icon = safeSanitize(body.happy_icon || 'bi-emoji-smile');
      const projects_icon = safeSanitize(body.projects_icon || 'bi-journal-richtext');
      const support_icon = safeSanitize(body.support_icon || 'bi-headset');
      const emp_icon = safeSanitize(body.emp_icon || 'bi-people');
      const story_title = safeSanitize(body.story_title);
      const story_body2 = safeSanitize(body.story_body2);
      const mission_title = safeSanitize(body.mission_title);
      const vision_title = safeSanitize(body.vision_title);
      const values_title = safeSanitize(body.values_title);
      const team_title = safeSanitize(body.team_title);
      const team_description = safeSanitize(body.team_description);

      // Validate lengths matching the database schema
      if (
        tagline.length > 255 || est.length > 15 || happy_icon.length > 30 ||
        projects_icon.length > 30 || support_icon.length > 30 || emp_icon.length > 30 ||
        story_title.length > 50 || story_body2.length > 255 || mission_title.length > 50 ||
        vision_title.length > 50 || values_title.length > 50 || team_title.length > 50 ||
        team_description.length > 500
      ) {
        throw createError({ statusCode: 400, statusMessage: 'Input exceeds database length limit' });
      }

      const data = {
        tagline,
        est,
        happy_icon,
        happy_client: body.happy_client ? parseInt(body.happy_client) : 0,
        projects_icon,
        project_nos: body.project_nos ? parseInt(body.project_nos) : 0,
        support_icon,
        hrs_support: body.hrs_support ? parseInt(body.hrs_support) : 0,
        emp_icon,
        emp_nos: body.emp_nos ? parseInt(body.emp_nos) : 0,
        story_title,
        story_body: sanitizeHtmlContent(body.story_body || ''),
        story_body2,
        mission_title,
        mission_body: sanitizeHtmlContent(body.mission_body || ''),
        vision_title,
        vision_body: sanitizeHtmlContent(body.vision_body || ''),
        values_title,
        values_body: body.values_body ? parseInt(body.values_body) : 0,
        team_title,
        team_description
      }

      if (existing) {
        await prisma.about_us.update({
          where: { id: existing.id },
          data
        })
      } else {
        await prisma.about_us.create({
          data
        })
      }

      return {
        success: true,
        message: 'About Us page saved successfully'
      }
    } catch (error: any) {
      console.error('Error saving admin about config:', error)
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to save about config' })
    }
  }
})
