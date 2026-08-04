import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech";
const url = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: url.hostname || 'localhost',
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech'),
});

const prisma = new PrismaClient({ adapter });

async function migrateImages() {
  const projects = await prisma.projects.findMany({
    where: {
      images: {
        not: null,
      },
    },
  });

  console.log(`Found ${projects.length} projects with images.`);
  
  for (const p of projects) {
    if (!p.images) continue;
    
    // Skip if it looks like a JSON array already
    if (p.images.startsWith('[') && p.images.endsWith(']')) {
      continue;
    }
    
    const imageArray = p.images.split(',').map(s => s.trim()).filter(Boolean);
    const jsonString = JSON.stringify(imageArray);
    
    await prisma.$executeRawUnsafe(`UPDATE projects SET images = ? WHERE id = ?`, jsonString, p.id);
    console.log(`Updated project ${p.id} images: ${jsonString}`);
  }
  
  console.log("Migration complete.");
}

migrateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
