/**
 * useAnalytics — Client-side page view tracker.
 * Call trackPageView() on every route change from the app plugin or a layout.
 * Sends data to /api/analytics/track (fire-and-forget, never blocks navigation).
 */
export const useAnalytics = () => {
  const router = useRouter();

  const trackPageView = async (options?: {
    sectorId?: number | null;
    categoryId?: number | null;
    projectId?: number | null;
  }) => {
    if (typeof window === 'undefined') return;

    // Don't track admin or API pages
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/api')) return;

    try {
      await $fetch('/api/analytics/track', {
        method: 'POST',
        body: {
          page_path: path,
          page_title: document.title || '',
          referrer: document.referrer || '',
          sector_id: options?.sectorId ?? null,
          category_id: options?.categoryId ?? null,
          project_id: options?.projectId ?? null,
        },
      });
    } catch {
      // Silent — analytics must never affect user experience
    }
  };

  return { trackPageView };
};
