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

        <!-- Search & Advanced Search Bar -->
        <div class="max-w-4xl mx-auto mb-8" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <!-- Standard Search Bar (Preserved) -->
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

            <!-- Advanced Search Toggle Button (Visible if at least one filter enabled by Admin) -->
            <button 
              v-if="hasAnyFilterEnabled"
              @click="advancedOpen = !advancedOpen"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm cursor-pointer select-none"
              :class="advancedOpen || activeFilterCount > 0 
                ? 'bg-[#0f172a] text-[#feb900] border-[#0f172a] shadow-md ring-2 ring-[#feb900]/20' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#feb900] hover:text-[#0f172a]'"
            >
              <Icon name="lucide:sliders-horizontal" class="text-sm" />
              <span>Advanced Search</span>
              <span 
                v-if="activeFilterCount > 0" 
                class="min-w-5 h-5 px-1.5 rounded-full bg-[#feb900] text-[#0f172a] text-[10px] font-black flex items-center justify-center"
              >
                {{ activeFilterCount }}
              </span>
              <Icon :name="advancedOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="text-xs transition-transform" />
            </button>
          </div>

          <!-- Advanced Search Filter Panel -->
          <Transition name="expand">
            <div 
              v-if="advancedOpen && hasAnyFilterEnabled" 
              class="mt-4 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/5"
            >
              <div class="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#feb900]">
                    <Icon name="lucide:filter" class="text-sm" />
                  </div>
                  <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Detailed Project Filters
                  </h3>
                  <span v-if="activeFilterCount > 0" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {{ activeFilterCount }} active
                  </span>
                </div>
                <button 
                  v-if="activeFilterCount > 0 || searchQuery"
                  @click="clearAllFilters"
                  class="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="lucide:rotate-ccw" class="text-xs" />
                  <span>Reset All</span>
                </button>
              </div>

              <!-- Filter Grid (Responsive: 1 col on mobile, 2 col on md, 3 col on lg) -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                <!-- 1. Sector Filter -->
                <div v-if="filtersConfig.sector" class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="lucide:layers" class="text-[#feb900] text-sm" />
                    <span>Sector</span>
                  </label>
                  <select 
                    v-model="advFilters.sectorId"
                    class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                  >
                    <option value="all">All Sectors ({{ getProjectCount('all') }})</option>
                    <option 
                      v-for="s in activeSectors" 
                      :key="s.id" 
                      :value="s.id"
                    >
                      {{ s.sector }} ({{ getProjectCount(s.id) }})
                    </option>
                  </select>
                </div>

                <!-- 2. Category Filter (Multi-Select) -->
                <div v-if="filtersConfig.category" class="space-y-1.5 relative category-multiselect-container">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <Icon name="lucide:tag" class="text-[#feb900] text-sm" />
                      <span>Category</span>
                    </span>
                    <span v-if="advFilters.categoryIds.length > 0" class="text-[10px] text-amber-700 font-bold lowercase">
                      {{ advFilters.categoryIds.length }} selected
                    </span>
                  </label>

                  <!-- Dropdown Trigger Button -->
                  <button
                    type="button"
                    @click.stop="catDropdownOpen = !catDropdownOpen"
                    class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-left font-medium flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:border-[#feb900] focus:bg-white"
                    :class="{ 'border-[#feb900] ring-2 ring-[#feb900]/20 bg-white': catDropdownOpen, 'text-slate-800 font-bold': advFilters.categoryIds.length > 0, 'text-slate-500': advFilters.categoryIds.length === 0 }"
                  >
                    <span class="truncate pr-2">{{ categoryButtonLabel }}</span>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span 
                        v-if="advFilters.categoryIds.length > 0"
                        @click.stop="clearCategories"
                        class="w-4 h-4 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center text-[10px] transition-colors"
                        title="Clear categories"
                      >
                        ✕
                      </span>
                      <Icon :name="catDropdownOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="text-xs text-slate-400" />
                    </div>
                  </button>

                  <!-- Dropdown Popover Menu -->
                  <div
                    v-if="catDropdownOpen"
                    @click.stop
                    class="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-slate-900/10 p-3 space-y-2.5 min-w-[260px]"
                  >
                    <!-- Search input inside dropdown -->
                    <div class="relative">
                      <Icon name="lucide:search" class="absolute left-3 top-2.5 text-xs text-slate-400" />
                      <input
                        v-model="catSearchText"
                        type="text"
                        placeholder="Search categories..."
                        class="w-full bg-slate-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:bg-white"
                      />
                    </div>

                    <!-- Actions Bar (Select All / Clear) -->
                    <div class="flex items-center justify-between text-[11px] font-bold px-1 pt-0.5 border-b border-gray-100 pb-1.5 text-slate-500">
                      <button
                        type="button"
                        @click="selectAllCategories"
                        class="hover:text-amber-600 transition-colors cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        @click="clearCategories"
                        class="hover:text-rose-500 transition-colors cursor-pointer"
                        :disabled="advFilters.categoryIds.length === 0"
                        :class="{ 'opacity-40 cursor-not-allowed': advFilters.categoryIds.length === 0 }"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <!-- Scrollable Category List with Checkboxes -->
                    <div class="max-h-[160px] overflow-y-auto space-y-0.5 pr-2 category-scroll-container">
                      <div
                        v-if="filteredCategoryOptions.length === 0"
                        class="py-4 text-center text-xs text-slate-400"
                      >
                        No categories found
                      </div>

                      <label
                        v-for="c in filteredCategoryOptions"
                        :key="c.id"
                        class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none transition-colors text-xs"
                        :class="{ 'bg-amber-50/60 font-semibold text-amber-950': isCategorySelected(c.id), 'text-slate-700': !isCategorySelected(c.id) }"
                      >
                        <input
                          type="checkbox"
                          :checked="isCategorySelected(c.id)"
                          @change="toggleCategory(c.id)"
                          class="w-4 h-4 rounded text-[#feb900] accent-[#feb900] border-gray-300 focus:ring-[#feb900] cursor-pointer"
                        />
                        <span class="truncate flex-1">{{ c.name }}</span>
                        <span v-if="c.count" class="text-[10px] text-slate-400 font-semibold flex-shrink-0">({{ c.count }})</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 3. Year Filter -->
                <div v-if="filtersConfig.year" class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="lucide:calendar" class="text-[#feb900] text-sm" />
                    <span>Year</span>
                  </label>
                  <select 
                    v-model="advFilters.year"
                    class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                  >
                    <option value="all">Any Year</option>
                    <option 
                      v-for="yr in data?.availableYears || []" 
                      :key="yr" 
                      :value="yr"
                    >
                      {{ yr }}
                    </option>
                  </select>
                </div>

                <!-- 4. Project Status Filter (Radio Buttons) -->
                <div v-if="filtersConfig.status" class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="lucide:check-circle-2" class="text-[#feb900] text-sm" />
                    <span>Project Status</span>
                  </label>
                  <div class="flex flex-wrap items-center gap-2 pt-0.5">
                    <label 
                      class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none text-xs"
                      :class="advFilters.status === 'all' 
                        ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-2xs' 
                        : 'bg-slate-50/80 border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-white'"
                    >
                      <input 
                        type="radio" 
                        name="project_status" 
                        value="all" 
                        v-model="advFilters.status" 
                        class="w-3.5 h-3.5 accent-[#feb900] text-[#feb900] cursor-pointer"
                      />
                      <span>All</span>
                    </label>

                    <label 
                      class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none text-xs"
                      :class="advFilters.status === 'Completed' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs' 
                        : 'bg-slate-50/80 border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-white'"
                    >
                      <input 
                        type="radio" 
                        name="project_status" 
                        value="Completed" 
                        v-model="advFilters.status" 
                        class="w-3.5 h-3.5 accent-emerald-600 text-emerald-600 cursor-pointer"
                      />
                      <span class="inline-flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Completed
                      </span>
                    </label>

                    <label 
                      class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none text-xs"
                      :class="advFilters.status === 'Ongoing' 
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs' 
                        : 'bg-slate-50/80 border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-white'"
                    >
                      <input 
                        type="radio" 
                        name="project_status" 
                        value="Ongoing" 
                        v-model="advFilters.status" 
                        class="w-3.5 h-3.5 accent-amber-500 text-amber-500 cursor-pointer"
                      />
                      <span class="inline-flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Ongoing
                      </span>
                    </label>
                  </div>
                </div>

                <!-- 5. Contract Value Range Filter -->
                <div v-if="filtersConfig.contract_value" class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <Icon name="lucide:file-text" class="text-[#feb900] text-sm" />
                      <span>Contract Value</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium lowercase">min — max</span>
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="relative">
                      <input 
                        v-model="advFilters.minContractValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Min Value"
                        class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                    <div class="relative">
                      <input 
                        v-model="advFilters.maxContractValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Max Value"
                        class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <!-- 6. Project Value Range Filter -->
                <div v-if="filtersConfig.project_value" class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <Icon name="lucide:banknote" class="text-[#feb900] text-sm" />
                      <span>Project Value</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium lowercase">min — max</span>
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="relative">
                      <input 
                        v-model="advFilters.minProjectValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Min Value"
                        class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                    <div class="relative">
                      <input 
                        v-model="advFilters.maxProjectValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Max Value"
                        class="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <!-- Filter Panel Footer -->
              <div class="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span>
                  Showing <strong class="text-slate-800">{{ data?.filteredTotal || 0 }}</strong> matching projects
                </span>
                <div class="flex items-center gap-2">
                  <button 
                    @click="clearAllFilters" 
                    class="px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 text-slate-600 font-bold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button 
                    @click="advancedOpen = false" 
                    class="px-4 py-2 rounded-full bg-[#0f172a] text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Done Filtering
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Active Filter Badges/Pills Bar -->
          <div v-if="activeFilterBadges.length > 0" class="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Active:</span>
            <span 
              v-for="badge in activeFilterBadges" 
              :key="badge.key"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs"
            >
              <span>{{ badge.label }}</span>
              <button 
                @click="badge.clear()" 
                class="hover:text-rose-600 focus:outline-none cursor-pointer"
                title="Remove filter"
              >
                <Icon name="lucide:x" class="text-xs" />
              </button>
            </span>
            <button 
              @click="clearAllFilters" 
              class="text-xs font-bold text-slate-500 hover:text-rose-600 underline ml-2 transition-colors cursor-pointer"
            >
              Reset all
            </button>
          </div>
        </div>

        <!-- Sector Filters (Pills Bar across top - Preserved) -->
        <div class="flex justify-center mb-16" data-aos="fade-up">
          <ul class="flex flex-wrap justify-center gap-2 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
            <li 
              @click="setSector('all')"
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
              v-for="sec in activeSectors" 
              :key="sec.id" 
              @click="setSector(sec.id)"
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
                    class="w-12 h-12 rounded-full bg-white/10 hover:bg-[#feb900] text-white hover:text-[#0f172a] flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-transparent scale-90 group-hover:scale-100 cursor-pointer"
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
          <div v-if="filteredProjects.length === 0" class="col-span-full py-16 flex flex-col items-center justify-center text-gray-400">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
              <Icon name="lucide:search" class="text-3xl" />
            </div>
            <h3 class="text-base font-bold text-gray-700 mb-1">No Projects Found</h3>
            <p class="text-xs font-medium text-gray-500 max-w-sm text-center">
              No projects match all of your currently selected search and filter criteria. Try adjusting or clearing some filters.
            </p>
            <button 
              @click="clearAllFilters" 
              class="mt-4 px-5 py-2 rounded-full bg-[#feb900] text-[#0f172a] text-xs font-bold uppercase tracking-wider hover:bg-amber-500 transition-colors cursor-pointer shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="data?.totalPages > 1" class="flex justify-center items-center mt-12 gap-2" data-aos="fade-up">
          <button 
            @click="page > 1 && page--" 
            :disabled="page === 1"
            class="w-10 h-10 flex justify-center items-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-[#feb900] hover:text-[#0f172a] hover:border-[#feb900] transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 cursor-pointer"
          >
            <Icon name="lucide:chevron-left" />
          </button>
          
          <button 
            v-for="p in data.totalPages" :key="p"
            @click="page = p"
            class="w-10 h-10 flex justify-center items-center rounded-full border transition-colors font-semibold text-sm cursor-pointer"
            :class="page === p ? 'bg-[#0f172a] border-[#0f172a] text-[#feb900]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'"
          >
            {{ p }}
          </button>

          <button 
            @click="page < data.totalPages && page++" 
            :disabled="page === data.totalPages"
            class="w-10 h-10 flex justify-center items-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-[#feb900] hover:text-[#0f172a] hover:border-[#feb900] transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 cursor-pointer"
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
        class="absolute top-6 right-6 text-white text-3xl hover:text-[#feb900] focus:outline-none bg-white/10 hover:bg-white/25 rounded-full w-12 h-12 flex items-center justify-center transition-colors cursor-pointer"
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
            <p class="text-xs text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
              {{ lightboxProject.description || lightboxProject.services_rendered || 'No detailed description available for this project.' }}
            </p>
          </div>

          <div class="border-t border-white/10 pt-4 space-y-2 text-xs text-gray-400">
            <div class="flex items-center gap-2" v-if="lightboxProject.location">
              <Icon name="lucide:map-pin" class="text-[#feb900]" />
              <span>{{ lightboxProject.location }}</span>
            </div>
            <div class="flex items-center gap-2" v-if="lightboxProject.status">
              <Icon name="lucide:check-circle-2" class="text-[#feb900]" />
              <span>Status: <strong class="text-white">{{ lightboxProject.status }}</strong></span>
            </div>
            <div class="flex items-center gap-2" v-if="lightboxProject.project_cost">
              <Icon name="lucide:banknote" class="text-[#feb900]" />
              <span>Project Value: <strong class="text-white">{{ lightboxProject.project_cost }}</strong></span>
            </div>
          </div>

          <NuxtLink 
            :to="'/projects/' + lightboxProject.id" 
            class="w-full text-center py-3 bg-[#feb900] text-[#0f172a] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-colors"
          >
            View Complete Overview
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Portfolio Projects - Cozmic Technology',
  meta: [
    { name: 'description', content: 'Explore Cozmic Technology\'s portfolio of successful engineering projects including geotechnical investigations, structural designs, and construction management across Bangladesh.' },
    { property: 'og:title', content: 'Project Portfolio - Cozmic Technology' },
  ]
})

