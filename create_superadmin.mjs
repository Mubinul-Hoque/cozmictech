import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "mysql://root:@127.0.0.1:3306/cozmictech_v2";
const url = new URL(dbUrl);
const hostname = url.hostname === 'localhost' ? '127.0.0.1' : (url.hostname || '127.0.0.1');
const adapter = new PrismaMariaDb({
  host: hostname,
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech_v2'),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'mubinulhq@gmail.com';
  const hashedPassword = await bcrypt.hash('s.admin123##', 10);

  const existing = await prisma.users.findFirst({ where: { email } });
  if (existing) {
    const updated = await prisma.users.update({
      where: { id: existing.id },
      data: {
        username: existing.username || 'Mubinul Hoque',
        password: hashedPassword,
        role: 'SuperAdmin',
        updated_at: new Date()
      }
    });
    console.log(`Super Admin user updated successfully! ID: ${updated.id}, Email: ${updated.email}, Role: ${updated.role}`);
  } else {
    const created = await prisma.users.create({
      data: {
        username: 'Mubinul Hoque',
        email,
        password: hashedPassword,
        role: 'SuperAdmin',
      }
    });
    console.log(`Super Admin user created successfully! ID: ${created.id}, Email: ${created.email}, Role: ${created.role}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

