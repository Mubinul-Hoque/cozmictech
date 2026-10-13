import { invalidateProjectsMetadataCache } from '../api/projects';

export async function clearPublicCache() {
  try {
    invalidateProjectsMetadataCache();
  } catch (e) {
    // Ignore if not loaded
  }

  // Iterate over both 'cache' mount and root storage if available
  const storages = [useStorage('cache'), useStorage()];
  for (const storage of storages) {
    try {
      const keys = await storage.getKeys();
      for (const k of keys) {
        if (
          k.includes('adv-search') ||
          k.includes('projects') ||
          k.includes('homepage') ||
          k.includes('common') ||
          k.includes('blog') ||
          k.includes('about') ||
          k.includes('services') ||
          k.includes('career') ||
          k.includes('message-categories')
        ) {
          await storage.removeItem(k).catch(() => {});
        }
      }
    } catch (err) {
      // Driver may not support getKeys; proceed with explicit key removal
    }
  }

  const rawKeys = [
    'homepage-data:homepage-v2',
    'common-data:common-v1',
    'common-data:common-v2',
    'blog-index:blog-v1',
    'blog-index:blog-v2',
    'about-page:about-v1',
    'about-page:about-v2',
    'services-page:services-v2',
    'services-page:services-v3',
    'career-page:career-v2',
    'adv-search-config:adv-search-config-v2',
    'projects-page:projects-v3',
    'message-categories:message-categories-v1'
  ];

  const variants: string[] = [];
  for (const k of rawKeys) {
    variants.push(
      `${k}.json`,
      `nitro:handlers:${k}.json`,
      `nitro/handlers:${k}.json`,
      `/cache:nitro:handlers:${k}.json`,
      `/cache:nitro/handlers:${k}.json`,
      `cache:nitro:handlers:${k}.json`,
      `cache:nitro/handlers:${k}.json`
    );
  }

  for (const storage of storages) {
    await Promise.all(
      variants.map(v => storage.removeItem(v).catch(() => {}))
    ).catch(() => {});
  }
}