// Fetch Admin Panel Advanced Search Configuration
const { data: configRes } = await useFetch('/api/advanced-search-config')

const filtersConfig = computed(() => ({
  sector: configRes.value?.filters?.sector ?? true,
  category: configRes.value?.filters?.category ?? true,
  year: configRes.value?.filters?.year ?? true,
  status: configRes.value?.filters?.status ?? true,
  contract_value: configRes.value?.filters?.contract_value ?? true,
  project_value: configRes.value?.filters?.project_value ?? true
}))

const hasAnyFilterEnabled = computed(() => {
  return Object.values(filtersConfig.value).some(Boolean)
})

const advancedOpen = ref(false)
const page = ref(1)
const activeFilter = ref('all') // Sector pills filter
const searchQuery = ref('')
const debouncedSearch = ref('')

// Detailed Advanced Search Filter State
const advFilters = reactive({
  sectorId: 'all',
  categoryIds: [],
  year: 'all',
  status: 'all',
  minContractValue: '',
  maxContractValue: '',
  minProjectValue: '',
  maxProjectValue: ''
})

// Category Multi-Select State & Helpers
const catDropdownOpen = ref(false)
const catSearchText = ref('')

// Only display sectors that have at least 1 associated project (count > 0)
const activeSectors = computed(() => {
  return (data.value?.sectors || []).filter(sec => getProjectCount(sec.id) > 0)
})

