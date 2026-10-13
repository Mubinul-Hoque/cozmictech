import { prisma } from './prisma';

export const ADV_SEARCH_FILTER_KEYS = ['sector', 'category', 'year', 'status', 'contract_value', 'project_value'] as const;
export type AdvSearchFilterKey = typeof ADV_SEARCH_FILTER_KEYS[number];
export const ADV_SEARCH_SETTING_PREFIX = 'adv_search_filter_';

export async function getAdvancedSearchConfig(): Promise<Record<AdvSearchFilterKey, boolean>> {
  try {
    const rows = await prisma.settings.findMany({
      where: { setting_group: 'adv_search' }
    });
    const map: Record<string, string> = {};
    rows.forEach(r => { map[r.setting_key] = r.setting_value || '1'; });

    const filters = {} as Record<AdvSearchFilterKey, boolean>;
    for (const key of ADV_SEARCH_FILTER_KEYS) {
      filters[key] = map[`${ADV_SEARCH_SETTING_PREFIX}${key}`] !== '0';
    }
    return filters;
  } catch (err) {
    console.error('Error reading advanced search config:', err);
    return {
      sector: true,
      category: true,
      year: true,
      status: true,
      contract_value: true,
      project_value: true
    };
  }
}
