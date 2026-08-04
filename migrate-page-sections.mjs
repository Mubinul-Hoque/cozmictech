import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech_v2";
const url = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: url.hostname || 'localhost',
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech_v2'),
});

const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('Fetching page_sections...');
  const sections = await prisma.page_sections.findMany();
  
  for (const section of sections) {
    if (section.image) {
      let isJson = false;
      try {
        JSON.parse(section.image);
        isJson = true;
      } catch (e) {}

      if (!isJson) {
        const newImage = JSON.stringify([section.image]);
        await prisma.page_sections.update({
          where: { id: section.id },
          data: { image: newImage }
        });
        console.log(`Updated section ${section.id}: ${section.image} -> ${newImage}`);
      }
    }
  }
  
  console.log('Altering table schema (changing image type)...');
  await prisma.$executeRawUnsafe(`ALTER TABLE page_sections MODIFY COLUMN image LONGTEXT;`);
  
  try {
    console.log('Dropping images_json column...');
    await prisma.$executeRawUnsafe(`ALTER TABLE page_sections DROP COLUMN images_json;`);
    console.log('Dropped images_json column.');
  } catch (e) {
    console.log('Column images_json might not exist or drop failed.', e.message);
  }

  console.log('Migration complete!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
