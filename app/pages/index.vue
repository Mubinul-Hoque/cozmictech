<template>
  <div class="bg-white min-h-screen text-[#090402] font-sans selection:bg-[#feb900]/20 selection:text-slate-900">
    <!-- ======= Hero Section (PRESERVED AS REQUESTED) ======= -->
    <section id="hero" class="hero relative min-h-[100vh] flex items-center justify-center text-white overflow-hidden">
      
      <div class="info flex items-center justify-center w-full z-10">
        <div class="container mx-auto px-4 md:px-8 text-center">
          <div class="max-w-3xl mx-auto">
            <h2 data-aos="fade-down" class="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Welcome to <span>{{ data?.homepage?.company_title || 'Cozmic Technology' }}</span>
            </h2>
            <p data-aos="fade-up" class="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed uppercase tracking-wider">
              {{ data?.homepage?.slogan || "Let's work together to make great things possible." }}
            </p>
            <NuxtLink data-aos="fade-up" to="/contact" class="btn-get-started">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Hero Carousel -->
      <div id="hero-carousel" class="carousel slide">
        <div 
          v-for="(img, idx) in heroImages" 
          :key="idx"
          class="carousel-item"
          :class="{ 'active': idx === activeHeroIdx }"
          :style="{ 
            backgroundImage: (idx === activeHeroIdx || idx === nextHeroIdx) ? `url(${img})` : 'none',
            opacity: idx === activeHeroIdx ? 1 : 0,
            visibility: idx === activeHeroIdx ? 'visible' : 'hidden',
            transition: 'opacity 1s ease-in-out, visibility 1s ease-in-out'
          }"
        ></div>

        <!-- Hero Navigation Controls -->
        <a v-if="heroImages.length > 1" class="carousel-control-prev" href="#" role="button" @click.prevent="prevHeroSlide">
          <Icon name="lucide:chevron-left" class="text-3xl" aria-hidden="true" />
        </a>
        <a v-if="heroImages.length > 1" class="carousel-control-next" href="#" role="button" @click.prevent="nextHeroSlide">
          <Icon name="lucide:chevron-right" class="text-3xl" aria-hidden="true" />
        </a>
      </div>
    </section>

    <!-- ======= Section 1: At a Glance / Studio Overview ======= -->
    <section class="py-20 lg:py-28 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <!-- Narrative & Metrics Column -->
          <div class="lg:col-span-6 space-y-8" data-aos="fade-up">
            <div>
              <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
                Overview &bull; Studio
              </span>
              <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight mb-5">
                {{ data?.homepage?.glance_title || 'At a Glance' }}
              </h2>
              <p class="text-neutral-600 text-sm sm:text-base lg:text-[17px] leading-relaxed whitespace-pre-line font-normal">
                {{ cleanContent(data?.homepage?.glance_description) || 'We are a collective of geotechnical engineers, architects, designers, and planners working together to build a better future across Bangladesh.\n\nWe work closely with clients to interpret their visions accurately into technical specifications, executing them to the highest standards through sound engineering solutions.' }}
              </p>
            </div>

            <!-- Key Metric Counters -->
            <div class="grid grid-cols-2 gap-6 pt-2 border-t border-neutral-150/70">
              <div class="space-y-1">
                <span class="block font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight tabular-nums">
                  {{ data?.homepage?.exp_year || '15+' }}
                </span>
                <span class="text-xs sm:text-sm font-medium text-neutral-500">
                  {{ data?.homepage?.Exp_title || 'Years of Experience' }}
                </span>
              </div>
              <div class="space-y-1">
                <span class="block font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight tabular-nums">
                  {{ data?.homepage?.pro_nos || '250+' }}
                </span>
                <span class="text-xs sm:text-sm font-medium text-neutral-500">
                  {{ data?.homepage?.pro_title || 'Successful Projects' }}
                </span>
              </div>
            </div>

            <!-- Read More Button -->
            <div class="pt-2">
              <NuxtLink 
                to="/about" 
                class="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50 text-slate-900 rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span>Explore Our Studio Story</span>
                <Icon name="lucide:arrow-right" class="text-sm text-[#feb900]" />
              </NuxtLink>
            </div>
          </div>

          <!-- Architectural Photograph -->
          <div class="lg:col-span-6" data-aos="fade-up" data-aos-delay="100">
            <div class="relative group overflow-hidden rounded-2xl border border-neutral-200/90 shadow-xs bg-neutral-100">
              <img 
                :src="data?.homepage?.glance_img ? (data.homepage.glance_img.includes('/') ? data.homepage.glance_img : '/assets/img/' + data.homepage.glance_img) : '/assets/img/glance.jpg'" 
                alt="At a Glance - Cozmic Technology" 
                width="650" height="480"
                loading="lazy"
                class="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Section 2: Clients / Industry Partners Strip ======= -->
    <section v-if="data?.clients?.length" class="py-12 sm:py-16 bg-neutral-50/60 border-y border-neutral-150">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        <div class="text-center mb-8 sm:mb-10">
          <span class="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400">
            {{ data?.homepage?.title10 || 'Trusted By' }}
          </span>
          <p v-if="data?.homepage?.tag10" class="text-neutral-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            {{ data.homepage.tag10 }}
          </p>
        </div>
        <!-- Static mode: fixed row, wraps as needed, never scrolls -->
        <div
          v-if="!isClientsScrolling"
          class="flex items-center justify-center flex-wrap gap-6 sm:gap-8 lg:gap-12 w-full py-2"
        >
          <div
            v-for="client in data.clients"
            :key="client.id"
            class="h-14 sm:h-16 lg:h-18 flex items-center justify-center px-3 shrink-0 transition-all duration-300"
            :title="client.client_name"
          >
            <img
              :src="getClientLogoSrc(client)"
              :alt="client.client_name"
              width="200" height="70"
              loading="lazy"
              class="client-logo-img"
            />
          </div>
        </div>

        <!-- Scrolling mode: continuous auto-scrolling marquee, ~5 logos visible at a time on desktop -->
        <div v-else class="client-marquee-viewport">
          <div class="client-marquee-track" :style="{ animationDuration: clientMarqueeDuration }">
            <div
              v-for="(client, idx) in duplicatedClients"
              :key="idx + '-' + client.id"
              class="client-marquee-item"
              :title="client.client_name"
            >
              <img
                :src="getClientLogoSrc(client)"
                :alt="client.client_name"
                width="200" height="70"
                loading="lazy"
                class="client-logo-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= Section 3: Our Core Strengths / Engineering Rigor ======= -->
    <section class="py-20 lg:py-28 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <!-- Image Column (Left) -->
          <div class="lg:col-span-5 order-2 lg:order-1" data-aos="fade-up">
            <div class="relative group overflow-hidden rounded-2xl border border-neutral-200/90 shadow-xs bg-neutral-100">
              <img
                :src="data?.homepage?.strengths_image ? (data.homepage.strengths_image.includes('/') ? data.homepage.strengths_image : '/assets/img/' + data.homepage.strengths_image) : '/assets/img/alt-services.jpg'"
                alt="Engineering Capabilities - Cozmic Technology"
                width="600" height="520"
                loading="lazy"
                class="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          <!-- Content Column (Right) -->
          <div class="lg:col-span-7 order-1 lg:order-2 space-y-8" data-aos="fade-up">
            <div>
              <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
                Capabilities &bull; Technical Rigor
              </span>
              <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight mb-4">
                {{ data?.homepage?.title4 || 'Our Core Strengths' }}
              </h2>
              <p class="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
                {{ data?.homepage?.tag4 || 'We have an experienced team of Geotechnical Engineers & Architects dedicated to delivering effective, efficient, and economical solutions across Bangladesh.' }}
              </p>
            </div>

            <!-- Strengths List -->
            <div class="space-y-6 sm:space-y-7">
              <div 
                v-for="strength in (data?.strengths?.length ? data.strengths : defaultStrengths)" 
                :key="strength.id" 
                class="space-y-1.5"
              >
                <h3 class="font-display text-xl sm:text-2xl text-slate-900 font-normal leading-snug">
                  {{ strength.title }}
                </h3>
                <p class="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {{ strength.content }}
                </p>
              </div>
            </div>

            <!-- Services Link -->
            <div class="pt-2">
              <NuxtLink 
                to="/services" 
                class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-900 hover:text-[#feb900] transition-colors"
              >
                <span>View All Engineering Services</span>
                <Icon name="lucide:arrow-right" class="text-sm" />
              </NuxtLink>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- ======= Section 4: Testimonials / Client Voices ======= -->
    <section v-if="data?.testimonials?.length" class="py-20 lg:py-28 bg-neutral-50/60 border-y border-neutral-150">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        
        <!-- Header Row -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
              Endorsements &bull; Client Trust
            </span>
            <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight">
              {{ data?.homepage?.title5 || 'Client Endorsements' }}
            </h2>
            <p class="text-neutral-600 text-sm sm:text-base mt-2 font-normal max-w-xl">
              {{ data?.homepage?.tag5 || 'What industry partners and project developers say about our engineering precision.' }}
            </p>
          </div>

          <!-- Carousel Arrow Controls -->
          <div v-if="pageCount > 1" class="flex items-center gap-2">
            <button 
              type="button" 
              @click="prevTestimonial" 
              class="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:border-neutral-400 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <Icon name="lucide:chevron-left" class="text-lg" />
            </button>
            <button 
              type="button" 
              @click="nextTestimonial" 
              class="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:border-neutral-400 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <Icon name="lucide:chevron-right" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Testimonial Slider Container -->
        <div 
          class="relative overflow-hidden"
          @mouseenter="stopTestimonialAutoplay"
          @mouseleave="startTestimonialAutoplay"
        >
          <div 
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${activeTestimonialIdx * (100 / slidesPerView)}%)` }"
          >
            <div 
              v-for="t in data.testimonials" 
              :key="t.id"
              class="w-full xl:w-1/2 flex-shrink-0 px-3 sm:px-4"
            >
              <div class="h-full bg-white border border-neutral-200/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-neutral-400 transition-all duration-300">
                
                <!-- Rating Stars & Quote -->
                <div class="space-y-4">
                  <div class="flex items-center gap-1">
                    <Icon v-for="star in (t.stars || 5)" :key="star" name="lucide:star" class="text-[#feb900] text-sm fill-[#feb900]" />
                  </div>
                  <p class="text-slate-700 text-sm sm:text-base leading-relaxed italic font-normal">
                    &ldquo;{{ cleanContent(t.story) }}&rdquo;
                  </p>
                </div>

                <!-- Author Row -->
                <div class="flex items-center gap-4 pt-4 border-t border-neutral-100">
                  <img 
                    :src="t.image ? (t.image.includes('/') ? t.image : '/assets/img/testimonials/' + t.image) : '/assets/img/testimonials/testimonials-1.jpg'" 
                    class="w-12 h-12 rounded-full object-cover border border-neutral-200 bg-neutral-100" 
                    :alt="t.name?.trim()"
                    width="48" height="48"
                    loading="lazy"
                  />
                  <div>
                    <h3 class="font-semibold text-slate-900 text-sm">{{ t.name?.trim() }}</h3>
                    <p class="text-xs text-neutral-400 font-medium mt-0.5">
                      {{ t.designation?.trim() }}<span v-if="t.company?.trim()"> &bull; {{ t.company?.trim() }}</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Pagination Indicator Dots -->
          <div v-if="pageCount > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              v-for="pIdx in pageCount" 
              :key="pIdx"
              @click="activeTestimonialIdx = pIdx - 1"
              class="h-1.5 rounded-full transition-all duration-300 border-0 focus:outline-none cursor-pointer"
              :class="(pIdx - 1) === activeTestimonialIdx ? 'w-8 bg-slate-950' : 'w-2 bg-neutral-300 hover:bg-neutral-400'"
              :aria-label="'Go to slide ' + pIdx"
            ></button>
          </div>
        </div>

      </div>
    </section>

    <!-- ======= Section 5: Recent News & Perspectives (Blog) ======= -->
    <section v-if="data?.recentPosts?.length" class="py-20 lg:py-28 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        
        <!-- Header Row -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
              Journal &bull; Technical Insights
            </span>
            <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight">
              {{ data?.homepage?.title6 || 'Recent News & Perspectives' }}
            </h2>
            <p class="text-neutral-600 text-sm sm:text-base mt-2 font-normal max-w-xl">
              {{ data?.homepage?.tag6 || 'Discourse, field studies, and infrastructure progress from our engineering desk.' }}
            </p>
          </div>

          <div>
            <NuxtLink 
              to="/blog" 
              class="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 hover:border-neutral-300 bg-white text-slate-900 rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
            >
              <span>View All Perspectives</span>
              <Icon name="lucide:arrow-right" class="text-sm text-[#feb900]" />
            </NuxtLink>
          </div>
        </div>

        <!-- 3 Recent Posts Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div 
            v-for="post in data.recentPosts" 
            :key="post.id" 
            class="group bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xs"
          >
            <div>
              <!-- Post Image Thumbnail -->
              <div class="relative overflow-hidden h-52 sm:h-56 bg-neutral-100">
                <img 
                  :src="post.image ? (post.image.includes('/') ? post.image : '/assets/img/blog/' + post.image) : '/assets/img/blog/blog-1.jpg'" 
                  :alt="post.title" 
                  width="450" height="240"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <!-- Post Meta & Content -->
              <div class="p-6 sm:p-7 space-y-3">
                <div class="flex items-center gap-2 text-[11px] font-semibold text-[#feb900] uppercase tracking-wider">
                  <span>{{ post.sdate || 'Company News' }}</span>
                </div>
                <h3 class="font-display text-xl sm:text-2xl font-normal text-slate-900 group-hover:text-[#feb900] transition-colors line-clamp-2 leading-snug">
                  <NuxtLink :to="'/blog/' + post.id">
                    {{ post.title }}
                  </NuxtLink>
                </h3>
                <p class="text-neutral-600 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                  {{ stripHtml(cleanContent(post.content)) }}
                </p>
              </div>
            </div>

            <!-- Post Footer -->
            <div class="px-6 sm:px-7 pb-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 mt-auto">
              <span>By {{ post.author || 'Admin' }}</span>
              <NuxtLink 
                :to="'/blog/' + post.id" 
                class="font-semibold text-slate-900 group-hover:text-[#feb900] inline-flex items-center gap-1 transition-colors"
              >
                <span>Read</span>
                <Icon name="lucide:arrow-right" class="text-xs" />
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ======= Optional Custom Sections (Sections 7, 8, 9) ======= -->
    <template v-if="data?.homepage?.title7">
      <section class="py-20 lg:py-24 bg-neutral-50/60 border-t border-neutral-150">
        <div class="container mx-auto px-4 sm:px-6 lg:px-12">
          <div class="grid grid-cols-1 gap-12 items-center" :class="data.homepage.image7 ? 'lg:grid-cols-2' : ''">
            <div class="space-y-6" data-aos="fade-up">
              <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-1">
                Initiative
              </span>
              <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight">
                {{ data.homepage.title7 }}
              </h2>
              <p class="text-neutral-600 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {{ cleanContent(data.homepage.content7) }}
              </p>
            </div>
            <div v-if="data.homepage.image7" class="relative group overflow-hidden rounded-2xl border border-neutral-200/90 shadow-xs" data-aos="zoom-in">
              <img 
                :src="data.homepage.image7.includes('/') ? data.homepage.image7 : '/assets/img/' + data.homepage.image7" 
                :alt="data.homepage.title7" 
                width="600" height="400"
                loading="lazy"
                class="w-full h-[400px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </template>

    <template v-if="data?.homepage?.title8">
      <section class="py-20 lg:py-24 bg-white border-t border-neutral-150">
        <div class="container mx-auto px-4 sm:px-6 lg:px-12">
          <div class="grid grid-cols-1 gap-12 items-center" :class="data.homepage.image8 ? 'lg:grid-cols-2' : ''">
            <div v-if="data.homepage.image8" class="relative group overflow-hidden rounded-2xl border border-neutral-200/90 shadow-xs lg:order-first order-last" data-aos="zoom-in">
              <img 
                :src="data.homepage.image8.includes('/') ? data.homepage.image8 : '/assets/img/' + data.homepage.image8" 
                :alt="data.homepage.title8" 
                width="600" height="400"
                loading="lazy"
                class="w-full h-[400px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div class="space-y-6" data-aos="fade-up">
              <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-1">
                Technology &bull; Modernization
              </span>
              <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight">
                {{ data.homepage.title8 }}
              </h2>
              <p class="text-neutral-600 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {{ cleanContent(data.homepage.content8) }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ======= Section: Project Consultation CTA ======= -->
    <section class="py-20 lg:py-28 bg-[#f4f4f5] text-[#090402] border-t border-neutral-200/80 relative overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10" data-aos="fade-up">
        <div class="max-w-3xl space-y-6">
          <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase">
            Start Your Journey
          </span>
          <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight">
            {{ data?.homepage?.cta_title || 'Ready to Build Bangladesh’s Next Infrastructure Milestone?' }}
          </h2>
          <p class="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
            {{ cleanContent(data?.homepage?.cta_content) || 'Our multi-disciplinary team of senior geotechnical consultants, structural specialists, and architects is ready to advise on your project from ground investigation through to full construction supervision.' }}
          </p>
          <div class="flex flex-wrap items-center gap-4 pt-4">
            <NuxtLink 
              to="/contact" 
              class="px-8 py-4 bg-[#feb900] hover:bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full transition-all duration-200 shadow-sm hover:shadow"
            >
              Request a Technical Consultation
            </NuxtLink>
            <NuxtLink 
              to="/projects" 
              class="px-8 py-4 border border-neutral-300 hover:border-slate-900 text-slate-900 hover:bg-white font-semibold uppercase tracking-wider text-xs rounded-full transition-colors"
            >
              Explore Portfolio Projects
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

useHead({
  title: 'Cozmic Technology - Engineering Consultancy | Home',
  meta: [
    { name: 'description', content: 'Cozmic Technology is a premier engineering consultancy firm specializing in Geotechnical Investigation, Architecture, and Construction Project Management in Bangladesh.' },
    { property: 'og:title', content: 'Cozmic Technology - Engineering Consultancy' },
    { property: 'og:description', content: 'Trusted Geotechnical Investigation, Engineering Consultancy and Architecture firm in Bangladesh. 15+ years, 250+ projects.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
})

const { data } = await useFetch('/api/homepage', { key: 'home-page-data' })

// Client Logos Strip: Static vs Scrolling display mode
const getClientLogoSrc = (client) => {
  if (!client?.logo) return '/assets/img/favicon.png'
  return client.logo.includes('/') ? client.logo : '/assets/img/' + client.logo
}

// Scrolling mode only makes sense (and only activates) once there are enough logos
// to actually scroll past — otherwise it falls back to the static layout.
const isClientsScrolling = computed(() => {
  const count = data.value?.clients?.length || 0
  return data.value?.clientsDisplayMode === 'scrolling' && count > 5
})

const duplicatedClients = computed(() => {
  const list = data.value?.clients || []
  return [...list, ...list]
})

// Keep scroll speed visually consistent regardless of how many logos are configured
const clientMarqueeDuration = computed(() => {
  const count = data.value?.clients?.length || 0
  return `${Math.max(count * 4, 20)}s`
})

// Hero Carousel State (Preserved intact)
const heroImages = computed(() => {
  const images = data.value?.homepage?.hero_images
  if (Array.isArray(images) && images.length > 0) {
    return images
  }
  return [
    '/assets/img/hero-carousel/hero-carousel-1.jpg',
    '/assets/img/hero-carousel/hero-carousel-2.jpg',
    '/assets/img/hero-carousel/hero-carousel-3.jpg',
    '/assets/img/hero-carousel/hero-carousel-4.jpg',
    '/assets/img/hero-carousel/hero-carousel-5.jpg'
  ]
})
const activeHeroIdx = ref(0)
const nextHeroIdx = computed(() => (activeHeroIdx.value + 1) % (heroImages.value.length || 1))
let heroTimer = null

const startHeroSlideshow = () => {
  if (heroImages.value.length <= 1) return
  heroTimer = setInterval(() => { nextHeroSlide() }, 5000)
}

const nextHeroSlide = () => {
  if (heroImages.value.length === 0) return
  activeHeroIdx.value = (activeHeroIdx.value + 1) % heroImages.value.length
}

const prevHeroSlide = () => {
  if (heroImages.value.length === 0) return
  activeHeroIdx.value = (activeHeroIdx.value - 1 + heroImages.value.length) % heroImages.value.length
}

// Testimonials Carousel State
const activeTestimonialIdx = ref(0)
const slidesPerView = ref(2)
let testimonialTimer = null

const updateSlidesPerView = () => {
  if (process.client) {
    slidesPerView.value = window.innerWidth >= 1200 ? 2 : 1
  }
}

const maxIdx = computed(() => {
  const len = data.value?.testimonials?.length || 0
  return Math.max(0, len - slidesPerView.value)
})

const pageCount = computed(() => {
  const len = data.value?.testimonials?.length || 0
  if (len === 0) return 0
  return Math.max(1, len - slidesPerView.value + 1)
})

const nextTestimonial = () => {
  activeTestimonialIdx.value = activeTestimonialIdx.value >= maxIdx.value ? 0 : activeTestimonialIdx.value + 1
}

const prevTestimonial = () => {
  activeTestimonialIdx.value = activeTestimonialIdx.value <= 0 ? maxIdx.value : activeTestimonialIdx.value - 1
}

const startTestimonialAutoplay = () => {
  testimonialTimer = setInterval(() => { nextTestimonial() }, 5000)
}

const stopTestimonialAutoplay = () => {
  if (testimonialTimer) clearInterval(testimonialTimer)
}

const defaultStrengths = [
  {
    id: 's1',
    icon: 'lucide:award',
    title: 'Expert Technical Governance',
    content: 'Our team comprises highly qualified geotechnical and civil engineers dedicated to structural safety, code compliance, and precision.'
  },
  {
    id: 's2',
    icon: 'lucide:layers',
    title: 'Integrated Multidisciplinary Delivery',
    content: 'We bridge soil testing, geotechnical design, architectural planning, and construction project management under one unified framework.'
  },
  {
    id: 's3',
    icon: 'lucide:clock',
    title: 'Economical & Timely Execution',
    content: 'Methodical project management ensures optimum material efficiency, minimized ground risks, and adherence to tight developer schedules.'
  }
]

const cleanContent = (str) => {
  if (!str) return ''
  return str.replace(/\uFFFD|\?\?/g, "'").trim()
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

onMounted(() => {
  startHeroSlideshow()
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView, { passive: true })
  startTestimonialAutoplay()
})

onUnmounted(() => {
  if (heroTimer) clearInterval(heroTimer)
  window.removeEventListener('resize', updateSlidesPerView)
  stopTestimonialAutoplay()
})
</script>

<style scoped>
/* Consistent logo sizing shared by both static and scrolling display modes */
.client-logo-img {
  max-height: 3rem;
  max-width: 140px;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.8;
  transition: all 0.3s ease;
}
.client-logo-img:hover {
  filter: grayscale(0);
  opacity: 1;
}
@media (min-width: 640px) {
  .client-logo-img { max-height: 3.5rem; max-width: 160px; }
}
@media (min-width: 1024px) {
  .client-logo-img { max-height: 4rem; max-width: 180px; }
}

/* Scrolling marquee: edge-fade mask + continuous seamless loop */
.client-marquee-viewport {
  overflow: hidden;
  width: 100%;
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}
.client-marquee-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation-name: client-marquee-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.client-marquee-track:hover {
  animation-play-state: paused;
}
.client-marquee-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 150px;
  padding: 0 1.25rem;
}
@media (min-width: 640px) {
  .client-marquee-item { width: 190px; }
}
@media (min-width: 1024px) {
  /* Container is ~1150-1250px wide at this breakpoint, so ~230px per item shows ~5 logos at once */
  .client-marquee-item { width: 230px; }
}

@keyframes client-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .client-marquee-track {
    animation: none;
  }
}
</style>