// Only display categories that have at least 1 associated project (count > 0)
const activeCategories = computed(() => {
  return (data.value?.categories || []).filter(cat => (cat.count ?? 0) > 0)
})

const filteredCategoryOptions = computed(() => {
  const list = activeCategories.value
  if (!catSearchText.value.trim()) return list
  const q = catSearchText.value.toLowerCase().trim()
  return list.filter(c => c.name && c.name.toLowerCase().includes(q))
})

const toggleCategory = (id) => {
  const idx = advFilters.categoryIds.indexOf(id)
  if (idx > -1) {
    advFilters.categoryIds.splice(idx, 1)
  } else {
    advFilters.categoryIds.push(id)
  }
}

const isCategorySelected = (id) => {
  return advFilters.categoryIds.includes(id)
}

const selectAllCategories = () => {
  const allIds = (data.value?.categories || []).map(c => c.id)
  advFilters.categoryIds = [...allIds]
}

const clearCategories = () => {
  advFilters.categoryIds = []
}

const categoryButtonLabel = computed(() => {
  if (advFilters.categoryIds.length === 0) return 'All Categories'
  if (advFilters.categoryIds.length === 1) {
    const c = data.value?.categories?.find(cat => cat.id === advFilters.categoryIds[0])
    return c ? c.name : '1 Category'
  }
  if (advFilters.categoryIds.length === 2) {
    const names = advFilters.categoryIds
      .map(id => data.value?.categories?.find(cat => cat.id === id)?.name)
      .filter(Boolean)
    return names.join(', ')
  }
  return `${advFilters.categoryIds.length} Categories Selected`
})

