<template>
  <div class="bg-white min-h-screen text-[#090402]">

    <!-- ======= Top Section: Services Grid + Large Architectural Image (Matching Reference Image 1) ======= -->
    <section class="pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-28">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          <!-- Left Column: Title, Subtitle & 6 Minimalist Service Cards -->
          <div class="lg:col-span-7 xl:col-span-7 flex flex-col justify-between" data-aos="fade-up">
            <div>
              <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase mb-4">
                {{ data?.pageContent?.hero_eyebrow || 'Disciplines • Capabilities' }}
              </span>
              <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#090402] leading-[1.12] tracking-tight mb-5">
                {{ data?.homepage?.title3 || 'Services' }}
              </h1>
              <p class="text-neutral-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl font-normal">
                {{ data?.homepage?.tag3 || 'From concept to completion, Cozmic Technology delivers geotechnical investigation, engineering consultancy, architecture, and construction management under one roof — across Bangladesh.' }}
              </p>
            </div>

            <!-- 6 Service Box Cards Grid (Minimal line-drawing icons with bottom labels) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-8 lg:mt-12">
              <div
                v-for="service in displayedServices"
                :key="service.id"
                @click="openServiceModal(service)"
                class="group border border-neutral-200/90 rounded-sm p-4 sm:p-5 flex flex-col justify-between hover:border-neutral-400 hover:shadow-sm transition-all duration-300 min-h-[145px] sm:min-h-[160px] bg-white cursor-pointer select-none"
              >
                <!-- Appropriate and decent engineering icon -->
                <div class="h-14 sm:h-16 flex items-center justify-center text-neutral-700 group-hover:text-[#feb900] transition-colors duration-300">
                  <Icon :name="getServiceIcon(service)" class="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4] transition-transform duration-300 group-hover:scale-110" />
                </div>

                <!-- Hairline divider -->
                <div class="w-full h-px bg-neutral-150 my-2 group-hover:bg-neutral-300 transition-colors"></div>

                <!-- Service Name -->
                <h3 class="text-xs sm:text-[13px] font-medium text-[#090402] leading-snug tracking-tight text-center w-full" v-html="service.name"></h3>
              </div>
            </div>
          </div>

          <!-- Right Column: Large Architectural Photograph (Matching Reference Image 1) -->
          <div class="lg:col-span-5 xl:col-span-5" data-aos="fade-up" data-aos-delay="100">
            <div class="w-full h-full min-h-[400px] lg:min-h-[520px] rounded-sm overflow-hidden bg-neutral-100 shadow-sm relative group">
              <img
                :src="data?.pageContent?.hero_image || '/assets/img/projects/jannatresidence1.jpg'"
                alt="Architectural Masterwork by Cozmic Technology"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-sm text-[11px] uppercase tracking-widest text-[#090402] font-medium flex items-center justify-between">
                <span>{{ data?.pageContent?.hero_caption_label || 'Completed Landmark Project' }}</span>
                <span class="text-neutral-400">{{ data?.pageContent?.hero_caption_location || 'Dhaka' }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Section 2: "How we work, from first idea to handover" (Matching Reference Image 2) ======= -->
    <section class="py-20 lg:py-28 border-t border-neutral-200/80 bg-neutral-50/60">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          <!-- Left Column: Vertical Architectural Portrait Photograph -->
          <div class="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28" data-aos="fade-up">
            <div class="overflow-hidden rounded-sm bg-neutral-100 shadow-sm aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full">
              <img
                :src="data?.pageContent?.process_image || '/assets/img/projects/chandrima1.jpg'"
                alt="Engineering process and construction delivery"
                class="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <p class="text-xs text-neutral-400 tracking-wider uppercase mt-3 text-center sm:text-left">
              {{ data?.pageContent?.process_caption || 'Rigorous execution from ground analysis to final structure' }}
            </p>
          </div>

          <!-- Right Column: Process Heading & Detailed Steps with Hairlines -->
          <div class="lg:col-span-7 xl:col-span-7" data-aos="fade-up" data-aos-delay="100">
            <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase mb-3">
              {{ data?.pageContent?.process_eyebrow || 'Methodology • Standards' }}
            </span>
            <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#090402] leading-[1.2] tracking-tight mb-8 sm:mb-12">
              {{ data?.pageContent?.process_heading || 'How we work, from first idea to handover' }}
            </h2>

            <div class="space-y-0">
              <div
                v-for="(step, idx) in (data?.pageContent?.process_steps || [])"
                :key="idx"
                class="border-t border-neutral-200/90 py-6 sm:py-7"
                :class="{ 'border-b': idx === (data?.pageContent?.process_steps || []).length - 1 }"
              >
                <h3 class="text-base sm:text-lg font-medium text-[#090402] flex items-baseline gap-3 mb-2.5">
                  <span class="text-xs font-mono text-neutral-400">{{ String(idx + 1).padStart(2, '0') }}</span>
                  <span>{{ step.title }}</span>
                </h3>
                <p class="text-neutral-600 text-sm sm:text-[15px] leading-relaxed pl-7 max-w-2xl font-normal">
                  {{ step.description }}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- ======= Interactive Service Detail Modal ======= -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedService"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="selectedService = null"
        >
          <div class="bg-white rounded-sm max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-neutral-200" data-aos="zoom-in">
            <button
              type="button"
              @click="selectedService = null"
              class="absolute top-5 right-5 text-neutral-400 hover:text-[#090402] text-2xl leading-none cursor-pointer transition-colors"
              aria-label="Close"
            >
              &times;
            </button>

            <span class="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 block mb-1">
              Discipline Detail
            </span>
            <h3 class="font-display text-2xl sm:text-3xl font-light text-[#090402] mb-4" v-html="selectedService.name"></h3>
            
            <div class="w-full h-px bg-neutral-200 mb-5"></div>

            <p class="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 font-normal whitespace-pre-line">
              {{ selectedService.description || selectedService.short_description || 'We provide reliable, efficient, and cost-effective engineering consultancy and investigation services across Bangladesh, meeting BNBC and international engineering standards.' }}
            </p>

            <div class="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span class="text-neutral-500 font-medium">{{ data?.company_title || 'Cozmic Technology' }} Engineering</span>
              <NuxtLink
                to="/contact"
                class="px-5 py-2.5 bg-[#090402] text-white font-medium uppercase tracking-wider rounded-sm hover:bg-[#feb900] hover:text-[#090402] transition-colors"
              >
                Inquire About Service &rarr;
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ======= Bottom Feature CTA Banner (Matching Light Ash Style) ======= -->
    <section class="py-20 lg:py-24 bg-[#f4f4f5] border-t border-neutral-200/80 text-[#090402]">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 text-center" data-aos="fade-up">
        <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-500 uppercase mb-4">
          {{ data?.pageContent?.cta_eyebrow || 'Consultation • Engineering Precision' }}
        </span>
        <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#090402] mb-6 tracking-tight">
          {{ data?.pageContent?.cta_heading || 'Ready to Discuss Your Next Project?' }}
        </h2>
        <p class="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          {{ data?.pageContent?.cta_body || 'From soil testing and structural design to turnkey engineering supervision, our licensed engineering consultants are ready to assist.' }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/contact"
            class="px-8 py-3.5 bg-[#090402] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-sm hover:bg-[#feb900] hover:text-[#090402] transition-colors shadow-sm"
          >
            Request Consultation
          </NuxtLink>
          <NuxtLink
            to="/projects"
            class="px-8 py-3.5 border border-[#090402]/30 text-[#090402] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm hover:border-[#090402] hover:bg-[#090402]/5 transition-colors"
          >
            Explore Projects
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Services | Cozmic Technology - Multidisciplinary Engineering Consultancy',
  meta: [
    { name: 'description', content: 'Explore Cozmic Technology\'s comprehensive engineering services including Geotechnical Investigation, Structural Design, Architecture, and Construction Management.' },
    { property: 'og:title', content: 'Engineering Services - Cozmic Technology' },
    { property: 'og:description', content: 'Geotechnical, structural integrity, architectural design, and turnkey engineering supervision services across Bangladesh.' }
  ]
})

const { data } = await useFetch('/api/services')

// Modal state for service detail
const selectedService = ref(null)
const openServiceModal = (service) => {
  selectedService.value = service
}

const displayedServices = computed(() => {
  return data.value?.services || data.value?.sectors || []
})

// Helper to determine appropriate and decent engineering icon based on service data / title
const getServiceIcon = (service) => {
  const n = (service?.name || '').toLowerCase()
  if (n.includes('geotechnical') || n.includes('soil') || n.includes('foundation')) return 'lucide:layers'
  if (n.includes('consultancy') || n.includes('architect') || n.includes('design')) return 'lucide:drafting-compass'
  if (n.includes('management') || n.includes('planning') || n.includes('project')) return 'lucide:clipboard-check'
  if (n.includes('construction') || n.includes('supervision')) return 'lucide:hard-hat'
  if (n.includes('integrity') || n.includes('structure') || n.includes('structural')) return 'lucide:building-2'
  if (n.includes('survey') || n.includes('testing')) return 'lucide:ruler'
  if (service?.icon && service.icon.startsWith('lucide:')) return service.icon
  return 'lucide:briefcase'
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
