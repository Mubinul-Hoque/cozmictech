import { prisma } from '../../utils/prisma';
import { clearPublicCache } from '../../utils/cache';
import { requirePermission } from '../../utils/rbac';

// The 6 filter keys stored in settings with group = 'adv_search'
const FILTER_KEYS = ['sector', 'category', 'year', 'status', 'contract_value', 'project_value'] as const;
const SETTING_PREFIX = 'adv_search_filter_';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    await requirePermission(event, 'advanced_search', 'view');
    try {
      const rows = await prisma.settings.findMany({
        where: { setting_group: 'adv_search' }
      });
      const map: Record<string, string> = {};
      rows.forEach(r => { map[r.setting_key] = r.setting_value || '1'; });

      const filters: Record<string, boolean> = {};
      for (const key of FILTER_KEYS) {
        filters[key] = map[`${SETTING_PREFIX}${key}`] !== '0'; // default ON
      }
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

      for (const key of FILTER_KEYS) {
        const val = filters[key] === false ? '0' : '1';
        await prisma.settings.upsert({
          where: { setting_key: `${SETTING_PREFIX}${key}` },
          update: { setting_value: val, setting_group: 'adv_search', updated_at: new Date() },
          create: { setting_key: `${SETTING_PREFIX}${key}`, setting_group: 'adv_search', setting_value: val }
        });
      }
      await clearPublicCache();
      return { success: true };
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to save advanced search config' });
    }
  }
});
