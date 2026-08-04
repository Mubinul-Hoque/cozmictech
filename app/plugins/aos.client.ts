import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    AOS.init({
      duration: 800,          // slightly faster for snappier feel
      easing: 'ease-in-out',
      once: true,             // only animate once (no re-trigger on scroll back)
      mirror: false,
      // P22 — Use offset so elements are not hidden when JS is slow to load.
      // A 60px offset means the animation only starts after element is well in viewport,
      // reducing the chance of a flash of hidden content causing CLS.
      offset: 60,
      // disable on mobile/reduced-motion for accessibility
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    })
  })
})