// Close dropdown on click outside
if (process.client) {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.category-multiselect-container')) {
      catDropdownOpen.value = false
    }
  })
}

// Keep activeFilter (pills) and advFilters.sectorId in sync
const setSector = (secId) => {
  activeFilter.value = secId
  advFilters.sectorId = secId
  page.value = 1
}

watch(() => advFilters.sectorId, (newSec) => {
  if (activeFilter.value !== newSec) {
    activeFilter.value = newSec
    page.value = 1
  }
})

// Debounce text search
let searchTimeout
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal
    page.value = 1
  }, 400)
})

// Reset page on filter changes
watch(() => [
  advFilters.categoryIds.slice(),
  advFilters.year,
  advFilters.status,
  advFilters.minContractValue,
  advFilters.maxContractValue,
  advFilters.minProjectValue,
  advFilters.maxProjectValue
], () => {
  page.value = 1
}, { deep: true })

// Query Params for API
const queryParams = computed(() => {
  const params = {
    page: page.value,
    limit: 12,
    search: debouncedSearch.value,
    sectorId: activeFilter.value !== 'all' ? activeFilter.value : undefined
  }

  if (filtersConfig.value.category && advFilters.categoryIds.length > 0) {
    params.categoryIds = advFilters.categoryIds.join(',')
  }
  if (filtersConfig.value.year && advFilters.year !== 'all') {
    params.year = advFilters.year
  }
  if (filtersConfig.value.status && advFilters.status !== 'all') {
    params.status = advFilters.status
  }
  if (filtersConfig.value.contract_value) {
    if (advFilters.minContractValue !== '') params.minContractValue = advFilters.minContractValue
    if (advFilters.maxContractValue !== '') params.maxContractValue = advFilters.maxContractValue
  }
  if (filtersConfig.value.project_value) {
    if (advFilters.minProjectValue !== '') params.minProjectValue = advFilters.minProjectValue
    if (advFilters.maxProjectValue !== '') params.maxProjectValue = advFilters.maxProjectValue
  }

  return params
})

