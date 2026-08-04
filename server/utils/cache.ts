export async function clearPublicCache() {
  const cache = useStorage('cache');
  await Promise.all([
    cache.removeItem('nitro:handlers:homepage-data:homepage-v2.json'),
    cache.removeItem('nitro:handlers:common-data:common-v1.json'),
    cache.removeItem('nitro:handlers:blog-index:blog-v1.json'),
    cache.removeItem('nitro:handlers:about-page:about-v1.json'),
    cache.removeItem('nitro:handlers:projects-page:projects-v3.json')
  ]).catch(err => {
    console.error('Failed to clear public caches:', err);
  });
}
