<template>
  <div class="bg-white min-h-screen text-[#090402] pb-24 font-sans selection:bg-[#feb900]/20 selection:text-slate-900">
    <!-- ======= Editorial Hero Header ======= -->
    <section class="pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
          {{ careers?.pageContent?.hero_eyebrow || 'Careers • Culture • Opportunities' }}
        </span>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#090402] leading-[1.12] tracking-tight mb-4">
          {{ careers?.homepage?.title9 || 'Join Our Engineering Team' }}
        </h1>
        <p class="text-neutral-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl font-normal">
          {{ cleanContent(careers?.homepage?.content9) || 'Explore fulfilling career opportunities with Cozmic Technology. We are always seeking visionary geotechnical engineers, architects, project leaders, and construction specialists across Bangladesh.' }}
        </p>

        <!-- Values / Highlights Strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
          <div v-for="(item, idx) in careerHighlights" :key="idx" class="space-y-1">
            <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">{{ item.label }}</span>
            <p class="text-xs sm:text-sm font-medium text-slate-800">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= Active Openings & Filter Controls ======= -->
    <section class="pt-10 sm:pt-14">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        
        <!-- Filter Tabs & Quick Search -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 sm:mb-12 border-b border-neutral-100">
          
          <!-- Status Filter Tabs -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="selectedStatus = 'all'"
              class="px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
              :class="selectedStatus === 'all'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'"
            >
              All Openings ({{ allJobs.length }})
            </button>
            <button
              v-for="status in activeStatuses"
              :key="status.name"
              type="button"
              @click="selectedStatus = status.name"
              class="px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
              :class="selectedStatus === status.name
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'"
            >
              {{ status.name }} ({{ status.count }})
            </button>
          </div>

          <!-- Minimalist Search Input -->
          <div class="relative w-full md:w-72 lg:w-80">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Icon name="lucide:search" class="text-sm" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by position or skill..."
              class="w-full pl-10 pr-9 py-2 border border-neutral-200 rounded-full bg-white text-slate-900 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
              title="Clear search"
            >
              <Icon name="lucide:x" class="text-xs" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex justify-center py-24">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-[#feb900]"></div>
        </div>

        <!-- Empty State When Filter Yields 0 Results -->
        <div v-else-if="filteredJobs.length === 0" class="py-20 text-center space-y-4 max-w-md mx-auto">
          <div class="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Icon name="lucide:briefcase" class="text-2xl" />
          </div>
          <div class="space-y-1">
            <h3 class="font-display text-xl font-normal text-slate-900">
              {{ searchQuery || selectedStatus !== 'all' ? 'No matching vacancies found' : 'No Open Positions Currently' }}
            </h3>
            <p class="text-xs text-neutral-500 leading-relaxed">
              {{ searchQuery || selectedStatus !== 'all' 
                ? 'Try adjusting your search criteria or clearing your filters to see all available roles.' 
                : 'We are currently not actively hiring for published roles, but we always welcome speculative applications from outstanding professionals.' }}
            </p>
          </div>
          <button
            v-if="searchQuery || selectedStatus !== 'all'"
            type="button"
            @click="resetFilters"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-slate-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Icon name="lucide:rotate-ccw" class="text-xs" />
            Reset all filters
          </button>
        </div>

        <!-- Open Roles Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div 
            v-for="job in filteredJobs" 
            :key="job.id"
            class="group bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xs"
          >
            <div>
              <!-- Header Row: Role Title & Employment Status -->
              <div class="flex items-start justify-between gap-4 mb-3">
                <h2 class="font-display text-2xl sm:text-[26px] font-normal text-slate-900 group-hover:text-[#feb900] transition-colors leading-snug">
                  <NuxtLink :to="'/career/' + job.id" class="focus:outline-none">
                    {{ job.post }}
                  </NuxtLink>
                </h2>
                <span class="shrink-0 px-3 py-1 bg-amber-500/10 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#feb900]/30">
                  {{ job.emp_status || job.employment_status || 'Full-Time' }}
                </span>
              </div>

              <!-- Metadata Chips Row -->
              <div class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-500 mb-5">
                <span class="flex items-center gap-1.5 font-medium text-slate-700">
                  <Icon name="lucide:map-pin" class="text-[#feb900]" /> {{ job.location || 'Dhaka, Bangladesh' }}
                </span>
                <span class="flex items-center gap-1.5 font-medium text-slate-700">
                  <Icon name="lucide:users" class="text-neutral-400" /> {{ job.vacancy }} {{ job.vacancy > 1 ? 'Openings' : 'Opening' }}
                </span>
                <span v-if="job.salary" class="flex items-center gap-1.5 font-medium text-slate-700">
                  <Icon name="lucide:wallet" class="text-neutral-400" /> {{ job.salary }}
                </span>
                <span v-if="job.experience" class="flex items-center gap-1.5 font-medium text-slate-700">
                  <Icon name="lucide:award" class="text-neutral-400" /> {{ job.experience }}
                </span>
              </div>

              <!-- Excerpt Description -->
              <p class="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                {{ stripHtml(cleanContent(job.description)) }}
              </p>
            </div>

            <!-- Footer: Deadline & Action Link -->
            <div class="flex items-center justify-between border-t border-neutral-100 pt-4 mt-auto">
              <span class="text-[11px] text-neutral-400 font-medium">
                Deadline: <span :class="isDeadlineUrgent(job.deadline) ? 'text-amber-600 font-semibold' : 'text-slate-700 font-semibold'">{{ formatDeadline(job.deadline) }}</span>
              </span>
              <NuxtLink 
                :to="'/career/' + job.id" 
                class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 hover:text-[#feb900] transition-colors group/link"
              >
                <span>View Details</span>
                <Icon name="lucide:arrow-right" class="text-sm transition-transform duration-200 group-hover/link:translate-x-1" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- ======= Speculative Application Box ======= -->
        <div class="mt-16 sm:mt-20 border border-neutral-200/90 rounded-2xl p-8 sm:p-10 bg-neutral-50/60">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div class="lg:col-span-8 space-y-2">
              <span class="text-[11px] font-semibold tracking-wider text-[#feb900] uppercase">{{ careers?.pageContent?.speculative_eyebrow || 'Speculative Opportunities' }}</span>
              <h3 class="font-display text-2xl sm:text-3xl font-light text-slate-900 leading-snug">
                {{ careers?.pageContent?.speculative_heading || 'Don’t see the exact position you are looking for?' }}
              </h3>
              <p class="text-neutral-600 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                {{ careers?.pageContent?.speculative_body || 'We are always eager to meet talented geotechnical engineers, foundation consultants, CAD technicians, and project managers. Send your resume and portfolio directly to our recruitment desk.' }}
              </p>
            </div>
            <div class="lg:col-span-4 flex lg:justify-end">
              <a
                :href="'mailto:' + speculativeEmail + '?subject=' + encodeURIComponent('Speculative Application - Cozmic Technology')"
                class="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold tracking-wider uppercase transition-colors shadow-xs"
              >
                <Icon name="lucide:mail" class="text-sm text-[#feb900]" />
                <span>{{ careers?.pageContent?.speculative_button_label || 'Submit CV to Desk' }}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Career Openings | Cozmic Technology - Engineering Consultancy',
  meta: [
    { name: 'description', content: 'Explore exciting career opportunities at Cozmic Technology. Join our multidisciplinary engineering team across geotechnical, architectural, and project consultancy in Bangladesh.' },
    { property: 'og:title', content: 'Careers & Opportunities | Cozmic Technology' },
    { property: 'og:description', content: 'Explore careers at Cozmic Technology in geotechnical investigation and engineering consultancy.' }
  ]
})

