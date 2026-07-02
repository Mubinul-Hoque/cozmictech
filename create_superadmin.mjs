import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

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

async function main() {
  const email = 'mubinulhq@gmail.com';
  const hashedPassword = await bcrypt.hash('s.admin123##', 10);

  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        username: 'Mubinul Hoque',
        password: hashedPassword,
        role: 'SuperAdmin'
      }
    });
    console.log('Super Admin user updated successfully! You can now log in.');
  } else {
    await prisma.user.create({
      data: {
        username: 'Mubinul Hoque',
        email,
        password: hashedPassword,
        role: 'SuperAdmin',
      }
    });
    console.log('Super Admin user created successfully! You can now log in.');
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
