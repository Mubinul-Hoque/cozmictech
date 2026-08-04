import { prisma } from '../utils/prisma'

const iconMap: Record<string, string> = {
  'mountain-city': 'lucide:building-2',
  'compass-drafting': 'lucide:compass',
  'helmet-safety': 'lucide:hard-hat',
  'trowel-bricks': 'lucide:hammer',
  'ruler': 'lucide:ruler',
  'arrow-up-from-ground-water': 'lucide:droplets',
  'building': 'lucide:building-2',
  'check-circle': 'lucide:check-circle-2',
  'activity': 'lucide:activity',
  'gear': 'lucide:settings',
  'people': 'lucide:users',
  'people-fill': 'lucide:users',
  'person-fill-gear': 'lucide:user-cog',
  'tools': 'lucide:wrench',
  'incognito': 'lucide:user-round-search',
  'envelope': 'lucide:mail',
  'briefcase': 'lucide:briefcase',
  'house': 'lucide:home',
  'globe': 'lucide:globe',
  'wrench': 'lucide:wrench'
};

function mapIcon(oldIcon: string | null) {
  if (!oldIcon) return null;
  
  let cleanIcon = oldIcon.trim()
    .replace(/^bi\s+/, '')
    .replace(/^fa-solid\s+fa-/, '')
    .replace(/^fa-brands\s+fa-/, '')
    .replace(/^fa-regular\s+fa-/, '')
    .replace(/^fa\s+fa-/, '')
    .replace(/^fa-/, '')
    .replace(/^bi-/, '');
    
  if (iconMap[cleanIcon]) return iconMap[cleanIcon];
  
  return 'lucide:' + cleanIcon;
}

export default defineEventHandler(async () => {
  const logs = [];
  
  if (prisma.services) {
    const services = await prisma.services.findMany();
    for (const s of services) {
      if (s.icon && !s.icon.startsWith('lucide:')) {
        const newIcon = mapIcon(s.icon);
        await prisma.services.update({ where: { id: s.id }, data: { icon: newIcon as string } });
        logs.push(`Updated Service ${s.id} icon from ${s.icon} to ${newIcon}`);
      }
    }
  }

  // FIXED: It's prisma.strengths, not prisma.strengths
  if (prisma.strengths) {
    const strengths = await prisma.strengths.findMany();
    for (const s of strengths) {
      if (s.icon && !s.icon.startsWith('lucide:')) {
        const newIcon = mapIcon(s.icon);
        await prisma.strengths.update({ where: { id: s.id }, data: { icon: newIcon as string } });
        logs.push(`Updated Strength ${s.id} icon from ${s.icon} to ${newIcon}`);
      }
    }
  }
  
  const aboutUsModel = prisma.about_us || prisma.aboutUs;
  if (aboutUsModel) {
    const aboutUs = await aboutUsModel.findMany();
    for (const s of aboutUs) {
      const data: any = {};
      if (s.feature1_icon && !s.feature1_icon.startsWith('lucide:')) data.feature1_icon = mapIcon(s.feature1_icon);
      if (s.feature2_icon && !s.feature2_icon.startsWith('lucide:')) data.feature2_icon = mapIcon(s.feature2_icon);
      if (s.feature3_icon && !s.feature3_icon.startsWith('lucide:')) data.feature3_icon = mapIcon(s.feature3_icon);
      if (s.feature4_icon && !s.feature4_icon.startsWith('lucide:')) data.feature4_icon = mapIcon(s.feature4_icon);
      if (Object.keys(data).length > 0) {
        await aboutUsModel.update({ where: { id: s.id }, data });
        logs.push(`Updated About Us ${s.id} icons`);
      }
    }
  }

  const homepageModel = prisma.homepage || prisma.homePage || prisma.homepages;
  if (homepageModel) {
    const homepages = await homepageModel.findMany();
    for (const s of homepages) {
      if (s.feature_icon && !s.feature_icon.startsWith('lucide:')) {
        const newIcon = mapIcon(s.feature_icon);
        await homepageModel.update({ where: { id: s.id }, data: { feature_icon: newIcon as string } });
        logs.push(`Updated Homepage ${s.id} icon from ${s.feature_icon} to ${newIcon}`);
      }
    }
  }

  return { success: true, logs };
});
