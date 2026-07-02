import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const [categories, sectors] = await Promise.all([
      prisma.category.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true }
      }),
      prisma.sectors.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, sector: true }
      })
    ]);
    return { categories, sectors };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch project options data' });
  }
});
