import { prisma } from './prisma';

// ─── Device Detection ────────────────────────────────────────────────────────

export function detectDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  const uaLower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(uaLower)) return 'tablet';
  if (/mobile|iphone|ipod|blackberry|windows phone|android.*mobile/i.test(uaLower)) return 'mobile';
  return 'desktop';
}

// ─── Traffic Source Classification ──────────────────────────────────────────

export function classifySource(referrer: string | null | undefined, path: string): string {
  if (!referrer || referrer === '') return 'direct';

  try {
    const ref = new URL(referrer);
    const hostname = ref.hostname.replace(/^www\./, '');

    const searchEngines = [
      'google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex', 'ecosia',
      'ask', 'aol', 'startpage', 'brave',
    ];
    if (searchEngines.some(e => hostname.includes(e))) return 'search';

    const socialNetworks = [
      'facebook', 'fb', 'twitter', 'x.com', 't.co', 'instagram',
      'linkedin', 'pinterest', 'tiktok', 'youtube', 'reddit',
      'whatsapp', 'telegram', 'discord', 'snapchat',
    ];
    if (socialNetworks.some(s => hostname.includes(s))) return 'social';

    return 'referral';
  } catch {
    return 'direct';
  }
}

// ─── Keyword Extraction from search referrer ─────────────────────────────────

export function extractKeyword(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.searchParams.get('q') || url.searchParams.get('query') || null;
  } catch {
    return null;
  }
}

// ─── Date Range Helpers ───────────────────────────────────────────────────────

export type DateRangeKey = 'today' | '7d' | '30d' | '12m' | 'custom';

