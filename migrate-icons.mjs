import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/cozmictech";
const url = new URL(dbUrl);
const adapter = new PrismaMariaDb({
  host: url.hostname || 'localhost',
  port: url.port ? parseInt(url.port) : 3306,
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'cozmictech'),
})

const prisma = new PrismaClient({ adapter })

const iconMap = {
  'bi-building': 'lucide:building-2',
  'bi-check-circle': 'lucide:check-circle-2',
  'bi-activity': 'lucide:activity',
  'bi-gear': 'lucide:settings',
  'bi-people': 'lucide:users',
  'bi-envelope': 'lucide:mail',
  'bi-briefcase': 'lucide:briefcase',
  'bi-house': 'lucide:home',
  'bi-globe': 'lucide:globe',
  'bi-tools': 'lucide:wrench',
  'bi-wrench': 'lucide:wrench'
};

function mapIcon(oldIcon) {
  if (!oldIcon) return null;
  let cleanIcon = oldIcon.trim().replace(/^bi\s+/, '');
  if (iconMap[cleanIcon]) return iconMap[cleanIcon];
  if (cleanIcon.startsWith('bi-')) return 'lucide:' + cleanIcon.replace('bi-', '');
  return oldIcon;
}

async function migrate() {
  const services = await prisma.services.findMany();
  for (const s of services) {
    if (s.icon) {
      const newIcon = mapIcon(s.icon);
      if (newIcon !== s.icon) await prisma.services.update({ where: { id: s.id }, data: { icon: newIcon } });
    }
  }

  const strengths = await prisma.strength.findMany();
  for (const s of strengths) {
    if (s.icon) {
      const newIcon = mapIcon(s.icon);
      if (newIcon !== s.icon) await prisma.strength.update({ where: { id: s.id }, data: { icon: newIcon } });
    }
  }

  const aboutUs = await prisma.about_us.findMany();
  for (const s of aboutUs) {
    const data = {};
    if (s.feature1_icon && mapIcon(s.feature1_icon) !== s.feature1_icon) data.feature1_icon = mapIcon(s.feature1_icon);
    if (s.feature2_icon && mapIcon(s.feature2_icon) !== s.feature2_icon) data.feature2_icon = mapIcon(s.feature2_icon);
    if (s.feature3_icon && mapIcon(s.feature3_icon) !== s.feature3_icon) data.feature3_icon = mapIcon(s.feature3_icon);
    if (s.feature4_icon && mapIcon(s.feature4_icon) !== s.feature4_icon) data.feature4_icon = mapIcon(s.feature4_icon);
    if (Object.keys(data).length > 0) {
      await prisma.about_us.update({ where: { id: s.id }, data });
    }
  }

  const homepages = await prisma.homepage.findMany();
  for (const s of homepages) {
    if (s.feature_icon) {
      const newIcon = mapIcon(s.feature_icon);
      if (newIcon !== s.feature_icon) await prisma.homepage.update({ where: { id: s.id }, data: { feature_icon: newIcon } });
    }
  }

  console.log('Migration complete!');
}

migrate().catch(console.error).finally(() => prisma.$disconnect());
