// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon', 'nuxt-security'],
  css: ['~/assets/css/main.css'],

  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        'img-src': ["'self'", "data:", "blob:", "https:"],
        'font-src': ["'self'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
        'connect-src': ["'self'", "https:"],
        'frame-src': ["'self'", "https://www.google.com", "https://maps.google.com"],
        'frame-ancestors': ["'none'"]
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: ['()'],
        microphone: ['()'],
        geolocation: ['()']
      }
    },
    rateLimiter: process.env.NODE_ENV === 'development' ? false : {
      tokensPerInterval: 300,
      interval: 300000,
      throwError: true
    }
  },
  
  // Image configuration
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpeg', 'jpg', 'png']
  },

  nitro: {
    compressPublicAssets: true
  },

  routeRules: {
    '/admin/typography': { redirect: { to: '/admin/settings?tab=typography', statusCode: 302 } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/api/homepage': { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' } },
    '/api/common': { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } },
    '/api/blog': { headers: { 'cache-control': 'public, max-age=180, stale-while-revalidate=300' } },
    '/api/services': { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' } },
    '/api/about': { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' } },
    '/api/advanced-search-config': { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' } },
    '/api/career/**': { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' } },
    '/api/projects': { headers: { 'cache-control': 'public, max-age=30, stale-while-revalidate=60' } },
    '/api/projects/**': { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=120' } },
    '/api/blog/**': { headers: { 'cache-control': 'public, max-age=180, stale-while-revalidate=300' } },
    '/api/messages/categories': { headers: { 'cache-control': 'public, max-age=600, stale-while-revalidate=1200' } }
  },

  app: {
    head: {
      title: 'Cozmic Technology - Engineering Consultancy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Cozmic Technology — Premier Engineering Consultancy specializing in Geotechnical Investigation, Architecture, and Construction Project Management.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/assets/img/favicon.svg' },

        // Bootstrap Icons completely removed in favor of @nuxt/icon

        // Preconnect first, then non-render-blocking stylesheet load
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap',
          media: 'print',
          onload: "this.media='all'"
        }
      ]
    }
  }
})