export function resolveDateRange(range: DateRangeKey, from?: string, to?: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (range === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  if (range === '7d') {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  if (range === '30d') {
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  if (range === '12m') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  // custom
  const start = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
  const customEnd = to ? new Date(to) : end;
  customEnd.setHours(23, 59, 59, 999);
  return { start, end: customEnd };
}

// ─── Analytics Query Functions ────────────────────────────────────────────────

export async function getTotalVisitors(start: Date, end: Date): Promise<number> {
  return prisma.page_views.count({
    where: { visited_at: { gte: start, lte: end } },
  });
}

export async function getVisitorTrend(
  range: DateRangeKey,
  start: Date,
  end: Date
): Promise<Array<{ label: string; count: number }>> {
  const views = await prisma.page_views.findMany({
    where: { visited_at: { gte: start, lte: end } },
    select: { visited_at: true },
    orderBy: { visited_at: 'asc' },
  });

  const bucket = new Map<string, number>();

  for (const v of views) {
    let key: string;
    const d = new Date(v.visited_at);

    if (range === 'today') {
      // Group by hour
      key = `${String(d.getHours()).padStart(2, '0')}:00`;
    } else if (range === '12m') {
      // Group by month
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    } else {
      // Group by day
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    bucket.set(key, (bucket.get(key) || 0) + 1);
  }

  return Array.from(bucket.entries()).map(([label, count]) => ({ label, count }));
}

export async function getVisitorsByCountry(
  start: Date,
  end: Date,
  limit = 15
): Promise<Array<{ country_code: string; country_name: string; count: number; percentage: number }>> {
  const results = await prisma.$queryRaw<Array<{ country_code: string; country_name: string; cnt: bigint }>>`
    SELECT country_code, country_name, COUNT(*) as cnt
    FROM page_views
    WHERE visited_at >= ${start} AND visited_at <= ${end}
      AND country_code IS NOT NULL
    GROUP BY country_code, country_name
    ORDER BY cnt DESC
    LIMIT ${limit}
  `;

  const total = results.reduce((sum, r) => sum + Number(r.cnt), 0) || 1;
  return results.map(r => ({
    country_code: r.country_code || 'XX',
    country_name: r.country_name || 'Unknown',
    count: Number(r.cnt),
    percentage: parseFloat(((Number(r.cnt) / total) * 100).toFixed(1)),
  }));
}

export async function getMostVisitedPages(
  start: Date,
  end: Date,
  limit = 10
): Promise<Array<{ page_path: string; page_title: string; count: number }>> {
  const results = await prisma.$queryRaw<Array<{ page_path: string; page_title: string; cnt: bigint }>>`
    SELECT page_path, page_title, COUNT(*) as cnt
    FROM page_views
    WHERE visited_at >= ${start} AND visited_at <= ${end}
    GROUP BY page_path, page_title
    ORDER BY cnt DESC
    LIMIT ${limit}
  `;
  return results.map(r => ({
    page_path: r.page_path,
    page_title: r.page_title || r.page_path,
    count: Number(r.cnt),
  }));
}

export async function getTopKeywords(
  start: Date,
  end: Date,
  limit = 10
): Promise<Array<{ keyword: string; count: number }>> {
  const results = await prisma.$queryRaw<Array<{ keyword: string; cnt: bigint }>>`
    SELECT keyword, COUNT(*) as cnt
    FROM page_views
    WHERE visited_at >= ${start} AND visited_at <= ${end}
      AND keyword IS NOT NULL AND keyword != ''
    GROUP BY keyword
    ORDER BY cnt DESC
    LIMIT ${limit}
  `;
  return results.map(r => ({ keyword: r.keyword, count: Number(r.cnt) }));
}

export async function getTrafficSources(
  start: Date,
  end: Date
): Promise<Array<{ source: string; count: number; percentage: number }>> {
  const results = await prisma.$queryRaw<Array<{ source: string; cnt: bigint }>>`
    SELECT COALESCE(source, 'direct') as source, COUNT(*) as cnt
    FROM page_views
    WHERE visited_at >= ${start} AND visited_at <= ${end}
    GROUP BY source
    ORDER BY cnt DESC
  `;
  const total = results.reduce((sum, r) => sum + Number(r.cnt), 0) || 1;
  return results.map(r => ({
    source: r.source || 'direct',
    count: Number(r.cnt),
    percentage: parseFloat(((Number(r.cnt) / total) * 100).toFixed(1)),
  }));
}

export async function getDeviceBreakdown(
  start: Date,
  end: Date
): Promise<Array<{ device_type: string; count: number; percentage: number }>> {
  const results = await prisma.$queryRaw<Array<{ device_type: string; cnt: bigint }>>`
    SELECT COALESCE(device_type, 'desktop') as device_type, COUNT(*) as cnt
    FROM page_views
    WHERE visited_at >= ${start} AND visited_at <= ${end}
    GROUP BY device_type
    ORDER BY cnt DESC
  `;
  const total = results.reduce((sum, r) => sum + Number(r.cnt), 0) || 1;
  return results.map(r => ({
    device_type: r.device_type || 'desktop',
    count: Number(r.cnt),
    percentage: parseFloat(((Number(r.cnt) / total) * 100).toFixed(1)),
  }));
}

export async function getPopularSectors(
  start: Date,
  end: Date,
  limit = 8
): Promise<Array<{ name: string; count: number }>> {
  const results = await prisma.$queryRaw<Array<{ name: string; cnt: bigint }>>`
    SELECT s.name, COUNT(pv.id) as cnt
    FROM page_views pv
    JOIN sectors s ON pv.sector_id = s.id
    WHERE pv.visited_at >= ${start} AND pv.visited_at <= ${end}
    GROUP BY s.id, s.name
    ORDER BY cnt DESC
    LIMIT ${limit}
  `;
  return results.map(r => ({ name: r.name, count: Number(r.cnt) }));
}

export async function getPopularCategories(
  start: Date,
  end: Date,
  limit = 8
): Promise<Array<{ name: string; count: number }>> {
  const results = await prisma.$queryRaw<Array<{ name: string; cnt: bigint }>>`
    SELECT c.name, COUNT(pv.id) as cnt
    FROM page_views pv
    JOIN categories c ON pv.category_id = c.id
    WHERE pv.visited_at >= ${start} AND pv.visited_at <= ${end}
    GROUP BY c.id, c.name
    ORDER BY cnt DESC
    LIMIT ${limit}
  `;
  return results.map(r => ({ name: r.name, count: Number(r.cnt) }));
}
