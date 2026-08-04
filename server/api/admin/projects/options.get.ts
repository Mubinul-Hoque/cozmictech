import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const [categories, rawSectors, clients] = await Promise.all([
      prisma.categories.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true }
      }),
      prisma.sectors.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true }
      }),
      prisma.clients.findMany({
        orderBy: { client_name: 'asc' },
        select: { id: true, client_name: true }
      })
    ]);

    const sectors = rawSectors.map(s => ({
      id: s.id,
      sector: s.name
    }));

    return { categories, sectors, clients };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch project options data' });
  }
});