const { data: careers, pending } = await useFetch('/api/career', { key: 'careers-list' })

const allJobs = computed(() => {
  return Array.isArray(careers.value?.data) ? careers.value.data : []
})

const careerHighlights = computed(() => careers.value?.pageContent?.highlights || [])
const speculativeEmail = computed(() => careers.value?.pageContent?.contact_email || 'career@cozmictech.com')

const selectedStatus = ref('all')
const searchQuery = ref('')

const activeStatuses = computed(() => {
  const counts = {}
  allJobs.value.forEach(job => {
    const status = job.emp_status || job.employment_status || 'Full-Time'
    counts[status] = (counts[status] || 0) + 1
  })
  return Object.keys(counts).map(status => ({
    name: status,
    count: counts[status]
  }))
})

const filteredJobs = computed(() => {
  let list = allJobs.value

  if (selectedStatus.value !== 'all') {
    list = list.filter(job => {
      const status = job.emp_status || job.employment_status || 'Full-Time'
      return status.toLowerCase() === selectedStatus.value.toLowerCase()
    })
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(job => {
      const titleMatch = (job.post || '').toLowerCase().includes(q)
      const descMatch = (job.description || '').toLowerCase().includes(q)
      const locMatch = (job.location || '').toLowerCase().includes(q)
      return titleMatch || descMatch || locMatch
    })
  }

  return list
})

const resetFilters = () => {
  selectedStatus.value = 'all'
  searchQuery.value = ''
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

const cleanContent = (str) => {
  if (!str) return ''
  return str.replace(/\uFFFD|\?\?/g, "'").trim()
}

const formatDeadline = (deadline) => {
  if (!deadline) return 'Open Until Filled'
  try {
    const date = new Date(deadline)
    if (isNaN(date.getTime())) return 'Open'
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return 'Open'
  }
}

const isDeadlineUrgent = (deadline) => {
  if (!deadline) return false
  try {
    const diff = new Date(deadline).getTime() - Date.now()
    return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000) // Less than 7 days
  } catch {
    return false
  }
}
</script>
