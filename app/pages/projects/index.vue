<template>
  <div class="bg-gray-50/50 min-h-screen pb-20">
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center relative overflow-hidden" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <!-- Ambient light effect -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0f172a]/95 z-0"></div>
      
      <div class="container mx-auto px-4 md:px-8 relative text-center z-10" data-aos="fade-down">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">Our Portfolio</h2>
        <p class="text-gray-300 max-w-2xl mx-auto mb-6 text-sm md:text-base font-medium">
          Explore our record of engineering excellence, geotechnical investigations, and architectural masterworks.
        </p>
        <ol class="flex justify-center items-center gap-2 text-xs md:text-sm text-[#feb900] font-semibold tracking-wider uppercase bg-black/30 backdrop-blur-md px-4 py-2 rounded-full w-fit mx-auto border border-white/10">
          <li><NuxtLink to="/" class="text-white/80 hover:text-[#feb900] transition-colors">Home</NuxtLink></li>
          <li class="text-white/40"><Icon name="lucide:chevron-right" class="text-[10px]" /></li>
          <li>Projects</li>
        </ol>
      </div>
    </div>

    <!-- ======= Projects Section ======= -->
    <section id="projects" class="py-16">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">

        <!-- Search Bar -->
        <div class="flex justify-center mb-8" data-aos="fade-up">
          <div class="relative w-full max-w-lg group">
            <span class="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400 group-focus-within:text-[#feb900] transition-colors">
              <Icon name="lucide:search" class="text-lg" />
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search projects by title, location, or services..." 
              class="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors focus:outline-none"
            >
              <Icon name="lucide:x-circle" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex justify-center mb-16" data-aos="fade-up">
          <ul class="flex flex-wrap justify-center gap-2 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
            <li 
              @click="activeFilter = 'all'"
              class="cursor-pointer px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
              :class="activeFilter === 'all' 
                ? 'bg-[#0f172a] text-white shadow-md' 
                : 'text-gray-500 hover:text-[#0f172a] hover:bg-gray-50'"
            >
              <span>All</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">
                {{ getProjectCount('all') }}
              </span>
            </li>
            <li 
              v-for="sec in data?.sectors || []" 
              :key="sec.id"
              @click="activeFilter = sec.id"
              class="cursor-pointer px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
              :class="activeFilter === sec.id 
                ? 'bg-[#0f172a] text-white shadow-md' 
                : 'text-gray-500 hover:text-[#0f172a] hover:bg-gray-50'"
            >
              <span>{{ sec.sector }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold" :class="activeFilter === sec.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">
                {{ getProjectCount(sec.id) }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Projects Grid -->
        <div :class="{'opacity-50 pointer-events-none': pending}" class="transition-opacity duration-300">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
          <TransitionGroup name="portfolio-grid">
            <div 
              v-for="project in filteredProjects" 
              :key="project.id" 
              v-memo="[project.id]"
              class="portfolio-card group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between h-[380px]"
            >
              <!-- Card Top: Image with overlay -->
              <div class="relative overflow-hidden h-[280px] w-full bg-slate-900 flex-shrink-0">
                <img 
                  :src="project.images && project.images.length > 0 ? '/assets/img/projects/' + project.images[0] : '/assets/img/projects/remodeling-1.jpg'" 
                  :alt="project.title" 
                  width="400" height="240"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-80"
                />
                
                <!-- Quick stats badges (always visible on top of image) -->
                <div class="absolute top-4 inset-x-4 flex justify-between items-start z-10">
                  <div class="flex flex-wrap gap-1 max-w-[70%]">
                    <span 
                      v-for="pc in project.project_categories || []" 
                      :key="pc.category_id"
                      class="bg-[#feb900] text-[#0f172a] text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm"
                    >
                      {{ getCategoryName(pc.category_id) }}
                    </span>
                  </div>
                  <span 
                    class="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex-shrink-0"
                    :class="project.status?.toLowerCase() === 'completed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'"
                  >
                    {{ project.status }}
                  </span>
                </div>

                <!-- Hover Overlay with action buttons -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-0">
                  <button 
                    @click="openLightbox(project)"
                    class="w-12 h-12 rounded-full bg-white/10 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-transparent scale-90 group-hover:scale-100"
                    title="Quick Zoom View"
                  >
                    <Icon name="lucide:zoom-in" class="text-xl" />
                  </button>
                  <NuxtLink 
                    :to="'/projects/' + project.id" 
                    class="w-12 h-12 rounded-full bg-white/10 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-transparent scale-90 group-hover:scale-100"
                    title="View Project Details"
                  >
                    <Icon name="lucide:arrow-right" class="text-xl" />
                  </NuxtLink>
                </div>
              </div>

              <!-- Card Bottom: Info -->
              <div class="p-4 flex flex-col justify-center flex-grow bg-white z-10">
                <div class="space-y-1.5">
                  <h4 class="text-lg font-bold text-[#2e3135] group-hover:text-[#feb900] transition-colors line-clamp-1">
                    <NuxtLink :to="'/projects/' + project.id">{{ project.title }}</NuxtLink>
                  </h4>
                  <p class="text-xs text-gray-500 flex items-center gap-1.5" v-if="project.location">
                    <Icon name="lucide:map-pin" class="text-[#feb900]" />
                    <span class="truncate">{{ project.location }}</span>
                  </p>
                </div>
              </div>
            </div>
          </TransitionGroup>
          
          <!-- No Results State -->
          <div v-if="filteredProjects.length === 0" class="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
            <Icon name="lucide:search" class="text-4xl mb-3 text-gray-300" />
            <p class="text-sm font-medium">No projects found matching your search criteria.</p>
            <button @click="searchQuery = ''; activeFilter = 'all'" class="mt-4 text-xs font-bold uppercase tracking-wider text-[#feb900] hover:text-amber-600 transition-colors">Clear Filters</button>
          </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="data?.totalPages > 1" class="flex justify-center items-center mt-12 gap-2" data-aos="fade-up">
          <button 
            @click="page > 1 && page--" 
            :disabled="page === 1"
            class="w-10 h-10 flex justify-center items-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-[#feb900] hover:text-[#0f172a] hover:border-[#feb900] transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200"
          >
            <Icon name="lucide:chevron-left" />
          </button>
          
          <button 
            v-for="p in data.totalPages" :key="p"
            @click="page = p"
            class="w-10 h-10 flex justify-center items-center rounded-full border transition-colors font-semibold text-sm"
            :class="page === p ? 'bg-[#0f172a] border-[#0f172a] text-[#feb900]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'"
          >
            {{ p }}
          </button>

          <button 
            @click="page < data.totalPages && page++" 
            :disabled="page === data.totalPages"
            class="w-10 h-10 flex justify-center items-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-[#feb900] hover:text-[#0f172a] hover:border-[#feb900] transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>

      </div>
    </section>

    <!-- Immersive Lightbox Modal -->
    <div 
      v-if="lightboxProject" 
      class="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 transition-all duration-300"
      @click="closeLightbox"
    >
      <button 
        class="absolute top-6 right-6 text-white text-3xl hover:text-[#feb900] focus:outline-none bg-white/10 hover:bg-white/25 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
        @click="closeLightbox"
      >
        <Icon name="lucide:x" />
      </button>

      <div class="bg-gray-900 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row border border-white/10" @click.stop>
        <!-- Modal Left: Image -->
        <div class="md:w-3/5 h-[300px] md:h-[450px] bg-black relative">
          <img 
            :src="lightboxProject.images && lightboxProject.images.length > 0 ? '/assets/img/projects/' + lightboxProject.images[0] : '/assets/img/projects/remodeling-1.jpg'" 
            :alt="lightboxProject.title" 
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Modal Right: Details -->
        <div class="md:w-2/5 p-8 flex flex-col justify-between text-white space-y-6">
          <div class="space-y-4">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="pc in lightboxProject.project_categories || []" 
                :key="pc.category_id"
                class="bg-[#feb900] text-[#0f172a] text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm"
              >
                {{ getCategoryName(pc.category_id) }}
              </span>
            </div>
            <h3 class="text-2xl font-bold tracking-tight text-white leading-tight">
              {{ lightboxProject.title }}
            </h3>
            <div class="w-12 h-1 bg-[#feb900]"></div>
            
            <p class="text-sm text-gray-400 line-clamp-4 leading-relaxed">
              {{ lightboxProject.description?.replace(/<[^>]*>/g, '') }}
            </p>

            <ul class="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-white/10">
              <li class="flex items-center gap-2" v-if="lightboxProject.location">
                <Icon name="lucide:map-pin" class="text-[#feb900]" />
                <strong>Location:</strong> {{ lightboxProject.location }}
              </li>
              <li class="flex items-center gap-2" v-if="lightboxProject.status">
                <Icon name="lucide:check-circle-2" class="text-[#feb900]" />
                <strong>Status:</strong> {{ lightboxProject.status }}
              </li>
              <li class="flex items-center gap-2" v-if="lightboxProject.project_cost">
                <Icon name="lucide:banknote" class="text-[#feb900]" />
                <strong>Project Cost:</strong> {{ lightboxProject.project_cost }}
              </li>
            </ul>
          </div>

          <NuxtLink 
            :to="'/projects/' + lightboxProject.id"
            class="inline-block bg-[#feb900] hover:bg-[#ffc732] text-[#0f172a] font-bold text-center text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl w-full"
          >
            Explore Project In Detail
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// P15 — Page-specific SEO meta
useHead({
  title: 'Projects Portfolio | Cozmic Technology - Engineering Consultancy',
  meta: [
    { name: 'description', content: 'Explore Cozmic Technology\'s portfolio of successful engineering projects including geotechnical investigations, structural designs, and construction management across Bangladesh.' },
    { property: 'og:title', content: 'Project Portfolio - Cozmic Technology' },
  ]
})

const page = ref(1)
const activeFilter = ref('all')
const searchQuery = ref('')
const debouncedSearch = ref('')

let searchTimeout;
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal;
    page.value = 1; // reset page on new search
  }, 500);
});

// Reset page on filter change
watch(activeFilter, () => {
  page.value = 1;
})

const queryParams = computed(() => ({
  page: page.value,
  limit: 12,
  sectorId: activeFilter.value,
  search: debouncedSearch.value
}))

const { data, pending } = await useFetch('/api/projects', {
  query: queryParams,
  watch: [queryParams]
})

const lightboxProject = ref(null)

const filteredProjects = computed(() => {
  return data.value?.projects || []
})

const getProjectCount = (secId) => {
  if (secId === 'all') return data.value?.totalProjects || 0
  return data.value?.sectorCounts?.[String(secId)] || 0
}

const getCategoryName = (catId) => {
  const cat = data.value?.categories?.find(c => c.id === catId)
  return cat ? cat.name : 'Engineering'
}

const openLightbox = (project) => {
  lightboxProject.value = project
}

const closeLightbox = () => {
  lightboxProject.value = null
}
</script>

<style scoped>
/* Grid layout animation */
.portfolio-grid-enter-active,
.portfolio-grid-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.portfolio-grid-enter-from,
.portfolio-grid-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(15px);
}
.portfolio-grid-move {
  transition: transform 0.5s ease-out;
}
</style>
