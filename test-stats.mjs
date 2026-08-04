import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech_v2";
const url = new URL(dbUrl);

const pool = mariadb.createPool({
  host: url.hostname || 'localhost',
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech_v2'),
  connectionLimit: 10
});

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('Fetching projects count...');
  const projectsCount = await prisma.projects.count();
  console.log('projects:', projectsCount);

  console.log('Fetching messages count...');
  const messagesCount = await prisma.messages.count();
  console.log('messages:', messagesCount);

  console.log('Done!');
}
run().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
