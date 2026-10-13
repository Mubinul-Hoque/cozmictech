import { getAdvancedSearchConfig } from '../utils/searchConfig';

export default defineEventHandler(async (event) => {
  // Prevent any browser or intermediary caching of dynamic settings
  setResponseHeaders(event, {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const filters = await getAdvancedSearchConfig();
  return { filters };
});
