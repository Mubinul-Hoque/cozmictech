import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const team = await prisma.team_members.findMany({
        orderBy: { id: 'desc' }
      });
      return team;
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch team members' });
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      if (!body.name || !body.designation) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields (name, designation)' });
      }

      const name = String(body.name).trim();
      const designation = String(body.designation).trim();
      const message = String(body.message || '').trim();
      const image = String(body.image || '').trim();
      const fb = String(body.fb || '').trim();
      const insta = String(body.insta || '').trim();
      const linkedin = String(body.linkedin || '').trim();
      const twitter = String(body.twitter || '').trim();

      // Enforce database limits
      if (
        name.length > 100 || designation.length > 100 || message.length > 1000 ||
        image.length > 255 || fb.length > 255 || insta.length > 255 || linkedin.length > 255 || twitter.length > 255
      ) {
        throw createError({ statusCode: 400, statusMessage: 'Input exceeds database length limit' });
      }

      const member = await prisma.team_members.create({
        data: {
          name: sanitizePlainText(name),
          designation: sanitizePlainText(designation),
          message: sanitizePlainText(message),
          image: sanitizePlainText(image),
          facebook_url: fb ? sanitizePlainText(fb) : null,
          instagram_url: insta ? sanitizePlainText(insta) : null,
          linkedin_url: linkedin ? sanitizePlainText(linkedin) : null,
          twitter_url: twitter ? sanitizePlainText(twitter) : null
        }
      });

      await clearPublicCache();
      return { success: true, member };
    } catch (error: any) {
      throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Failed to create team member' });
    }
  }
});
