<template>
  <div class="bg-white min-h-screen text-[#090402]">

    <!-- ======= Studio / Intro Hero (No breadcrumbs, clean minimal editorial top) ======= -->
    <section class="pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <!-- Eyebrow + Two-column header -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div class="lg:col-span-5" data-aos="fade-up">
            <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase mb-4">
              {{ data?.aboutUs?.hero_eyebrow || 'Studio — Cozmic Technology' }}
            </span>
            <h1 class="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-light text-[#090402] leading-[1.15] tracking-tight">
              {{ data?.aboutUs?.story_title || 'Together to Build a Better Future.' }}
            </h1>
          </div>

          <div class="lg:col-span-7 space-y-4 lg:pt-8" data-aos="fade-up" data-aos-delay="100">
            <p class="text-neutral-600 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
              {{ data?.aboutUs?.story_body || 'Cozmic Technology is a Bangladeshi Incorporated engineering firm. We specialize in Geotechnical Investigation, Engineering Consultancy, Architecture, Construction and Construction Project management services.\n\nWe design a wide range of building types that each excels at their function, provide a high-quality environment for people, and strengthen their client’s brands and identities.' }}
            </p>
          </div>
        </div>

        <!-- Full-bleed / Wide Hero Photograph (Clean, no overlays, architectural) -->
        <div class="mt-16 sm:mt-20 lg:mt-24 xl:mt-28 overflow-hidden rounded-sm bg-neutral-100" data-aos="fade-up">
          <img
            :src="data?.aboutUs?.story_image || '/assets/img/about.jpg'"
            alt="Cozmic Technology Studio and Architecture"
            class="w-full h-auto max-h-[640px] object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
        </div>

      </div>
    </section>

    <!-- ======= Editorial Statement Section (.stmt) ======= -->
    <section class="py-16 md:py-24 border-y border-neutral-150 bg-neutral-50/60">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <p class="font-display text-2xl sm:text-3xl md:text-4xl font-light text-[#090402] leading-[1.35] tracking-tight">
            &ldquo;{{ data?.aboutUs?.story_body2 || 'We work closely with our clients to interpret their dreams/visions accurately in drawings and bring them to the desired reality through construction solutions to meet their needs.' }}&rdquo;
          </p>
          <div class="mt-6 flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium">
            <span>Established {{ data?.aboutUs?.est || '2020' }}</span>
            <span>&bull;</span>
            <span>{{ data?.aboutUs?.location_text || 'Dhaka, Bangladesh' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= Purpose & Core Capabilities (.sd-values) ======= -->
    <section v-if="data?.aboutUs?.mission_is_active !== false" class="py-20 lg:py-28">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <!-- Sticky Visual on Left -->
          <div class="lg:col-span-6 lg:sticky lg:top-28" data-aos="fade-up">
            <div class="overflow-hidden rounded-sm bg-neutral-100 aspect-[4/3] lg:aspect-square">
              <img
                :src="data?.aboutUs?.mission_image || '/assets/img/alt-services.jpg'"
                alt="Engineering Capabilities"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Content List on Right -->
          <div class="lg:col-span-6 space-y-10" data-aos="fade-up" data-aos-delay="100">
            <div>
              <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase mb-3">
                {{ data?.aboutUs?.mission_eyebrow || 'Mission & Focus' }}
              </span>
              <h2 class="font-display text-3xl sm:text-4xl font-light text-[#090402] leading-tight">
                {{ data?.aboutUs?.mission_title || 'OUR MISSION' }}
              </h2>
            </div>

            <!-- Value item 1: Mission -->
            <div class="border-t border-neutral-200 pt-6">
              <h3 class="text-sm font-semibold tracking-wide uppercase text-[#090402] mb-3">
                {{ data?.aboutUs?.mission_label || 'Committed to Precision' }}
              </h3>
              <p class="text-neutral-600 text-sm sm:text-base leading-relaxed">
                {{ data?.aboutUs?.mission_body || 'Our mission is to establish Cozmic Technology as a trusted, reliable and top-tier provider of engineering consultancy and geotechnical investigation services in the region. We strive to help our clients execute their projects safely and efficiently.' }}
              </p>
            </div>

            <!-- Value item 2: Philosophy Tagline -->
            <div class="border-t border-neutral-200 pt-6">
              <h3 class="text-sm font-semibold tracking-wide uppercase text-[#090402] mb-3">
                {{ data?.aboutUs?.guarantee_label || 'Our Guarantee' }}
              </h3>
              <p class="text-neutral-600 text-sm sm:text-base leading-relaxed italic">
                &ldquo;{{ data?.aboutUs?.tagline || 'Providing solutions that are secure, stable, and economically sound.' }}&rdquo;
              </p>
            </div>

            <!-- Value item 3: Capabilities list -->
            <div class="border-t border-neutral-200 pt-6">
              <h3 class="text-sm font-semibold tracking-wide uppercase text-[#090402] mb-4">
                {{ data?.aboutUs?.disciplines_label || 'Core Disciplines' }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-700">
                <div
                  v-for="service in data?.services || []"
                  :key="service.id"
                  class="flex items-center gap-2.5 py-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-[#090402]"></span>
                  <span v-html="service.name" class="font-normal text-neutral-800"></span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- ======= Vision & Approach (.sd-approach) ======= -->
    <section v-if="data?.aboutUs?.vision_is_active !== false" class="py-20 lg:py-24 bg-neutral-50/70 border-t border-neutral-200/70">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <!-- Two-column header -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start" data-aos="fade-up">
          <div class="lg:col-span-5">
            <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase mb-3">
              {{ data?.aboutUs?.vision_eyebrow || 'Looking Forward' }}
            </span>
            <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#090402] leading-tight">
              {{ data?.aboutUs?.vision_title || 'OUR VISION' }}
            </h2>
          </div>
          <div class="lg:col-span-7 lg:pt-6">
            <p class="text-neutral-600 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
              {{ data?.aboutUs?.vision_body || 'To be the most reliable and premium engineering consulting firm, leading with innovation and sustainable designs. We envision transforming construction environments and empowering clients with top-of-the-line structural, civil, and environmental engineering solutions.' }}
            </p>
          </div>
        </div>

        <!-- Wide Banner Image -->
        <div class="mt-12 lg:mt-16 overflow-hidden rounded-sm bg-neutral-100" data-aos="fade-up">
          <img
            :src="data?.aboutUs?.vision_image || '/assets/img/alt-services-2.jpg'"
            alt="Architectural Planning and Construction Excellence"
            class="w-full aspect-[21/9] sm:aspect-[24/9] object-cover"
            loading="lazy"
          />
        </div>

      </div>
    </section>

    <!-- ======= Stats Counter Section (.sd-stats) ======= -->
    <section class="py-16 md:py-20 border-b border-neutral-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12" data-aos="fade-up">
          
          <!-- Stat 1 -->
          <div class="border-l border-neutral-200 pl-6 sm:pl-8">
            <Icon :name="data?.aboutUs?.happy_icon || 'lucide:smile'" class="text-2xl text-neutral-400 mb-2" />
            <div class="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-[#090402] tracking-tight tabular-nums">
              <Counter :target="data?.aboutUs?.happy_client || 23" />
            </div>
            <p class="text-xs uppercase tracking-[0.18em] text-neutral-500 font-medium mt-2">
              {{ data?.aboutUs?.happy_label || 'Happy Clients' }}
            </p>
          </div>

          <!-- Stat 2 -->
          <div class="border-l border-neutral-200 pl-6 sm:pl-8">
            <Icon :name="data?.aboutUs?.projects_icon || 'lucide:briefcase'" class="text-2xl text-neutral-400 mb-2" />
            <div class="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-[#090402] tracking-tight tabular-nums">
              <Counter :target="data?.aboutUs?.project_nos || 29" />
            </div>
            <p class="text-xs uppercase tracking-[0.18em] text-neutral-500 font-medium mt-2">
              {{ data?.aboutUs?.project_label || 'Projects Completed' }}
            </p>
          </div>

          <!-- Stat 3 -->
          <div class="border-l border-neutral-200 pl-6 sm:pl-8">
            <Icon :name="data?.aboutUs?.support_icon || 'lucide:headset'" class="text-2xl text-neutral-400 mb-2" />
            <div class="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-[#090402] tracking-tight tabular-nums">
              <Counter :target="data?.aboutUs?.hrs_support || 1740" />
            </div>
            <p class="text-xs uppercase tracking-[0.18em] text-neutral-500 font-medium mt-2">
              {{ data?.aboutUs?.support_label || 'Hours of Support' }}
            </p>
          </div>

          <!-- Stat 4 -->
          <div class="border-l border-neutral-200 pl-6 sm:pl-8">
            <Icon :name="data?.aboutUs?.emp_icon || 'lucide:hard-hat'" class="text-2xl text-neutral-400 mb-2" />
            <div class="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-[#090402] tracking-tight tabular-nums">
              <Counter :target="data?.aboutUs?.emp_nos || 35" />
            </div>
            <p class="text-xs uppercase tracking-[0.18em] text-neutral-500 font-medium mt-2">
              {{ data?.aboutUs?.emp_label || 'Hard Workers' }}
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= The Team Section (.sd-team) ======= -->
    <section id="team" class="py-20 lg:py-28">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <!-- Team Header: 2-column layout matching reference -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 lg:mb-20" data-aos="fade-up">
          <div class="lg:col-span-5">
            <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase mb-3">
              {{ data?.aboutUs?.team_eyebrow || 'The Team' }}
            </span>
            <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#090402] leading-tight">
              {{ data?.aboutUs?.team_title || 'Meet the people behind the designs' }}
            </h2>
          </div>
          <div class="lg:col-span-7 space-y-4 lg:pt-6">
            <p
              v-for="(para, idx) in teamDescriptionParagraphs"
              :key="idx"
              class="text-neutral-600 text-sm sm:text-base leading-relaxed"
            >
              {{ para }}
            </p>
          </div>
        </div>

        <!-- 4-Column Team Member Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8" data-aos="fade-up">
          <div
            v-for="member in data?.team || []"
            :key="member.id"
            class="group cursor-pointer"
            @click="toggleCV(member.id)"
          >
            <!-- Portrait Image: Grayscale by default, full color on hover with smooth transition -->
            <div class="relative overflow-hidden aspect-[4/5] bg-neutral-100 rounded-sm">
              <img
                :src="member.image ? (member.image.startsWith('/') ? member.image : '/assets/img/team/' + member.image) : '/assets/img/team/team-1.jpg'"
                :alt="member.name"
                class="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <!-- Name, designation, More trigger -->
            <div class="mt-3.5 space-y-1">
              <h4 class="text-sm sm:text-[15px] font-medium text-[#090402] leading-snug">
                {{ member.name }}
              </h4>
              <p class="text-xs text-neutral-500 leading-normal">
                {{ member.designation }}
              </p>
              <button
                type="button"
                @click.stop="toggleCV(member.id)"
                class="text-xs font-semibold text-[#090402] underline underline-offset-4 hover:text-[#feb900] transition-colors pt-1 block cursor-pointer"
              >
                {{ openCvId === member.id ? 'Close' : 'More' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Short CV Dropdown / Drawer Panel (Matching media_1790774449394.png) -->
        <Transition name="cv-panel">
          <div
            v-if="openCvMember"
            :key="openCvMember.id"
            ref="cvPanelRef"
            class="mt-12 pt-10 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative bg-white"
          >
            <!-- Close 'x' icon top right -->
            <button
              type="button"
              @click="openCvId = null"
              class="absolute top-8 right-0 text-neutral-400 hover:text-[#090402] transition-colors p-2 text-2xl leading-none cursor-pointer"
              aria-label="Close CV"
            >
              &times;
            </button>

            <!-- Left: Large Color Portrait -->
            <div class="md:col-span-4 lg:col-span-4">
              <div class="overflow-hidden aspect-[4/5] bg-neutral-100 rounded-sm">
                <img
                  :src="openCvMember.image ? (openCvMember.image.startsWith('/') ? openCvMember.image : '/assets/img/team/' + openCvMember.image) : '/assets/img/team/team-1.jpg'"
                  :alt="openCvMember.name"
                  class="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Right: Detailed Short CV / Bio -->
            <div class="md:col-span-8 lg:col-span-8 space-y-5 pr-8">
              <div>
                <span class="block text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-1">
                  {{ openCvMember.designation }}
                </span>
                <h3 class="font-display text-3xl sm:text-4xl font-light text-[#090402] leading-tight">
                  {{ openCvMember.name }}
                </h3>
              </div>

              <!-- Hairline separator -->
              <div class="w-full h-px bg-neutral-200"></div>

              <!-- Bio text / message -->
              <div class="text-neutral-600 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
                <p>
                  {{ openCvMember.message || `${openCvMember.name} serves as ${openCvMember.designation} at Cozmic Technology, bringing technical depth, dedication, and precision to our engineering and architectural endeavors. With a proven commitment to project excellence, client satisfaction, and innovative problem solving, they help lead multidisciplinary initiatives across geotechnical, structural, and architectural domains.` }}
                </p>
              </div>

              <!-- Hairline separator + Footer meta -->
              <div class="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold tracking-wider uppercase text-neutral-500">
                <span>{{ data?.aboutUs?.company_title || 'Cozmic Technology' }}, {{ data?.aboutUs?.location_text || 'Dhaka, Bangladesh' }}</span>
                <NuxtLink
                  to="/contact"
                  class="text-[#090402] underline underline-offset-4 hover:text-[#feb900] transition-colors"
                >
                  Get In Touch &rarr;
                </NuxtLink>
              </div>
            </div>

          </div>
        </Transition>

      </div>
    </section>

    <!-- ======= Good People, Good Design Feature Banner ======= -->
    <section class="py-20 lg:py-24 bg-[#f4f4f5] border-t border-neutral-200/80 text-[#090402]">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 text-center" data-aos="fade-up">
        <span class="inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] text-neutral-500 uppercase mb-4">
          {{ data?.aboutUs?.cta_eyebrow || 'Collaboration • Excellence' }}
        </span>
        <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#090402] mb-6 tracking-tight">
          {{ data?.aboutUs?.cta_heading || 'Good People. Good Engineering.' }}
        </h2>
        <p class="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          {{ data?.aboutUs?.cta_body || 'Ready to turn your ambitious engineering, geotechnical, or architectural vision into enduring reality? Our team is here to collaborate with you.' }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/contact"
            class="px-8 py-3.5 bg-[#090402] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-sm hover:bg-[#feb900] hover:text-[#090402] transition-colors shadow-sm"
          >
            Get In Touch
          </NuxtLink>
          <NuxtLink
            to="/career"
            class="px-8 py-3.5 border border-[#090402]/30 text-[#090402] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm hover:border-[#090402] hover:bg-[#090402]/5 transition-colors"
          >
            Join Our Team
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

useHead({
  title: 'About Us | Cozmic Technology - Multidisciplinary Engineering Consultancy',
  meta: [
    { name: 'description', content: 'Learn about Cozmic Technology — our story, mission, vision, and the expert team behind Bangladesh\'s trusted geotechnical and engineering consultancy firm.' },
    { property: 'og:title', content: 'About Cozmic Technology' },
    { property: 'og:description', content: 'Our mission, vision, and the expert team behind Bangladesh\'s trusted engineering consultancy.' },
  ]
})

const { data } = await useFetch('/api/about', { deep: false })

// Team intro body is stored as a single DB field; blank lines separate paragraphs
const teamDescriptionParagraphs = computed(() => {
  const text = data.value?.aboutUs?.team_description || ''
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
})

// Interactive Short CV state
const openCvId = ref(null)
const cvPanelRef = ref(null)

const openCvMember = computed(() => {
  if (!openCvId.value) return null
  return (data.value?.team || []).find(m => m.id === openCvId.value) || null
})

const toggleCV = (id) => {
  if (openCvId.value === id) {
    openCvId.value = null
  } else {
    openCvId.value = id
    nextTick(() => {
      if (cvPanelRef.value) {
        cvPanelRef.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }
}
</script>

<style scoped>
/* Smooth transition for the CV Dropdown Drawer */
.cv-panel-enter-active,
.cv-panel-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cv-panel-enter-from,
.cv-panel-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
