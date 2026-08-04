import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Fetching projects...');
  const projectsCount = await prisma.projects.count();
  console.log('projects:', projectsCount);
  console.log('Done!');
}
run().catch(console.error).finally(() => prisma.$disconnect());
