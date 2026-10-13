<template>
  <div>
    <!-- ======= Preloader ======= -->
    <div id="preloader" :class="{ 'preloader-deactivated': !loading }"></div>

    <!-- ======= Header ======= -->
    <header id="header" class="header flex items-center" :class="{ 'sticked': scrolled, 'header-light': isLightHeader && !scrolled }">
      <div class="container mx-auto px-4 lg:px-8 flex items-center justify-between w-full">
        
        <NuxtLink to="/" class="logo flex items-center">
          <img v-if="data?.homepage?.logo" :src="`/assets/img/${data.homepage.logo}`" alt="Logo" class="max-h-12 mr-2" />
          <h1 v-else>{{ data?.homepage?.company_title || 'Cozmic Technology' }}<span>.</span></h1>
        </NuxtLink>

        <!-- Mobile Nav Toggles -->
        <i 
          class="mobile-nav-toggle mobile-nav-show" 
          :class="{ 'hidden': mobileNavOpen }"
          @click="toggleMobileNav"
        ></i>
        <i 
          class="mobile-nav-toggle mobile-nav-hide" 
          :class="{ 'hidden': !mobileNavOpen }"
          @click="toggleMobileNav"
        ></i>

        <!-- Navbar Menu -->
        <nav id="navbar" class="navbar">
          <ul>
            <li>
              <NuxtLink to="/" active-class="active" @click="closeMobileNav">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" active-class="active" @click="closeMobileNav">About</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/services" active-class="active" @click="closeMobileNav">Services</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/projects" active-class="active" @click="closeMobileNav">Projects</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" active-class="active" @click="closeMobileNav">Blog</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/career" active-class="active" @click="closeMobileNav">Careers</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" active-class="active" @click="closeMobileNav">Contact</NuxtLink>
            </li>
          </ul>
        </nav>

      </div>
    </header>

    <!-- Main Content Slot -->
    <main class="min-h-[70vh]">
      <slot />
    </main>

    <!-- ======= Modern Minimal Footer ======= -->
    <footer id="footer" class="footer bg-[#090402] text-neutral-300 border-t border-neutral-800/80 pt-16 sm:pt-20 pb-12 sm:pb-14 transition-colors">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <!-- Main Footer Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 sm:pb-16 border-b border-neutral-900">
          
          <!-- Column 1: Brand & Identity (Span 4) -->
          <div class="lg:col-span-4 space-y-4">
            <h3 class="font-display text-2xl sm:text-[26px] font-normal text-white tracking-tight leading-snug">
              {{ data?.homepage?.company_title || 'Cozmic Technology' }}
            </h3>
            <p class="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              A multidisciplinary engineering consultancy providing geotechnical, structural, architectural, and project management services across Bangladesh.
            </p>
            
            <!-- Social Profiles (Minimal outline circles) -->
            <div class="flex items-center gap-2 pt-1">
              <a 
                :href="data?.social?.fb || '#'" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                class="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#feb900] hover:border-[#feb900] transition-colors duration-200"
              >
                <Icon name="lucide:facebook" class="w-3.5 h-3.5" />
              </a>
              <a 
                :href="data?.social?.insta || '#'" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                class="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#feb900] hover:border-[#feb900] transition-colors duration-200"
              >
                <Icon name="lucide:instagram" class="w-3.5 h-3.5" />
              </a>
              <a 
                :href="data?.social?.linkedin || '#'" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                class="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#feb900] hover:border-[#feb900] transition-colors duration-200"
              >
                <Icon name="lucide:linkedin" class="w-3.5 h-3.5" />
              </a>
              <a 
                v-if="data?.social?.twitter && data?.social?.twitter !== '#'" 
                :href="data.social.twitter" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter / X"
                class="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#feb900] hover:border-[#feb900] transition-colors duration-200"
              >
                <Icon name="lucide:twitter" class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- Column 2: Navigation (Span 2) -->
          <div class="lg:col-span-2 space-y-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#feb900]">Navigation</h4>
            <ul class="space-y-2.5 text-xs sm:text-sm font-normal">
              <li>
                <NuxtLink to="/" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">Home</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">About Us</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/services" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">Services</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/projects" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">Projects</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/blog" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">Blog</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/career" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">Careers</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-neutral-400 hover:text-white transition-colors duration-150 inline-block">Contact</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 3: Services (Span 3) -->
          <div class="lg:col-span-3 space-y-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#feb900]">Services</h4>
            <ul class="space-y-2.5 text-xs sm:text-sm font-normal">
              <li v-for="service in (data?.services || []).slice(0, 6)" :key="service.id">
                <NuxtLink to="/services" class="text-neutral-400 hover:text-white transition-colors duration-150 block truncate">
                  <span v-html="service.name"></span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 4: Contact & Inquiries (Span 3) -->
          <div class="lg:col-span-3 space-y-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#feb900]">Get In Touch</h4>
            <div class="space-y-3 text-xs sm:text-sm font-normal text-neutral-400">
              <div v-if="data?.contact?.address" class="flex items-start gap-2.5">
                <Icon name="lucide:map-pin" class="w-4 h-4 text-[#feb900] shrink-0 mt-0.5" />
                <span class="whitespace-pre-line leading-relaxed">{{ data?.contact?.address }}</span>
              </div>
              <div v-if="data?.contact?.phone || data?.contact?.cell" class="flex items-center gap-2.5">
                <Icon name="lucide:phone" class="w-4 h-4 text-[#feb900] shrink-0" />
                <a :href="'tel:' + (data?.contact?.phone || data?.contact?.cell)" class="hover:text-white transition-colors">{{ data?.contact?.phone || data?.contact?.cell }}</a>
              </div>
              <div v-if="data?.contact?.email" class="flex items-center gap-2.5">
                <Icon name="lucide:mail" class="w-4 h-4 text-[#feb900] shrink-0" />
                <a :href="'mailto:' + data?.contact?.email" class="hover:text-white transition-colors truncate">{{ data?.contact?.email }}</a>
              </div>
            </div>

            <div class="pt-2">
              <NuxtLink
                to="/contact"
                class="inline-flex items-center gap-2 px-4 py-2 border border-[#feb900]/40 text-[#feb900] hover:bg-[#feb900] hover:text-slate-950 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
              >
                <span>Send a Message</span>
                <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
          </div>

        </div>

        <!-- Bottom Legal / Copyright Bar -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-normal">
          <div class="text-center sm:text-left">
            <span>&copy; <span v-if="displayCopyrightYear">{{ displayCopyrightYear }}&nbsp;</span><strong class="font-medium text-neutral-300">{{ data?.footer?.copyright_text || data?.homepage?.company_title || 'Cozmic Technology' }}</strong>. All Rights Reserved.</span>
          </div>

          <div class="flex items-center gap-1.5 text-center sm:text-right">
            <span>{{ data?.footer?.designed_by_prefix || 'Designed by' }}</span>
            <a 
              :href="data?.footer?.designed_by_url || 'https://mdynamic.us/'" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-neutral-300 hover:text-[#feb900] underline-offset-4 hover:underline transition-colors"
            >
              {{ data?.footer?.designed_by_text || 'mDynamic' }}
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- ======= Scroll Top Button ======= -->
    <button 
      class="scroll-top flex items-center justify-center border-0"
      :class="{ 'active': showScrollTop }"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <Icon name="lucide:arrow-up" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const route = useRoute()
const isLightHeader = computed(() => route.path !== '/')

const { data } = await useFetch('/api/common', { key: 'site-common-data' })

const displayCopyrightYear = computed(() => {
  const footer = data.value?.footer
  if (footer?.copyright_auto_year !== false) {
    return new Date().getFullYear()
  }
  return footer?.copyright_year || ''
})

useHead({
  title: () => data.value?.homepage?.company_title ? `${data.value.homepage.company_title} - Engineering Consultancy` : 'Cozmic Technology - Engineering Consultancy',
  link: () => {
    const links = [
      {
        rel: 'icon',
        type: data.value?.homepage?.favicon?.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
        href: data.value?.homepage?.favicon ? `/assets/img/${data.value.homepage.favicon}` : '/assets/img/favicon.svg'
      }
    ]
    const fontLinks = data.value?.typography?.fontLinks || []
    for (const fl of fontLinks) {
      links.push({ rel: 'stylesheet', href: fl })
    }
    return links
  },
  style: [
    {
      id: 'site-dynamic-typography',
      innerHTML: () => data.value?.typography?.css || ''
    }
  ],
  bodyAttrs: {
    class: () => data.value?.homepage?.theme || 'theme-default'
  }
})

const loading = ref(true)
const scrolled = ref(false)
const showScrollTop = ref(false)
const mobileNavOpen = ref(false)

onMounted(() => {
  // Hide preloader when app is mounted
  loading.value = false

  // P13 — Throttle scroll handler with requestAnimationFrame to prevent
  // reactive updates on every pixel of scroll movement
  let scrollTicking = false
  const handleScroll = () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        scrolled.value = window.scrollY > 50
        showScrollTop.value = window.scrollY > 100
        scrollTicking = false
      })
      scrollTicking = true
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

// Scroll to top animation
const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// Mobile navigation togglers
const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

// Watch mobileNavOpen to toggle body class
watch(mobileNavOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.classList.add('mobile-nav-active')
    } else {
      document.body.classList.remove('mobile-nav-active')
    }
  }
})

