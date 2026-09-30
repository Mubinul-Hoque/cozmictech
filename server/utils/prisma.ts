import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

let prisma: PrismaClient

const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech_v2";

// Parse MySQL/MariaDB connection URL dynamically
const url = new URL(dbUrl);
const hostname = url.hostname === 'localhost' ? '127.0.0.1' : (url.hostname || '127.0.0.1');

const sslParam = url.searchParams.get('ssl') || url.searchParams.get('sslaccept') || url.searchParams.get('sslmode');
const isRemote = hostname !== '127.0.0.1' && hostname !== 'localhost';
const ssl = (sslParam === 'true' || sslParam === 'strict' || sslParam === 'require' || sslParam === '1' || (isRemote && url.search.includes('ssl')))
  ? { rejectUnauthorized: false }
  : undefined;

const poolConfig: any = {
  host: hostname,
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech_v2'),
};

if (ssl) {
  poolConfig.ssl = ssl;
}

const adapter = new PrismaMariaDb(poolConfig)

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  // Prevent multiple instantiations of Prisma Client in development
  const g = globalThis as any
  if (!g.prisma_new) {
    g.prisma_new = new PrismaClient({ adapter })
  }
  prisma = g.prisma_new
}

export { prisma }
