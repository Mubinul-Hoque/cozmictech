import { prisma } from '../utils/prisma';

const FILTER_KEYS = ['sector', 'category', 'year', 'status', 'contract_value', 'project_value'] as const;
const SETTING_PREFIX = 'adv_search_filter_';

export default defineCachedEventHandler(async () => {
  try {
    const rows = await prisma.settings.findMany({
      where: { setting_group: 'adv_search' }
    });
    const map: Record<string, string> = {};
    rows.forEach(r => { map[r.setting_key] = r.setting_value || '1'; });

    const filters: Record<string, boolean> = {};
    for (const key of FILTER_KEYS) {
      filters[key] = map[`${SETTING_PREFIX}${key}`] !== '0';
    }
    return { filters };
  } catch (error) {
    return {
      filters: {
        sector: true,
        category: true,
        year: true,
        status: true,
        contract_value: true,
        project_value: true
      }
    };
  }
}, {
  maxAge: 60 * 10, // 10-minute TTL
  name: 'adv-search-config',
  getKey: () => 'adv-search-config-v2'
});
