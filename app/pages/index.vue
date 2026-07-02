<template>
  <div>
    <!-- ======= Hero Section ======= -->
    <section id="hero" class="hero relative min-h-[100vh] flex items-center justify-center text-white overflow-hidden">
      
      <div class="info flex items-center justify-center w-full z-10">
        <div class="container mx-auto px-4 md:px-8 text-center">
          <div class="max-w-3xl mx-auto">
            <h2 data-aos="fade-down" class="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Welcome to <span>{{ data?.homepage?.company_title || 'Cozmic Technology' }}</span>
            </h2>
            <p data-aos="fade-up" data-aos-delay="100" class="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed uppercase tracking-wider">
              {{ data?.homepage?.slogan || "Let's work together to make great things possible." }}
            </p>
            <NuxtLink data-aos="fade-up" data-aos-delay="200" to="/contact" class="btn-get-started">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Hero Slideshow Backgrounds -->
      <div id="hero-carousel" class="carousel slide">
        <div 
          v-for="(img, idx) in heroImages" 
          :key="idx"
          class="carousel-item"
          :class="{ 'active': idx === activeHeroIdx }"
          :style="{ 
            backgroundImage: `url(${img})`,
            opacity: idx === activeHeroIdx ? 1 : 0,
            visibility: idx === activeHeroIdx ? 'visible' : 'hidden',
            transition: 'opacity 1s ease-in-out, visibility 1s ease-in-out'
          }"
        ></div>

        <!-- Hero Navigation Controls -->
        <a class="carousel-control-prev" href="#" role="button" @click.prevent="prevHeroSlide">
          <span class="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
        </a>
        <a class="carousel-control-next" href="#" role="button" @click.prevent="nextHeroSlide">
          <span class="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
        </a>
      </div>
    </section>

    <!-- ======= At a Glance Section ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="space-y-6" data-aos="fade-up">
            <h3 class="text-3xl font-bold text-[#2e3135]">
              {{ data?.homepage?.glance_title || 'At a Glance' }}
            </h3>
            <div class="w-16 h-1 bg-[#feb900]"></div>
            <p class="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {{ data?.homepage?.glance_description || 'We are a collective of geotechnical engineers, architects, designers, and planners working together to build a better future.\n\nWe work closely with our clients to interpret their dreams and visions accurately, bringing them to reality through construction and engineering solutions.' }}
            </p>
            <div class="grid grid-cols-2 gap-6 pt-4">
              <div class="border-l-4 border-[#feb900] pl-4">
                <span class="block text-3xl font-extrabold text-[#0f172a]">{{ data?.homepage?.exp_year || '15+' }}</span>
                <span class="text-gray-500 text-sm">{{ data?.homepage?.Exp_title || 'Years of Experience' }}</span>
              </div>
              <div class="border-l-4 border-[#feb900] pl-4">
                <span class="block text-3xl font-extrabold text-[#0f172a]">{{ data?.homepage?.pro_nos || '250+' }}</span>
                <span class="text-gray-500 text-sm">{{ data?.homepage?.pro_title || 'Successful Projects' }}</span>
              </div>
            </div>
          </div>

          <div class="relative group overflow-hidden rounded-lg shadow-xl" data-aos="zoom-in">
            <img 
              :src="data?.homepage?.glance_img ? '/assets/img/' + data.homepage.glance_img : '/assets/img/glance.jpg'" 
              alt="At a Glance" 
              class="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Clients Section ======= -->
    <section class="py-12 bg-gray-50 border-t border-b border-gray-100">
      <div class="container mx-auto px-4 md:px-8">
        <div class="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 hover:opacity-85 transition-opacity duration-300">
          <div v-for="client in data?.clients || []" :key="client.id" class="h-12 flex items-center">
            <img :src="client.logo ? '/assets/img/' + client.logo : '/assets/img/favicon.png'" :alt="client.client_name" class="max-h-full max-w-[120px] grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </div>
    </section>

    <!-- ======= Alt Services / Our Strength ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="relative overflow-hidden rounded-lg shadow-lg">
            <img src="/assets/img/alt-services.jpg" alt="Our Strength" class="w-full h-[500px] object-cover" />
          </div>

          <div class="space-y-8">
            <div>
              <h3 class="text-3xl font-bold text-[#2e3135] mb-4">
                {{ data?.homepage?.title4 || 'Our Strengths' }}
              </h3>
              <div class="w-16 h-1 bg-[#feb900] mb-4"></div>
              <p class="text-gray-600">
                {{ data?.homepage?.tag4 || 'We have an experienced team of Geotechnical Engineers & Architects. Our motive is to provide effective, efficient & economical services.' }}
              </p>
            </div>

            <div class="space-y-6">
              <div v-for="strength in data?.strengths || []" :key="strength.id" class="flex gap-4 items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-amber-50 rounded flex items-center justify-center text-xl text-[#feb900]">
                  <i :class="strength.icon || 'bi bi-check-circle'"></i>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-[#2e3135]">{{ strength.title }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ strength.content }}</p>
                </div>
              </div>

              <!-- Fallback Strengths if table is empty -->
              <template v-if="!data?.strengths?.length">
                <div class="flex gap-4 items-start">
                  <div class="flex-shrink-0 w-12 h-12 bg-amber-50 rounded flex items-center justify-center text-xl text-[#feb900]">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-[#2e3135]">Expert Technical Team</h4>
                    <p class="text-gray-600 text-sm mt-1">Our team comprises highly qualified civil and geotechnical engineers dedicated to safety and efficiency.</p>
                  </div>
                </div>
              </template>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Testimonials Section ======= -->
    <section id="testimonials" class="testimonials section-bg">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        
        <div class="section-header">
          <h2>{{ data?.homepage?.title5 || 'Testimonials' }}</h2>
          <p>{{ data?.homepage?.tag5 || 'What Our Clients Say' }}</p>
        </div>

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
              v-for="t in data?.testimonials || []" 
              :key="t.id"
              class="w-full xl:w-1/2 flex-shrink-0 px-4"
            >
              <div class="testimonial-wrap">
                <div class="testimonial-item">
                  <img 
                    :src="t.image ? (t.image.includes('/') ? t.image : '/assets/img/testimonials/' + t.image) : '/assets/img/testimonials/testimonials-1.jpg'" 
                    class="testimonial-img" 
                    :alt="t.name?.trim()" 
                  />
                  <h3>{{ t.name?.trim() }}</h3>
                  <h4>{{ t.designation?.trim() }} - {{ t.company?.trim() }}</h4>
                  <div class="stars">
                    <i v-for="star in (t.stars || 5)" :key="star" class="bi bi-star-fill"></i>
                  </div>
                  <p>
                    <i class="bi bi-quote quote-icon-left"></i>
                    {{ t.story }}
                    <i class="bi bi-quote quote-icon-right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Dots (swiper pagination style) -->
          <div v-if="pageCount > 1" class="swiper-pagination text-center mt-6">
            <button 
              v-for="pIdx in pageCount" 
              :key="pIdx"
              @click="activeTestimonialIdx = pIdx - 1"
              class="swiper-pagination-bullet mx-1 transition-all duration-300 border-0 focus:outline-none"
              :class="{ 'swiper-pagination-bullet-active': (pIdx - 1) === activeTestimonialIdx }"
              :aria-label="'Go to slide ' + pIdx"
            ></button>
          </div>
        </div>

      </div>
    </section>

    <!-- ======= Recent Blog Posts ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-[#2e3135] mb-4">
            {{ data?.homepage?.title6 || 'Recent News & Insights' }}
          </h2>
          <div class="w-16 h-1 bg-[#feb900] mx-auto mb-4"></div>
          <p class="text-gray-600">
            {{ data?.homepage?.tag6 || 'Stay updated with our latest engineering insights, project milestones, and company news.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="post in data?.recentPosts || []" :key="post.id" class="group border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div class="relative overflow-hidden h-48 bg-gray-100">
              <img 
                :src="post.image ? (post.image.includes('/') ? post.image : '/assets/img/blog/' + post.image) : '/assets/img/blog/blog-1.jpg'" 
                :alt="post.title" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div class="p-6 space-y-4">
              <span class="text-xs font-bold text-[#feb900] uppercase tracking-wider">{{ post.sdate || 'Company News' }}</span>
              <h3 class="font-bold text-lg text-[#2e3135] line-clamp-2 group-hover:text-[#feb900] transition-colors">
                <NuxtLink :to="'/blog/' + post.id">{{ post.title }}</NuxtLink>
              </h3>
              <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {{ post.content?.replace(/<[^>]*>/g, '') }}
              </p>
              <div class="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
                <span>By {{ post.author || 'Admin' }}</span>
                <NuxtLink :to="'/blog/' + post.id" class="font-bold text-[#feb900] hover:text-[#ffc732]">Read More</NuxtLink>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ======= Custom Section 7 ======= -->
    <section v-if="data?.homepage?.title7" class="py-20 bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 gap-12 items-center" :class="data.homepage.image7 ? 'lg:grid-cols-2' : ''">
          <div class="space-y-6" data-aos="fade-up">
            <h3 class="text-3xl font-bold text-[#2e3135]">
              {{ data.homepage.title7 }}
            </h3>
            <div class="w-16 h-1 bg-[#feb900]"></div>
            <p class="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {{ data.homepage.content7 }}
            </p>
          </div>
          <div v-if="data.homepage.image7" class="relative group overflow-hidden rounded-lg shadow-xl" data-aos="zoom-in">
            <img 
              :src="data.homepage.image7.includes('/') ? data.homepage.image7 : '/assets/img/' + data.homepage.image7" 
              :alt="data.homepage.title7" 
              class="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ======= Custom Section 8 ======= -->
    <section v-if="data?.homepage?.title8" class="py-20 bg-white border-t border-gray-100">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 gap-12 items-center" :class="data.homepage.image8 ? 'lg:grid-cols-2' : ''">
          <div v-if="data.homepage.image8" class="relative group overflow-hidden rounded-lg shadow-xl lg:order-first order-last" data-aos="zoom-in">
            <img 
              :src="data.homepage.image8.includes('/') ? data.homepage.image8 : '/assets/img/' + data.homepage.image8" 
              :alt="data.homepage.title8" 
              class="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="space-y-6" data-aos="fade-up">
            <h3 class="text-3xl font-bold text-[#2e3135]">
              {{ data.homepage.title8 }}
            </h3>
            <div class="w-16 h-1 bg-[#feb900]"></div>
            <p class="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {{ data.homepage.content8 }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= Custom Section 9 ======= -->
    <section v-if="data?.homepage?.title9" class="py-20 bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 gap-12 items-center" :class="data.homepage.image9 ? 'lg:grid-cols-2' : ''">
          <div class="space-y-6" data-aos="fade-up">
            <h3 class="text-3xl font-bold text-[#2e3135]">
              {{ data.homepage.title9 }}
            </h3>
            <div class="w-16 h-1 bg-[#feb900]"></div>
            <p class="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {{ data.homepage.content9 }}
            </p>
          </div>
          <div v-if="data.homepage.image9" class="relative group overflow-hidden rounded-lg shadow-xl" data-aos="zoom-in">
            <img 
              :src="data.homepage.image9.includes('/') ? data.homepage.image9 : '/assets/img/' + data.homepage.image9" 
              :alt="data.homepage.title9" 
              class="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const { data } = await useFetch('/api/homepage')

// Hero Carousel State
const heroImages = computed(() => {
  const imgStr = data.value?.homepage?.bgslide_img
  if (imgStr) {
    return imgStr.split(',').map(s => s.trim()).filter(Boolean)
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
let heroTimer = null

const startHeroSlideshow = () => {
  heroTimer = setInterval(() => {
    nextHeroSlide()
  }, 5000)
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
  if (activeTestimonialIdx.value >= maxIdx.value) {
    activeTestimonialIdx.value = 0
  } else {
    activeTestimonialIdx.value++
  }
}

const prevTestimonial = () => {
  if (activeTestimonialIdx.value <= 0) {
    activeTestimonialIdx.value = maxIdx.value
  } else {
    activeTestimonialIdx.value--
  }
}

const startTestimonialAutoplay = () => {
  testimonialTimer = setInterval(() => {
    nextTestimonial()
  }, 5000)
}

const stopTestimonialAutoplay = () => {
  if (testimonialTimer) clearInterval(testimonialTimer)
}

onMounted(() => {
  startHeroSlideshow()
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
  startTestimonialAutoplay()
})

onUnmounted(() => {
  if (heroTimer) clearInterval(heroTimer)
  window.removeEventListener('resize', updateSlidesPerView)
  stopTestimonialAutoplay()
})
</script>
