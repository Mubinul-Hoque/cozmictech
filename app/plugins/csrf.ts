/**
 * P18 — CSRF Token Plugin (fixed)
 * 
 * Uses Nuxt's native $fetch interceptor via useRequestFetch / addFetchInterceptor
 * to correctly inject the CSRF token on all mutating requests, including those
 * made by useFetch() composable (not just direct $fetch calls).
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const csrfToken = useState<string | null>('csrfToken', () => null)

  // Fetch CSRF token once on client startup
  if (import.meta.client && !csrfToken.value) {
    try {
      const response = await $fetch<{ csrfToken: string }>('/api/auth/csrf')
      csrfToken.value = response.csrfToken
    } catch (error) {
      console.error('[CSRF] Failed to initialize CSRF token:', error)
    }
  }

  // Create an intercepted fetch instance
  const origFetch = nuxtApp.$fetch || globalThis.$fetch
  const interceptedFetch = origFetch.create({
    onRequest ({ options }) {
      const method = (options.method as string)?.toUpperCase()
      const isStateMutation = method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      if (isStateMutation && csrfToken.value) {
        options.headers = new Headers(options.headers as HeadersInit || {})
        options.headers.set('X-CSRF-Token', csrfToken.value)
      }
    },
    onResponseError ({ request, response }) {
      if (response?.status === 401 && String(request).includes('/api/admin')) {
        const authUser = useState('authUser')
        authUser.value = null
        if (import.meta.client && typeof window !== 'undefined') {
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login?reason=timeout'
          }
        }
      }
    }
  })

  // Forcibly overwrite all references to $fetch in the Nuxt app
  nuxtApp.$fetch = interceptedFetch
  if (import.meta.client) {
    globalThis.$fetch = interceptedFetch
  }
})
