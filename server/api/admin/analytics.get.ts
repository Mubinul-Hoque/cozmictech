import {
  resolveDateRange,
  getTotalVisitors,
  getVisitorTrend,
  getVisitorsByCountry,
  getMostVisitedPages,
  getTopKeywords,
  getTrafficSources,
  getDeviceBreakdown,
  getPopularSectors,
  getPopularCategories,
  type DateRangeKey,
} from '../../utils/analytics';

import { requirePermission } from '../../utils/rbac';

/**
 * GET /api/admin/analytics
 * Protected analytics aggregation endpoint.
 * Query params: range (today|7d|30d|12m|custom), from, to
 */
export default defineEventHandler(async (event) => {
  await requirePermission(event, 'visitor_analytics', 'view');

  const query = getQuery(event);
  const range = ((query.range as string) || '30d') as DateRangeKey;
  const from = query.from as string | undefined;
  const to = query.to as string | undefined;

  const { start, end } = resolveDateRange(range, from, to);

  // Parallel fetch of all analytics dimensions
  const [
    totalVisitors,
    trend,
    byCountry,
    topPages,
    keywords,
    sources,
    devices,
    sectors,
    categories,
  ] = await Promise.all([
    getTotalVisitors(start, end),
    getVisitorTrend(range, start, end),
    getVisitorsByCountry(start, end),
    getMostVisitedPages(start, end),
    getTopKeywords(start, end),
    getTrafficSources(start, end),
    getDeviceBreakdown(start, end),
    getPopularSectors(start, end),
    getPopularCategories(start, end),
  ]);

  return {
    success: true,
    range,
    from: start.toISOString(),
    to: end.toISOString(),
    totalVisitors,
    trend,
    byCountry,
    topPages,
    keywords,
    sources,
    devices,
    sectors,
    categories,
  };
});