// Mobile dropdown toggle script
const toggleDropdown = (event) => {
  if (process.client && document.body.classList.contains('mobile-nav-active')) {
    const link = event.currentTarget
    link.classList.toggle('active')
    const ul = link.nextElementSibling
    if (ul) {
      ul.classList.toggle('dropdown-active')
    }
    const indicator = link.querySelector('.dropdown-indicator')
    if (indicator) {
      indicator.classList.toggle('bi-chevron-up')
      indicator.classList.toggle('bi-chevron-down')
    }
  }
}
</script>
<style>
/* Preloader deactivation styles */
#preloader {
  transition: all 0s;
}
#preloader.preloader-deactivated {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Sticked header styles — light ash background for clean visible navigation */
.header.sticked {
  background-color: rgba(240, 241, 243, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 997;
  animation: headerSticky 0.35s ease-in-out;
}

.header.sticked .logo h1 {
  color: #0f172a;
}

.header.sticked .navbar a,
.header.sticked .navbar a:focus {
  color: #334155;
  font-weight: 500;
}

.header.sticked .navbar a:hover,
.header.sticked .navbar .active,
.header.sticked .navbar .active:focus,
.header.sticked .navbar li:hover>a {
  color: #090402;
}

.header.sticked .navbar a:hover:before,
.header.sticked .navbar .active:before {
  background-color: var(--color-primary);
  visibility: visible;
  width: 100%;
}

.header.sticked .mobile-nav-toggle {
  color: #0f172a;
}

@keyframes headerSticky {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Override default focus-outline on buttons */
button.scroll-top:focus {
  outline: none;
}
</style>

