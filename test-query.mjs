import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech";
const url = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: url.hostname || "localhost",
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || "root"),
  password: decodeURIComponent(url.password || ""),
  database: decodeURIComponent(url.pathname.replace(/^\//, "") || "cozmictech")
});
const prisma = new PrismaClient({ adapter });
prisma.services.findMany().then(d => {
  console.log(d.map(s => ({id: s.id, icon: s.icon})));
  prisma.$disconnect();
}).catch(e => console.error(e));
