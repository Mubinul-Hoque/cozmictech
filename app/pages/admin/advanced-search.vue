<template>
  <div class="space-y-8 font-sans pb-16">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          <NuxtLink to="/admin" class="hover:text-slate-600 transition-colors">Admin</NuxtLink>
          <Icon name="lucide:chevron-right" class="text-xs" />
          <span class="text-[#feb900]">Advanced Search</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <span>Advanced Search Configuration</span>
        </h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          Control which filter criteria are visible to visitors in the frontend Advanced Search panel
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          @click="saveConfig" 
          :disabled="saving"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <span v-if="saving" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent mr-1"></span>
          <Icon v-else name="lucide:check" class="text-base" />
          {{ saving ? 'Saving Changes...' : 'Save Configuration' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Filter Controls -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Controls Box -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Active Filter Criteria</h3>
              <p class="text-xs text-slate-400 mt-0.5">Toggle each filter to show or hide it on the public /projects search page.</p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                @click="setAll(true)"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-950 bg-amber-100/80 hover:bg-amber-100 border border-amber-300/70 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Icon name="lucide:check-check" class="text-sm text-amber-600" />
                Enable All (ON)
              </button>
              <button 
                type="button" 
                @click="setAll(false)"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Icon name="lucide:slash" class="text-xs text-slate-400" />
                Disable All (OFF)
              </button>
            </div>
          </div>

          <!-- Filter Cards List -->
          <div class="space-y-3.5">
            <div 
              v-for="filter in filterDefinitions" 
              :key="filter.key"
              @click="toggleFilter(filter.key)"
              @keydown.space.prevent="toggleFilter(filter.key)"
              @keydown.enter.prevent="toggleFilter(filter.key)"
              tabindex="0"
              class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#feb900]"
              :class="filters[filter.key] 
                ? 'bg-gradient-to-r from-amber-50/70 to-amber-50/20 border-amber-300 shadow-sm ring-1 ring-amber-300/40 hover:border-amber-400' 
                : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'"
            >
              <!-- Left: Icon & Description Details -->
              <div class="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                <div 
                  class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  :class="filters[filter.key] 
                    ? 'bg-[#feb900] text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-4 ring-amber-400/20 scale-105' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'"
                >
                  <Icon :name="filter.icon" class="text-xl" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h4 
                      class="text-sm font-bold transition-colors"
                      :class="filters[filter.key] ? 'text-slate-900 group-hover:text-amber-900' : 'text-slate-700 group-hover:text-slate-900'"
                    >
                      {{ filter.label }}
                    </h4>
                    <span 
                      class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors"
                      :class="filters[filter.key] 
                        ? 'bg-amber-100 text-amber-900 border-amber-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'"
                    >
                      {{ filter.badge }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed pr-2">
                    {{ filter.description }}
                  </p>
                </div>
              </div>

              <!-- Right: Explicit ON / OFF Switch Control -->
              <div class="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                <!-- State Pill Badge -->
                <div 
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200"
                  :class="filters[filter.key]
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'"
                >
                  <span 
                    class="w-2 h-2 rounded-full transition-all duration-200"
                    :class="filters[filter.key] ? 'bg-amber-500 ring-2 ring-amber-300 animate-pulse' : 'bg-slate-400'"
                  ></span>
                  <span>{{ filters[filter.key] ? 'ON' : 'OFF' }}</span>
                </div>

                <!-- Custom Toggle Switch -->
                <div 
                  class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out"
                  :class="filters[filter.key] ? 'bg-[#feb900] border-[#feb900]' : 'bg-slate-200 border-slate-300 group-hover:bg-slate-300'"
                  role="switch"
                  :aria-checked="filters[filter.key]"
                >
                  <span 
                    class="pointer-events-none inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out text-[11px]"
                    :class="filters[filter.key] ? 'translate-x-5 text-amber-700 font-bold' : 'translate-x-0 text-slate-400'"
                  >
                    <Icon 
                      :name="filters[filter.key] ? 'lucide:check' : 'lucide:x'" 
                      class="text-xs" 
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Info & Live Preview -->
      <div class="space-y-6">
        <!-- Live Preview Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Icon name="lucide:eye" class="text-amber-500 text-sm" />
            <span>Frontend Preview</span>
          </div>
          <h4 class="text-base font-extrabold text-slate-800 tracking-tight mb-2">Live Interface Preview</h4>
          <p class="text-xs text-slate-400 mb-5">
            This preview simulates the Advanced Search filter inputs currently enabled for visitors.
          </p>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Icon name="lucide:sliders-horizontal" class="text-[#feb900]" />
                Advanced Filters
              </span>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {{ enabledCount }} Active
              </span>
            </div>

            <!-- Simulated Enabled Filters -->
            <div v-if="enabledCount === 0" class="py-6 text-center text-xs text-slate-400 font-medium">
              No filters currently enabled. The Advanced Search button on the frontend will be hidden or show an empty state.
            </div>

            <div v-else class="space-y-2.5 text-xs">
              <div v-if="filters.sector" class="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span class="font-bold text-slate-700">Sector</span>
                <span class="text-slate-400 font-medium">All Sectors ▾</span>
              </div>
              <div v-if="filters.category" class="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span class="font-bold text-slate-700">Category</span>
                <span class="text-slate-400 font-medium">All Categories ▾</span>
              </div>
              <div v-if="filters.year" class="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span class="font-bold text-slate-700">Year</span>
                <span class="text-slate-400 font-medium">Any Year ▾</span>
              </div>
              <div v-if="filters.status" class="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span class="font-bold text-slate-700">Project Status</span>
                <div class="flex items-center gap-2 text-[10px]">
                  <span class="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> All
                  </span>
                  <span class="text-slate-500">Completed</span>
                  <span class="text-slate-500">Ongoing</span>
                </div>
              </div>
              <div v-if="filters.contract_value" class="bg-white px-3 py-2 rounded-xl border border-slate-200">
                <div class="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Contract Value</span>
                  <span class="text-[10px] text-amber-600">Min - Max</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div class="border border-slate-200 rounded px-2 py-1 bg-slate-50">Min Value</div>
                  <div class="border border-slate-200 rounded px-2 py-1 bg-slate-50">Max Value</div>
                </div>
              </div>
              <div v-if="filters.project_value" class="bg-white px-3 py-2 rounded-xl border border-slate-200">
                <div class="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Project Value</span>
                  <span class="text-[10px] text-amber-600">Min - Max</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div class="border border-slate-200 rounded px-2 py-1 bg-slate-50">Min Value</div>
                  <div class="border border-slate-200 rounded px-2 py-1 bg-slate-50">Max Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Documentation Card -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-sm">
          <div class="flex items-center gap-2 text-[#feb900] text-xs font-bold uppercase tracking-wider mb-2">
            <Icon name="lucide:info" />
            <span>Search Behavior Rules</span>
          </div>
          <h4 class="text-base font-bold text-white mb-2">How Filters Combine</h4>
          <ul class="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
            <li><strong class="text-white">Preserves Standard Search:</strong> Keyword search across title, location, services, and description continues to work alongside advanced filters.</li>
            <li><strong class="text-white">Logical AND:</strong> All selected criteria must match together (e.g. Sector: Power Plant AND Year: 2022 AND Status: Completed).</li>
            <li><strong class="text-white">Instant Updates:</strong> Saving here takes effect immediately on the public website without needing a build or database migration.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Advanced Search Settings | Admin Panel'
})

const toast = useToast()
const saving = ref(false)

const filterDefinitions = [
  {
    key: 'sector',
    label: 'Sector',
    description: 'Allows filtering projects by industry sector (e.g. Oil & Gas, Power Plant, Infrastructure).',
    icon: 'lucide:layers',
    badge: 'Dropdown'
  },
  {
    key: 'category',
    label: 'Category',
    description: 'Allows filtering projects by linked project categories.',
    icon: 'lucide:tag',
    badge: 'Dropdown'
  },
  {
    key: 'year',
    label: 'Year',
    description: 'Allows filtering projects by project completion / active timeline year.',
    icon: 'lucide:calendar',
    badge: 'Dropdown'
  },
  {
    key: 'status',
    label: 'Project Status',
    description: 'Allows filtering projects by lifecycle status (Completed or Ongoing).',
    icon: 'lucide:check-circle-2',
    badge: 'Radio Buttons'
  },
  {
    key: 'contract_value',
    label: 'Contract Value',
    description: 'Allows visitors to search for projects within a Minimum and Maximum contract value range.',
    icon: 'lucide:file-text',
    badge: 'Min - Max Range'
  },
  {
    key: 'project_value',
    label: 'Project Value',
    description: 'Allows visitors to search for projects within a Minimum and Maximum project value range.',
    icon: 'lucide:banknote',
    badge: 'Min - Max Range'
  }
]

const filters = reactive({
  sector: true,
  category: true,
  year: true,
  status: true,
  contract_value: true,
  project_value: true
})

const { data: configData, pending, refresh } = await useFetch('/api/admin/advanced-search-config')

watch(configData, (val) => {
  if (val?.filters) {
    Object.keys(filters).forEach(k => {
      if (k in val.filters) {
        filters[k] = val.filters[k]
      }
    })
  }
}, { immediate: true })

const enabledCount = computed(() => {
  return Object.values(filters).filter(Boolean).length
})

const toggleFilter = (key) => {
  filters[key] = !filters[key]
}

const setAll = (val) => {
  Object.keys(filters).forEach(k => {
    filters[k] = val
  })
}

const saveConfig = async () => {
  saving.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/advanced-search-config', {
      method: 'POST',
      body: { filters }
    })
    if (res?.success) {
      toast.success('Advanced search settings saved successfully!')
      refresh()
    } else {
      toast.error('Failed to save configuration.')
    }
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.statusMessage || 'An unexpected error occurred while saving.')
  } finally {
    saving.value = false
  }
}
</script>