const { data, pending } = await useFetch('/api/projects', {
  query: queryParams,
  deep: false
})

const lightboxProject = ref(null)

const filteredProjects = computed(() => {
  return data.value?.projects || []
})

// Count how many advanced filters are actively applied
const activeFilterCount = computed(() => {
  let count = 0
  if (filtersConfig.value.sector && advFilters.sectorId !== 'all') count++
  if (filtersConfig.value.category && advFilters.categoryIds.length > 0) count++
  if (filtersConfig.value.year && advFilters.year !== 'all') count++
  if (filtersConfig.value.status && advFilters.status !== 'all') count++
  if (filtersConfig.value.contract_value && (advFilters.minContractValue !== '' || advFilters.maxContractValue !== '')) count++
  if (filtersConfig.value.project_value && (advFilters.minProjectValue !== '' || advFilters.maxProjectValue !== '')) count++
  return count
})

// Badges list for the active filter pills
const activeFilterBadges = computed(() => {
  const badges = []

  if (filtersConfig.value.sector && advFilters.sectorId !== 'all') {
    const sec = data.value?.sectors?.find(s => s.id === advFilters.sectorId)
    badges.push({
      key: 'sector',
      label: `Sector: ${sec?.sector || advFilters.sectorId}`,
      clear: () => setSector('all')
    })
  }

  if (filtersConfig.value.category && advFilters.categoryIds.length > 0) {
    advFilters.categoryIds.forEach(catId => {
      const cat = data.value?.categories?.find(c => c.id === catId)
      badges.push({
        key: `category_${catId}`,
        label: `Category: ${cat?.name || catId}`,
        clear: () => { toggleCategory(catId) }
      })
    })
  }

  if (filtersConfig.value.year && advFilters.year !== 'all') {
    badges.push({
      key: 'year',
      label: `Year: ${advFilters.year}`,
      clear: () => { advFilters.year = 'all' }
    })
  }

  if (filtersConfig.value.status && advFilters.status !== 'all') {
    badges.push({
      key: 'status',
      label: `Status: ${advFilters.status}`,
      clear: () => { advFilters.status = 'all' }
    })
  }

  if (filtersConfig.value.contract_value && (advFilters.minContractValue !== '' || advFilters.maxContractValue !== '')) {
    let lbl = 'Contract: '
    if (advFilters.minContractValue !== '' && advFilters.maxContractValue !== '') {
      lbl += `${advFilters.minContractValue} – ${advFilters.maxContractValue}`
    } else if (advFilters.minContractValue !== '') {
      lbl += `≥ ${advFilters.minContractValue}`
    } else {
      lbl += `≤ ${advFilters.maxContractValue}`
    }
    badges.push({
      key: 'contract_value',
      label: lbl,
      clear: () => {
        advFilters.minContractValue = ''
        advFilters.maxContractValue = ''
      }
    })
  }

  if (filtersConfig.value.project_value && (advFilters.minProjectValue !== '' || advFilters.maxProjectValue !== '')) {
    let lbl = 'Project Val: '
    if (advFilters.minProjectValue !== '' && advFilters.maxProjectValue !== '') {
      lbl += `${advFilters.minProjectValue} – ${advFilters.maxProjectValue}`
    } else if (advFilters.minProjectValue !== '') {
      lbl += `≥ ${advFilters.minProjectValue}`
    } else {
      lbl += `≤ ${advFilters.maxProjectValue}`
    }
    badges.push({
      key: 'project_value',
      label: lbl,
      clear: () => {
        advFilters.minProjectValue = ''
        advFilters.maxProjectValue = ''
      }
    })
  }

  return badges
})

const clearAllFilters = () => {
  searchQuery.value = ''
  debouncedSearch.value = ''
  activeFilter.value = 'all'
  advFilters.sectorId = 'all'
  advFilters.categoryIds = []
  advFilters.year = 'all'
  advFilters.status = 'all'
  advFilters.minContractValue = ''
  advFilters.maxContractValue = ''
  advFilters.minProjectValue = ''
  advFilters.maxProjectValue = ''
  page.value = 1
}

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
/* Expand / Collapse Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

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

/* Category Multi-select Scrollbar */
.category-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f8fafc;
}

.category-scroll-container::-webkit-scrollbar {
  width: 5px;
}

.category-scroll-container::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 9999px;
}

.category-scroll-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}

.category-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #feb900;
}
</style>
