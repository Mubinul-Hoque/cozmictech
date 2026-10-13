<template>
  <div class="bg-white min-h-screen pb-24 font-sans text-slate-800">
    <!-- ======= Back Navigation Bar (No breadcrumbs, no background image) ======= -->
    <div class="pt-32 sm:pt-36 pb-4">
      <div class="container mx-auto px-4 md:px-8">
        <NuxtLink
          to="/projects"
          class="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-[#090402] transition-colors"
        >
          <Icon name="lucide:arrow-left" class="text-sm" />
          Back to Projects
        </NuxtLink>
      </div>
    </div>

    <!-- ======= Project Details Section ======= -->
    <section class="pb-16">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        
        <!-- Project Title Header -->
        <div class="mb-10 pb-6 border-b border-slate-100">
          <h1 class="project-title font-display mb-3">
            {{ data?.project?.title }}
          </h1>
          <div class="flex items-center gap-2 text-slate-500 font-normal text-sm md:text-base" v-if="data?.project?.location">
            <Icon name="lucide:map-pin" class="text-[#feb900] text-base" />
            <span>{{ data.project.location }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          <!-- Left Content Area (Image Gallery & Description) -->
          <div class="lg:col-span-8 space-y-12">

            <!-- Main Hero Project Image Display -->
            <div class="relative overflow-hidden h-[360px] md:h-[520px] rounded-2xl bg-slate-100 border border-slate-200/80 group">
              <div 
                v-if="sliderImages.length"
                class="absolute inset-0 bg-cover bg-center"
                :style="{ backgroundImage: `url(${sliderImages[0]})` }"
              ></div>
              <div 
                v-else
                class="absolute inset-0 bg-cover bg-center"
                style="background-image: url('/assets/img/projects/remodeling-1.jpg')"
              ></div>

              <!-- Fullscreen Overlay Trigger -->
              <button 
                @click="openFullscreen(0)"
                class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 z-20 border border-white/10 hover:border-transparent opacity-0 group-hover:opacity-100 cursor-pointer"
                title="View Fullscreen"
              >
                <Icon name="lucide:maximize-2" class="text-sm" />
              </button>
            </div>

            <!-- Project Details Description -->
            <div 
              v-if="data?.project?.description && data.project.description.trim() !== '' && data.project.description !== '<p><br></p>'"
              class="pt-8 border-t border-slate-100"
            >
              <div 
                class="formatted-content text-slate-600 leading-relaxed text-sm md:text-base space-y-4"
                v-html="data?.project?.description"
              ></div>
            </div>

            <!-- Scope of Work -->
            <div
              v-if="populatedServices.length > 0"
              class="pt-8 border-t border-slate-100 space-y-5"
            >
              <div class="pb-2 border-b border-slate-100">
                <h2 class="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#feb900]"></span>
                  <span>Scope of Work</span>
                </h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div
                  v-for="(svc, idx) in populatedServices"
                  :key="idx"
                  class="space-y-1 pb-3 border-b border-slate-50 last:border-b-0"
                >
                  <h3 class="text-sm font-medium text-slate-900 leading-snug">
                    {{ svc.title }}
                  </h3>
                  <p v-if="svc.details" class="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
                    {{ svc.details }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Multiple Project Images (2 images in a row under Scope of Work) -->
            <div 
              v-if="sliderImages.length > 1" 
              class="pt-8 border-t border-slate-100 space-y-4"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div 
                  v-for="(img, idx) in sliderImages" 
                  :key="idx"
                  class="group relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 aspect-[16/10] cursor-pointer"
                  @click="openFullscreen(idx)"
                >
                  <img 
                    :src="img" 
                    :alt="`${data?.project?.title || 'Project'} image ${idx + 1}`" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <!-- Subtle hover zoom icon overlay -->
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span class="w-10 h-10 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md">
                      <Icon name="lucide:maximize-2" class="text-sm" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related Projects Grid (Plain Surface) -->
            <div class="pt-8 border-t border-slate-100 space-y-6" v-if="data?.relatedProjects?.length">
              <h2 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Related Projects</h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div 
                  v-for="rel in data.relatedProjects" 
                  :key="rel.id" 
                  class="group space-y-2.5"
                >
                  <NuxtLink :to="'/projects/' + rel.id" class="block relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                    <img 
                      :src="rel.images && rel.images.length > 0 ? '/assets/img/projects/' + rel.images[0] : '/assets/img/projects/remodeling-1.jpg'" 
                      :alt="rel.title" 
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </NuxtLink>
                  <div>
                    <h4 class="font-medium text-sm text-slate-900 line-clamp-1 group-hover:text-[#feb900] transition-colors">
                      <NuxtLink :to="'/projects/' + rel.id">{{ rel.title }}</NuxtLink>
                    </h4>
                    <span class="text-xs text-slate-400 truncate block mt-0.5">{{ rel.location || 'Bangladesh' }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Sidebar (Plain Surface Specifications & Technical Specifications) -->
          <div class="lg:col-span-4 lg:sticky lg:top-28 space-y-8 lg:border-l lg:border-slate-100 lg:pl-8">
            
            <!-- Specifications Section -->
            <div class="space-y-4">
              <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#feb900]"></span>
                  <span>Specifications</span>
                </h3>
              </div>

              <div class="divide-y divide-slate-100 text-slate-800">


                <!-- Sector -->
                <div class="py-3 flex items-baseline justify-between gap-4" v-if="data?.sector?.sector">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sector</span>
                  <span class="text-sm font-semibold text-slate-900 text-right">{{ data.sector.sector }}</span>
                </div>

                <!-- Client -->
                <div class="py-3 flex items-baseline justify-between gap-4" v-if="data?.client?.client_name">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Client</span>
                  <span class="text-sm font-semibold text-slate-900 text-right">{{ data.client.client_name }}</span>
                </div>

                <!-- Project Cost -->
                <div class="py-3 flex items-baseline justify-between gap-4" v-if="data?.project?.project_cost">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Est. Cost</span>
                  <span class="text-sm font-semibold text-slate-900 text-right">{{ data.project.project_cost }}</span>
                </div>

                <!-- Service Cost -->
                <div class="py-3 flex items-baseline justify-between gap-4" v-if="data?.project?.service_cost">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Service Value</span>
                  <span class="text-sm font-semibold text-slate-900 text-right">{{ data.project.service_cost }}</span>
                </div>

                <!-- Timeline -->
                <div class="py-3 flex items-baseline justify-between gap-4" v-if="formattedTimeline">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Timeline</span>
                  <span class="text-sm font-semibold text-slate-900 text-right">{{ formattedTimeline }}</span>
                </div>

                <!-- Execution Status -->
                <div class="py-3 flex items-baseline justify-between gap-4" v-if="data?.project?.status">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status</span>
                  <span 
                    class="text-xs font-bold uppercase tracking-wider px-2 py-0.5"
                    :class="data.project.status.toLowerCase() === 'completed' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-800 bg-amber-50'"
                  >
                    {{ data.project.status }}
                  </span>
                </div>
              </div>


            </div>

            <!-- Technical Specifications Section (under Specifications on Plain Surface) -->
            <div
              v-if="populatedSpecs.length > 0"
              class="space-y-4 pt-6 border-t border-slate-200"
            >
              <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#feb900]"></span>
                  <span>Technical Specifications</span>
                </h3>
                <span v-if="data?.sector?.sector" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {{ data.sector.sector }}
                </span>
              </div>

              <div class="divide-y divide-slate-100">
                <div
                  v-for="(spec, idx) in populatedSpecs"
                  :key="idx"
                  class="py-3 space-y-0.5"
                >
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    {{ spec.title }}
                  </span>
                  <p class="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                    {{ spec.value }}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- Image Fullscreen Overlay Lightbox -->
    <div 
      v-if="fullscreenOpen" 
      class="fixed inset-0 bg-black/98 z-[9999] flex items-center justify-center p-4"
      @click="closeFullscreen"
    >
      <button 
        class="absolute top-6 right-6 text-white text-3xl hover:text-[#feb900] focus:outline-none bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
        @click="closeFullscreen"
      >
        <Icon name="lucide:x" />
      </button>

      <!-- Lightbox Controls -->
      <button 
        v-if="sliderImages.length > 1"
        @click.stop="prevSlide" 
        class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#feb900] text-white hover:text-slate-950 flex items-center justify-center transition-colors z-10"
        title="Previous image"
      >
        <Icon name="lucide:chevron-left" class="text-2xl" />
      </button>
      <button 
        v-if="sliderImages.length > 1"
        @click.stop="nextSlide" 
        class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#feb900] text-white hover:text-slate-950 flex items-center justify-center transition-colors z-10"
        title="Next image"
      >
        <Icon name="lucide:chevron-right" class="text-2xl" />
      </button>

      <img 
        :src="currentSlideUrl" 
        alt="Fullscreen view" 
        class="max-w-full max-h-[90vh] object-contain rounded shadow-2xl transition-transform duration-300"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const projectId = computed(() => parseInt(route.params.id))
const { data } = await useFetch(() => `/api/projects/${projectId.value}`)

// Analytics: track project view with context
const { trackPageView } = useAnalytics()
onMounted(() => {
  if (!import.meta.client) return
  const project = data.value?.project
  setTimeout(() => {
    trackPageView({
      projectId: project?.id ?? null,
      sectorId: project?.sector_id ?? null,
      categoryId: project?.categories?.[0]?.id ?? null,
    })
  }, 400)
})

const activeSlideIdx = ref(0)
const fullscreenOpen = ref(false)

// Render only valid service items from the dynamic services array
const populatedServices = computed(() => {
  const raw = data.value?.project?.services;
  if (Array.isArray(raw)) {
    return raw.filter(s => s && s.title && String(s.title).trim().length > 0);
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.split(',').map(s => ({ title: s.trim(), details: '' })).filter(s => s.title);
  }
  return [];
});

// Render only non-empty spec rows from the free-form array
const populatedSpecs = computed(() => {
  const specs = data.value?.project?.specifications
  if (!Array.isArray(specs)) return []
  return specs.filter(s => s?.title?.trim() && s?.value?.trim())
})

const formattedTimeline = computed(() => {
  const p = data.value?.project
  if (!p) return ''
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const start = formatDate(p.start_date)
  const end = formatDate(p.end_date)
  
  if (start && end) return `${start} - ${end}`
  if (start) return `${start} - Present`
  if (end) return `Completed by ${end}`
  return ''
})

const formatProjectImage = (name) => {
  if (!name) return '/assets/img/projects/remodeling-1.jpg'
  if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('/')) {
    return name
  }
  return `/assets/img/projects/${name}`
}

const sliderImages = computed(() => {
  if (!data.value?.project || !data.value.project.images || !Array.isArray(data.value.project.images)) return []
  return data.value.project.images.map(name => formatProjectImage(name))
})

const currentSlideUrl = computed(() => {
  if (!sliderImages.value.length) return '/assets/img/projects/remodeling-1.jpg'
  return sliderImages.value[activeSlideIdx.value]
})

const nextSlide = () => {
  if (!sliderImages.value.length) return
  activeSlideIdx.value = (activeSlideIdx.value + 1) % sliderImages.value.length
}

const prevSlide = () => {
  if (!sliderImages.value.length) return
  activeSlideIdx.value = (activeSlideIdx.value - 1 + sliderImages.value.length) % sliderImages.value.length
}

const openFullscreen = (idx = 0) => {
  if (typeof idx === 'number' && idx >= 0 && idx < sliderImages.value.length) {
    activeSlideIdx.value = idx
  }
  fullscreenOpen.value = true
}

const closeFullscreen = () => {
  fullscreenOpen.value = false
}
</script>

<style scoped>
/* Scoped overrides if any */
</style>
