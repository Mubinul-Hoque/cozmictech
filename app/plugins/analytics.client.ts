/**
 * Analytics Plugin — auto-tracks every public page navigation.
 * Runs client-side only, fires after each route commit.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  const router = useRouter();
  const { trackPageView } = useAnalytics();

  // Track initial page load (after hydration)
  nuxtApp.hook('app:mounted', () => {
    // Small delay so document.title is populated
    setTimeout(() => trackPageView(), 300);
  });

  // Track subsequent navigations
  router.afterEach((_to, _from) => {
    setTimeout(() => trackPageView(), 300);
  });
});
