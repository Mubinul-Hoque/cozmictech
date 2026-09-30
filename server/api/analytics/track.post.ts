import { prisma } from '../../utils/prisma';
import {
  detectDeviceType,
  classifySource,
  extractKeyword,
} from '../../utils/analytics';

/**
 * POST /api/analytics/track
 * Receives tracking events from the client side and stores them.
 * No personal data (IP hash only), no cookies set.
 */
export default defineEventHandler(async (event) => {
  // Only accept POST
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  try {
    const body = await readBody(event);
    const {
      page_path,
      page_title,
      referrer,
      sector_id,
      category_id,
      project_id,
    } = body || {};

    if (!page_path) {
      throw createError({ statusCode: 400, statusMessage: 'page_path is required' });
    }

    // Skip admin and API routes
    if (
      page_path.startsWith('/admin') ||
      page_path.startsWith('/api') ||
      page_path.includes('__nuxt') ||
      page_path.includes('_nuxt')
    ) {
      return { success: true, tracked: false };
    }

    const ua = getRequestHeader(event, 'user-agent') || '';
    const deviceType = detectDeviceType(ua);
    const source = classifySource(referrer || '', page_path);
    const keyword = source === 'search' ? extractKeyword(referrer) : null;

    // Geo-location via free IP API (no sign-up, no stored IP)
    // We pass the client IP only to the geo lookup service, and store only country name/code
    let country_code: string | null = null;
    let country_name: string | null = null;

    try {
      const clientIp = getRequestIP(event, { xForwardedFor: true });
      if (clientIp && clientIp !== '127.0.0.1' && clientIp !== '::1') {
        const geoRes = await $fetch<{ country_code2?: string; country_name?: string }>(
          `https://api.iplocation.net/?ip=${clientIp}`,
          { timeout: 2000 }
        ).catch(() => null);

        if (geoRes?.country_code2 && geoRes.country_code2 !== '-') {
          country_code = geoRes.country_code2;
          country_name = geoRes.country_name || null;
        }
      }
    } catch {
      // Geo lookup is best-effort; silently fail
    }

    await prisma.page_views.create({
      data: {
        page_path: String(page_path).slice(0, 500),
        page_title: page_title ? String(page_title).slice(0, 255) : null,
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        country_code,
        country_name,
        device_type: deviceType,
        source,
        keyword: keyword ? String(keyword).slice(0, 255) : null,
        sector_id: sector_id ? Number(sector_id) : null,
        category_id: category_id ? Number(category_id) : null,
        project_id: project_id ? Number(project_id) : null,
      },
    });

    return { success: true, tracked: true };
  } catch (err: any) {
    // Don't crash the page if tracking fails
    console.error('[Analytics] Track error:', err?.message || err);
    return { success: false };
  }
});
