import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

let prisma: PrismaClient

const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech";

// Parse MySQL/MariaDB connection URL dynamically
const url = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: url.hostname || 'localhost',
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech'),
})

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  // Prevent multiple instantiations of Prisma Client in development
  const g = globalThis as any
  if (!g.prisma) {
    g.prisma = new PrismaClient({ adapter })
  }
  prisma = g.prisma
}

export { prisma }
