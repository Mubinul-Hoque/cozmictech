<template>
  <div>
    <!-- ======= Preloader ======= -->
    <div id="preloader" :class="{ 'preloader-deactivated': !loading }"></div>

    <!-- ======= Header ======= -->
    <header id="header" class="header flex items-center" :class="{ 'sticked': scrolled }">
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

    <!-- ======= Footer ======= -->
    <footer id="footer" class="footer">
      <div class="footer-content relative">
        <div class="container mx-auto px-4 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <!-- Column 1: Info -->
            <div class="md:col-span-6 lg:col-span-4">
              <div class="footer-info">
                <h3>{{ data?.homepage?.company_title || 'Cozmic Technology' }}</h3>
                <p class="whitespace-pre-line">
                  {{ data?.contact?.address }}
                </p>
                <p class="mt-3">
                  <strong>Phone:</strong> {{ data?.contact?.phone || data?.contact?.cell }}<br>
                  <strong>Email:</strong> {{ data?.contact?.email }}
                </p>
                <div class="social-links flex mt-3 gap-2">
                  <a :href="data?.social?.fb || '#'" target="_blank" class="flex items-center justify-center"><Icon name="lucide:facebook" /></a>
                  <a :href="data?.social?.insta || '#'" target="_blank" class="flex items-center justify-center"><Icon name="lucide:instagram" /></a>
                  <a :href="data?.social?.linkedin || '#'" target="_blank" class="flex items-center justify-center"><Icon name="lucide:linkedin" /></a>
                </div>
              </div>
            </div>

            <!-- Column 2: Useful Links -->
            <div class="md:col-span-3 lg:col-span-2 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li><NuxtLink to="/">Home</NuxtLink></li>
                <li><NuxtLink to="/about">About Us</NuxtLink></li>
                <li><NuxtLink to="/services">Services</NuxtLink></li>
                <li><NuxtLink to="/projects">Projects</NuxtLink></li>
                <li><NuxtLink to="/career">Careers</NuxtLink></li>
                <li><NuxtLink to="/contact">Contact</NuxtLink></li>
              </ul>
            </div>

            <!-- Column 3: Services -->
            <div class="md:col-span-3 lg:col-span-2 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li v-for="service in data?.services || []" :key="service.id">
                  <NuxtLink to="/services"><span v-html="service.name"></span></NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Column 4: Contact CTA -->
            <div class="md:col-span-6 lg:col-span-4 footer-links">
              <h4>Get In Touch</h4>
              <p class="leading-relaxed mb-6 text-sm" style="color: rgba(255,255,255,0.65);">
                Have a project in mind or need expert guidance? Our engineering team is ready to help.
              </p>
              <NuxtLink
                to="/contact"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 bg-[#feb900] text-[#0f172a] hover:bg-white hover:text-[#0f172a]"
              >
                <Icon name="lucide:envelope-fill" />
                Contact Us
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>

      <div class="footer-legal text-center relative">
        <div class="container mx-auto px-4 lg:px-8">
          <div class="copyright">
            &copy; Copyright <strong><span>{{ data?.homepage?.company_title || 'Cozmic Technology' }}</span></strong>. All Rights Reserved
          </div>
          <div class="credits">
            Designed by <a href="https://mdynamic.us/" target="_blank">mDynamic</a>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'

const { data } = await useFetch('/api/common')

useHead({
  title: () => data.value?.homepage?.company_title ? `${data.value.homepage.company_title} - Engineering Consultancy` : 'Cozmic Technology - Engineering Consultancy',
  link: [
    {
      rel: 'icon',
      type: () => data.value?.homepage?.favicon?.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
      href: () => data.value?.homepage?.favicon ? `/assets/img/${data.value.homepage.favicon}` : '/assets/img/favicon.svg'
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

/* Sticked header styles matching standard templates */
.header.sticked {
  background: rgba(15, 23, 42, 0.9);
  padding: 15px 0;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 997;
  animation: headerSticky 0.5s ease-in-out;
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

