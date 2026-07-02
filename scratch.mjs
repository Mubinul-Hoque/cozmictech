import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'cozmictech'
})
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    console.log('Testing Prisma FindFirst...')
    const homepage = await prisma.homepage.findFirst()
    console.log('FindFirst Success:', homepage)
    
    console.log('Testing Prisma Update...')
    const updated = await prisma.homepage.update({
      where: { id: 1 },
      data: {
        theme: 'theme-ocean'
      }
    })
    console.log('Update Success:', updated)
  } catch (err) {
    console.error('Prisma Error:', err)
  } finally {
    await prisma.$disconnect()
  }
}
main()
