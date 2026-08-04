<template>
  <div class="bg-gray-50/50 min-h-screen pb-24">
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center relative overflow-hidden" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0f172a]/95 z-0"></div>
      
      <div class="container mx-auto px-4 md:px-8 relative text-center z-10" data-aos="fade-down">
        <h3 class="text-base md:text-xl font-extrabold text-white mb-4 tracking-tight uppercase line-clamp-1">
          Project Details
        </h3>
        <ol class="inline-flex w-fit flex-wrap justify-center items-center gap-2 text-[10px] md:text-xs text-[#feb900] font-semibold tracking-wider uppercase bg-black/30 backdrop-blur-md px-4 py-2 rounded-full max-w-full mx-auto border border-white/10">
          <li><NuxtLink to="/" class="text-white/80 hover:text-[#feb900] transition-colors">Home</NuxtLink></li>
          <li class="text-white/40"><Icon name="lucide:chevron-right" class="text-[10px]" /></li>
          <li><NuxtLink to="/projects" class="text-white/80 hover:text-[#feb900] transition-colors">Projects</NuxtLink></li>
        </ol>
      </div>
    </div>

    <!-- ======= Project Details Section ======= -->
    <section class="py-16">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        
        <!-- Project Title Header -->
        <div class="mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-3 tracking-tight">{{ data?.project?.title }}</h1>
          <div class="flex items-center gap-2 text-slate-500 font-medium mb-4" v-if="data?.project?.location">
            <Icon name="lucide:map-pin" class="text-[#feb900] text-lg" />
            <span>{{ data.project.location }}</span>
          </div>
          <div class="w-16 h-1.5 bg-[#feb900]"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- Left Content Area (Image Gallery & Description) -->
          <div class="lg:col-span-8 space-y-8">

            <!-- Dynamic Image Gallery Slider -->
            <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm p-4 space-y-4">
              <!-- Main Image Display -->
              <div class="relative overflow-hidden rounded-2xl h-[350px] md:h-[480px] bg-slate-100 group">
                <div class="w-full h-full relative" v-if="sliderImages.length">
                  <div 
                    v-for="(img, idx) in sliderImages" 
                    :key="idx"
                    class="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-in-out"
                    :style="{ 
                      backgroundImage: `url(${img})`,
                      opacity: idx === activeSlideIdx ? 1 : 0,
                      transform: idx === activeSlideIdx ? 'scale(1)' : 'scale(1.05)',
                      zIndex: idx === activeSlideIdx ? 1 : 0
                    }"
                  ></div>
                </div>
                <div 
                  v-else
                  class="absolute inset-0 bg-cover bg-center"
                  style="background-image: url('/assets/img/projects/remodeling-1.jpg')"
                ></div>

                <!-- Gradient vignette -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10"></div>

                <!-- Navigation Controls -->
                <button 
                  v-if="sliderImages.length > 1"
                  @click="prevSlide" 
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 z-20 border border-white/10 hover:border-transparent"
                  aria-label="Previous Slide"
                >
                  <Icon name="lucide:chevron-left" class="text-lg" />
                </button>
                <button 
                  v-if="sliderImages.length > 1"
                  @click="nextSlide" 
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 z-20 border border-white/10 hover:border-transparent"
                  aria-label="Next Slide"
                >
                  <Icon name="lucide:chevron-right" class="text-lg" />
                </button>

                <!-- Fullscreen Overlay Trigger -->
                <button 
                  @click="openFullscreen"
                  class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 z-20 border border-white/10 hover:border-transparent opacity-0 group-hover:opacity-100"
                  title="View Fullscreen"
                >
                  <Icon name="lucide:arrows-angle-expand" class="text-sm" />
                </button>
              </div>

              <!-- Interactive Thumbnails Grid -->
              <div v-if="sliderImages.length > 1" class="flex flex-wrap gap-3.5 justify-center">
                <button 
                  v-for="(img, idx) in sliderImages" 
                  :key="idx"
                  @click="activeSlideIdx = idx"
                  class="w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 bg-slate-100"
                  :class="idx === activeSlideIdx ? 'border-[#feb900] ring-4 ring-[#feb900]/10 scale-105 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'"
                >
                  <img :src="img" alt="Thumbnail" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Project Details Description -->
            <div class="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
              <h3 class="text-2xl md:text-3xl font-extrabold text-[#2e3135]">Project Narrative</h3>
              <div class="w-16 h-1 bg-[#feb900]"></div>
              
              <div 
                class="formatted-content text-gray-600 leading-relaxed text-justify text-sm md:text-base"
                v-html="data?.project?.description"
              ></div>

              <!-- Services tags -->
              <div class="pt-6 border-t border-gray-100" v-if="data?.project?.services">
                <span class="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-3">Provided Engineering Services</span>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="s in data.project.services.split(',')" 
                    :key="s" 
                    class="bg-gray-100 border border-gray-200/50 text-gray-700 text-xs font-bold px-3.5 py-2 rounded-full tracking-wide shadow-sm"
                  >
                    {{ s.trim() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Related Projects Grid -->
            <div class="space-y-6" v-if="data?.relatedProjects?.length">
              <h3 class="text-xl md:text-2xl font-extrabold text-[#2e3135]">Related Projects</h3>
              <div class="w-12 h-1 bg-[#feb900]"></div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  v-for="rel in data.relatedProjects" 
                  :key="rel.id" 
                  class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group flex flex-col justify-between h-[280px] hover:shadow-md transition-shadow duration-300"
                >
                  <div class="relative h-[160px] overflow-hidden bg-slate-900">
                    <img 
                      :src="rel.images && rel.images.length > 0 ? '/assets/img/projects/' + rel.images[0] : '/assets/img/projects/remodeling-1.jpg'" 
                      :alt="rel.title" 
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <NuxtLink :to="'/projects/' + rel.id" class="w-10 h-10 rounded-full bg-[#feb900] text-[#0f172a] flex items-center justify-center">
                        <Icon name="lucide:arrow-right" class="text-lg" />
                      </NuxtLink>
                    </div>
                  </div>
                  <div class="p-4 flex flex-col justify-between flex-grow">
                    <h4 class="font-bold text-sm text-[#2e3135] line-clamp-2 hover:text-[#feb900] transition-colors">
                      <NuxtLink :to="'/projects/' + rel.id">{{ rel.title }}</NuxtLink>
                    </h4>
                    <span class="text-[10px] font-bold text-gray-400 mt-2 truncate block">{{ rel.location || 'Bangladesh' }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Sidebar (Sticky Metadata Card) -->
          <div class="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div class="bg-white text-slate-800 border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden">
              <!-- Grid background details -->
              <div class="absolute inset-0 bg-gradient-to-tr from-slate-50 via-transparent to-slate-50/50 opacity-40 z-0"></div>
              
              <h3 class="font-extrabold text-lg tracking-wider uppercase border-b border-gray-100 pb-4 flex items-center gap-2 relative z-10 text-[#2e3135]">
                <Icon name="lucide:info" class="text-[#feb900]" />
                <span>Specifications</span>
              </h3>

              <div class="space-y-5 relative z-10">
                <!-- Categories -->
                <div class="flex items-start gap-4" v-if="data?.categories?.length">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:tags" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Categories</span>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span 
                        v-for="cat in data.categories" 
                        :key="cat.id"
                        class="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-gray-200/50"
                      >
                        {{ cat.name }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Sector -->
                <div class="flex items-start gap-4" v-if="data?.sector?.sector">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:layout-grid" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Sector</span>
                    <span class="text-sm font-bold text-slate-800">{{ data.sector.sector }}</span>
                  </div>
                </div>

                <!-- Client -->
                <div class="flex items-start gap-4" v-if="data?.client?.client_name">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:id-card" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Client</span>
                    <span class="text-sm font-bold text-slate-800">{{ data.client.client_name }}</span>
                  </div>
                </div>



                <!-- Project Cost -->
                <div class="flex items-start gap-4" v-if="data?.project?.project_cost">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:banknote" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Est. Cost</span>
                    <span class="text-sm font-bold text-slate-800">{{ data.project.project_cost }}</span>
                  </div>
                </div>

                <!-- Area -->
                <div class="flex items-start gap-4" v-if="data?.project?.area">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:scaling" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Total Area</span>
                    <span class="text-sm font-bold text-slate-800">{{ data.project.area }}</span>
                  </div>
                </div>

                <!-- Height -->
                <div class="flex items-start gap-4" v-if="data?.project?.height">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:building-2" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Height / Floors</span>
                    <span class="text-sm font-bold text-slate-800">{{ data.project.height }}</span>
                  </div>
                </div>

                <!-- Timeline -->
                <div class="flex items-start gap-4" v-if="formattedTimeline">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:calendar" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Timeline</span>
                    <span class="text-sm font-bold text-slate-800">{{ formattedTimeline }}</span>
                  </div>
                </div>

                <!-- Status -->
                <div class="flex items-start gap-4" v-if="data?.project?.status">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#feb900]">
                    <Icon name="lucide:check-circle-2" />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest block">Execution Status</span>
                    <span class="inline-block text-xs font-bold uppercase px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-md border border-emerald-500/25 mt-1">
                      {{ data.project.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pagination / Custom Project Navigation -->
              <div class="border-t border-gray-100 pt-6 flex items-center justify-between gap-4 relative z-10">
                <NuxtLink 
                  v-if="data?.prevProjectId"
                  :to="'/projects/' + data.prevProjectId" 
                  class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#feb900] transition-colors"
                  title="Previous Project"
                >
                  <Icon name="lucide:arrow-left" /> Prev
                </NuxtLink>
                <span v-else class="text-xs text-slate-400 cursor-not-allowed">First</span>

                <NuxtLink 
                  to="/projects" 
                  class="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#feb900] text-slate-500 hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 border border-gray-100 hover:border-transparent"
                  title="View All Projects"
                >
                  <Icon name="lucide:layout-grid" class="text-xs" />
                </NuxtLink>

                <NuxtLink 
                  v-if="data?.nextProjectId"
                  :to="'/projects/' + data.nextProjectId" 
                  class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#feb900] transition-colors"
                  title="Next Project"
                >
                  Next <Icon name="lucide:arrow-right" />
                </NuxtLink>
                <span v-else class="text-xs text-slate-400 cursor-not-allowed">Last</span>
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
import { ref, computed } from 'vue'

const route = useRoute()
const projectId = computed(() => parseInt(route.params.id))
const { data } = await useFetch(() => `/api/projects/${projectId.value}`)

const activeSlideIdx = ref(0)
const fullscreenOpen = ref(false)

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

const sliderImages = computed(() => {
  if (!data.value?.project || !data.value.project.images || !Array.isArray(data.value.project.images)) return []
  return data.value.project.images.map(name => `/assets/img/projects/${name}`)
})

const currentSlideUrl = computed(() => {
  if (!sliderImages.value.length) return '/assets/img/projects/remodeling-1.jpg'
  return sliderImages.value[activeSlideIdx.value]
})

const nextSlide = () => {
  activeSlideIdx.value = (activeSlideIdx.value + 1) % sliderImages.value.length
}

const prevSlide = () => {
  activeSlideIdx.value = (activeSlideIdx.value - 1 + sliderImages.value.length) % sliderImages.value.length
}

const openFullscreen = () => {
  fullscreenOpen.value = true
}

const closeFullscreen = () => {
  fullscreenOpen.value = false
}
</script>

<style scoped>
/* Scoped overrides if any */
</style>
