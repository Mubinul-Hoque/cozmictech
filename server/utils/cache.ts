import { invalidateProjectsMetadataCache } from '../api/projects';

export async function clearPublicCache() {
  try {
    invalidateProjectsMetadataCache();
  } catch (e) {
    // Ignore if not loaded
  }

  const cache = useStorage('cache');
  const keysToRemove = [
    'nitro:handlers:homepage-data:homepage-v2.json',
    'nitro:handlers:common-data:common-v1.json',
    'nitro:handlers:common-data:common-v2.json',
    'nitro:handlers:blog-index:blog-v1.json',
    'nitro:handlers:blog-index:blog-v2.json',
    'nitro:handlers:about-page:about-v1.json',
    'nitro:handlers:about-page:about-v2.json',
    'nitro:handlers:services-page:services-v2.json',
    'nitro:handlers:career-page:career-v2.json',
    'nitro:handlers:adv-search-config:adv-search-config-v2.json',
    'nitro:handlers:projects-page:projects-v3.json'
  ];

  await Promise.all(
    keysToRemove.map(k => cache.removeItem(k).catch(() => {}))
  ).catch(err => {
    console.error('Failed to clear public caches:', err);
  });
}
