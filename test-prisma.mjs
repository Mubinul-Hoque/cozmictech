import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const sections = await prisma.page_sections.findMany()
  console.log(sections)
}
main().catch(console.error).finally(() => prisma.$disconnect())
