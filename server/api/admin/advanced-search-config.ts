import { prisma } from '../../utils/prisma';
import { clearPublicCache } from '../../utils/cache';
import { requirePermission } from '../../utils/rbac';
import { ADV_SEARCH_FILTER_KEYS, ADV_SEARCH_SETTING_PREFIX, getAdvancedSearchConfig } from '../../utils/searchConfig';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    await requirePermission(event, 'advanced_search', 'view');
    try {
      const filters = await getAdvancedSearchConfig();
      return { filters };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load advanced search config' });
    }
  }

  if (method === 'POST') {
    await requirePermission(event, 'advanced_search', 'manage_settings');
    try {
      const body = await readBody(event);
      const filters = body?.filters ?? {};

      for (const key of ADV_SEARCH_FILTER_KEYS) {
        const val = filters[key] === false ? '0' : '1';
        await prisma.settings.upsert({
          where: { setting_key: `${ADV_SEARCH_SETTING_PREFIX}${key}` },
          update: { setting_value: val, setting_group: 'adv_search', updated_at: new Date() },
          create: { setting_key: `${ADV_SEARCH_SETTING_PREFIX}${key}`, setting_group: 'adv_search', setting_value: val }
        });
      }
      await clearPublicCache();
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to save advanced search config' });
    }
  }
});
