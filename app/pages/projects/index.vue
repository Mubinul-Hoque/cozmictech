<template>
  <div class="bg-white min-h-screen pb-20 text-[#090402]">
    <!-- ======= Minimal Projects Header (Left-aligned, matching reference design) ======= -->
    <section v-if="headerData.is_active" class="pt-32 sm:pt-36 pb-6 sm:pb-8">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        <p v-if="headerData.subtitle" class="text-xs uppercase tracking-widest text-[#feb900] font-bold mb-2">
          {{ headerData.subtitle }}
        </p>
        <h1 class="font-display text-4xl sm:text-5xl font-normal text-slate-950 tracking-tight">
          {{ headerData.title }}
        </h1>
        <p v-if="headerData.content" class="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal leading-relaxed whitespace-pre-line">
          {{ headerData.content }}
        </p>
      </div>
    </section>

    <!-- ======= Projects Section ======= -->
    <section id="projects" class="pb-16">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">

        <!-- Controls Row 1: Sector Tabs (Left) & Search Bar (Right) -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Sector Filter Tabs (Rectangular tabs with soft corners, matching reference) -->
          <div v-if="filtersConfig.sector" class="flex flex-wrap items-center gap-2">
            <button 
              type="button"
              @click="setSector('all')"
              class="px-5 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer"
              :class="activeFilter === 'all' 
                ? 'bg-black text-white shadow-xs' 
                : 'bg-white text-slate-700 border border-gray-200 hover:border-gray-300 hover:bg-slate-50'"
            >
              All
            </button>
            <button 
              v-for="sec in activeSectors" 
              :key="sec.id" 
              type="button"
              @click="setSector(sec.id)"
              class="px-5 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer"
              :class="activeFilter === sec.id 
                ? 'bg-black text-white shadow-xs' 
                : 'bg-white text-slate-700 border border-gray-200 hover:border-gray-300 hover:bg-slate-50'"
            >
              {{ sec.sector }}
            </button>
          </div>
          <div v-else></div>

          <!-- Search Bar (Right) -->
          <div class="relative w-full md:w-80 lg:w-96 group">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-[#feb900] transition-colors pointer-events-none">
              <Icon name="lucide:search" class="text-sm" />
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search projects by title, location, or services..." 
              class="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-gray-500 transition-colors focus:outline-none cursor-pointer"
            >
              <Icon name="lucide:x-circle" class="text-sm" />
            </button>
          </div>
        </div>

        <!-- Full-width Divider Line -->
        <hr class="border-gray-200 my-4" />

        <!-- Controls Row 2: Advanced Search Toggle (Left) & Projects Count (Right) -->
        <div class="flex items-center justify-between mb-4">
          <button 
            v-if="hasAnyFilterEnabled"
            type="button"
            @click="advancedOpen = !advancedOpen"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer select-none"
            :class="advancedOpen || activeFilterCount > 0 
              ? 'bg-black text-white border-black shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300'"
          >
            <Icon name="lucide:sliders-horizontal" class="text-xs" />
            <span>ADVANCED SEARCH</span>
            <span 
              v-if="activeFilterCount > 0" 
              class="min-w-4 h-4 px-1 rounded-full bg-[#feb900] text-slate-950 text-[9px] font-black flex items-center justify-center"
            >
              {{ activeFilterCount }}
            </span>
            <Icon :name="advancedOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="text-xs transition-transform" />
          </button>
          <div v-else></div>

          <!-- Project Count on Right -->
          <span class="text-xs sm:text-sm text-slate-500 font-medium select-none">
            {{ data?.filteredTotal ?? data?.totalProjects ?? 0 }} projects
          </span>
        </div>

        <!-- Advanced Search Filter Panel (Drawer directly beneath) -->
        <Transition name="expand">
          <div 
            v-if="advancedOpen && hasAnyFilterEnabled" 
            class="mb-6 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-900/5"
          >
            <!-- Filter Items Row (Responsive: single horizontal row on lg, 2 cols on sm, 1 col on mobile) -->
            <div class="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center gap-3">
                
                <!-- 1. Sector Filter -->
                <div v-if="filtersConfig.sector" class="flex-1 min-w-0 w-full">
                  <select 
                    v-model="advFilters.sectorId"
                    class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-3.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="all">Sector (All)</option>
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
                <div v-if="filtersConfig.category" class="relative category-multiselect-container flex-1 min-w-0 w-full">
                  <!-- Dropdown Trigger Button -->
                  <button
                    type="button"
                    @click.stop="catDropdownOpen = !catDropdownOpen"
                    class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-3.5 text-xs text-left font-medium flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:border-[#feb900] focus:bg-white"
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
                    class="category-dropdown-popover absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-slate-900/20 p-3.5 space-y-2.5 min-w-[270px]"
                    style="background-color: #ffffff !important; opacity: 1 !important; isolation: isolate;"
                  >
                    <!-- Search input inside dropdown -->
                    <div class="relative">
                      <Icon name="lucide:search" class="absolute left-3 top-2.5 text-xs text-slate-400" />
                      <input
                        v-model="catSearchText"
                        type="text"
                        placeholder="Search categories..."
                        class="w-full bg-slate-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:bg-white"
                        style="background-color: #f8fafc !important;"
                      />
                    </div>

                    <!-- Actions Bar (Select All / Clear) -->
                    <div class="flex items-center justify-between text-[11px] font-bold px-1 pt-0.5 border-b border-gray-100 pb-1.5 text-slate-500" style="background-color: #ffffff !important;">
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
                    <div class="max-h-[180px] overflow-y-auto space-y-1.5 pr-1.5 category-scroll-container" style="background-color: #ffffff !important;">
                      <div
                        v-if="filteredCategoryOptions.length === 0"
                        class="py-4 text-center text-xs text-slate-400"
                      >
                        No categories found
                      </div>

                      <label
                        v-for="c in filteredCategoryOptions"
                        :key="c.id"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer select-none transition-all text-xs border"
                        :class="isCategorySelected(c.id) 
                          ? 'bg-amber-100 border-amber-300 font-bold text-amber-950 shadow-xs' 
                          : 'bg-white hover:bg-slate-50 border-gray-200 text-slate-700'"
                        :style="{ backgroundColor: isCategorySelected(c.id) ? '#fef3c7 !important' : '#ffffff !important' }"
                      >
                        <input
                          type="checkbox"
                          :checked="isCategorySelected(c.id)"
                          @change="toggleCategory(c.id)"
                          class="w-4 h-4 rounded text-[#feb900] accent-[#feb900] border-gray-300 focus:ring-[#feb900] cursor-pointer shrink-0"
                        />
                        <span class="truncate flex-1">{{ c.name }}</span>
                        <span v-if="c.count" class="text-[10px] font-semibold flex-shrink-0" :class="isCategorySelected(c.id) ? 'text-amber-800' : 'text-slate-400'">({{ c.count }})</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 3. Year Filter -->
                <div v-if="filtersConfig.year" class="flex-1 min-w-0 w-full">
                  <select 
                    v-model="advFilters.year"
                    class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-3.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="all">Year (All)</option>
                    <option 
                      v-for="yr in data?.availableYears || []" 
                      :key="yr" 
                      :value="yr"
                    >
                      {{ yr }}
                    </option>
                  </select>
                </div>

                <!-- 4. Project Status Filter with Minimal Radio Buttons & Reset Button Beside It -->
                <div v-if="filtersConfig.status" class="flex-1 min-w-0 w-full">
                  <div class="flex items-center gap-2">
                    <!-- Status Item's Box (Only contains status options) -->
                    <div class="flex-1 flex items-center justify-around sm:justify-start gap-3 h-[42px] px-3.5 bg-slate-50 border border-gray-200 rounded-xl">
                      <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                        <input 
                          type="radio" 
                          name="project_status" 
                          value="Completed" 
                          :checked="advFilters.status === 'Completed'"
                          @click="toggleStatus('Completed')"
                          class="w-3.5 h-3.5 text-emerald-600 accent-emerald-600 cursor-pointer"
                        />
                        <span>Completed</span>
                      </label>
                      <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                        <input 
                          type="radio" 
                          name="project_status" 
                          value="Ongoing" 
                          :checked="advFilters.status === 'Ongoing'"
                          @click="toggleStatus('Ongoing')"
                          class="w-3.5 h-3.5 text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <span>Ongoing</span>
                      </label>
                    </div>

                    <!-- Reset Button (Outside of the status box) -->
                    <button 
                      type="button" 
                      @click="clearAllFilters" 
                      class="h-[42px] px-3 rounded-xl border border-gray-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      :class="(activeFilterCount > 0 || searchQuery) ? 'text-rose-500 border-rose-200 bg-rose-50/50' : 'text-slate-500'"
                      title="Reset all filters"
                    >
                      <Icon name="lucide:rotate-ccw" class="text-xs" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                <!-- Fallback Reset Button if Status filter is disabled in admin -->
                <div v-else-if="activeFilterCount > 0 || searchQuery" class="flex-shrink-0">
                  <button 
                    type="button" 
                    @click="clearAllFilters" 
                    class="h-[42px] px-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Reset all filters"
                  >
                    <Icon name="lucide:rotate-ccw" class="text-xs" />
                    <span>Reset All</span>
                  </button>
                </div>

                <!-- 5. Contract Value Range Filter -->
                <div v-if="filtersConfig.contract_value" class="flex-1 min-w-0 w-full">
                  <div class="grid grid-cols-2 gap-1.5">
                    <div class="relative">
                      <input 
                        v-model="advFilters.minContractValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Contract Min"
                        class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                    <div class="relative">
                      <input 
                        v-model="advFilters.maxContractValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Contract Max"
                        class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <!-- 6. Project Value Range Filter -->
                <div v-if="filtersConfig.project_value" class="flex-1 min-w-0 w-full">
                  <div class="grid grid-cols-2 gap-1.5">
                    <div class="relative">
                      <input 
                        v-model="advFilters.minProjectValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Project Min"
                        class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                    <div class="relative">
                      <input 
                        v-model="advFilters.maxProjectValue"
                        type="number" 
                        min="0"
                        step="any"
                        placeholder="Project Max"
                        class="w-full h-[42px] bg-slate-50 border border-gray-200 rounded-xl px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#feb900] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Transition>

          <!-- Active Filter Badges/Pills Bar -->
          <div v-if="activeFilterBadges.length > 0" class="flex flex-wrap items-center justify-start gap-2 mb-6">
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

        <!-- Projects Area (Grid View vs Modern Minimal List View) -->
        <div :class="{'opacity-50 pointer-events-none': pending}" class="transition-opacity duration-300">
          
          <!-- VIEW 1: Existing Card/Grid View -->
          <div v-if="activeLayout === 'grid' && filteredProjects.length > 0">
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
                      :src="getProjectImage(project)" 
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
                      <h4 class="text-lg font-medium text-[#2e3135] group-hover:text-[#feb900] transition-colors line-clamp-1">
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
            </div>
          </div>

          <!-- VIEW 2: Modern Minimal List View with Large Hover Image Preview -->
          <div v-else-if="activeLayout === 'list' && filteredProjects.length > 0" class="w-full" data-aos="fade-up">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              
              <!-- Left Column: Project List / Table (lg:col-span-7) -->
              <div class="lg:col-span-7 order-1">
                <!-- Clean Minimal Table Header -->
                <div class="grid grid-cols-12 gap-4 pb-2.5 border-b border-gray-200 text-[11px] font-semibold text-slate-400 uppercase tracking-widest select-none">
                  <div class="col-span-6 sm:col-span-7 pl-3.5">TITLE</div>
                  <div class="col-span-4 sm:col-span-3">LOCATION</div>
                  <div class="col-span-2 text-right pr-2">YEAR</div>
                </div>

                <!-- Minimal Table Rows List (Concise height, scannable spacing) -->
                <div class="divide-y divide-gray-100">
                  <div 
                    v-for="project in filteredProjects" 
                    :key="project.id"
                    @mouseenter="hoveredProjectId = project.id"
                    @mouseleave="hoveredProjectId = null"
                    @click="handleRowClick(project, $event)"
                    class="group relative grid grid-cols-12 gap-4 py-3 sm:py-3.5 items-center cursor-pointer transition-colors duration-150 select-none border-b border-gray-100 last:border-b-0"
                    :class="isRowActive(project.id) ? 'text-slate-950 font-medium' : 'text-slate-700 hover:text-slate-950'"
                  >
                    <!-- Gold vertical indicator bar on hovered/active row (Exact match to reference mockup!) -->
                    <div 
                      class="absolute left-0 top-2 bottom-2 w-1 bg-[#feb900] rounded-full transition-all duration-200"
                      :class="isRowActive(project.id) ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100'"
                    ></div>

                    <!-- Project Title -->
                    <div class="col-span-6 sm:col-span-7 pl-3.5 pr-2">
                      <NuxtLink 
                        :to="'/projects/' + project.id" 
                        class="text-sm tracking-tight transition-colors line-clamp-1 group-hover:text-black leading-snug"
                        :class="isRowActive(project.id) ? 'text-slate-950 font-bold' : 'text-slate-900 font-medium'"
                        @click.stop
                      >
                        {{ project.title }}
                      </NuxtLink>
                    </div>

                    <!-- Project Location -->
                    <div class="col-span-4 sm:col-span-3 text-xs sm:text-[13px] text-slate-500 font-normal truncate">
                      {{ project.location || '—' }}
                    </div>

                    <!-- End Year -->
                    <div class="col-span-2 text-right pr-2 text-xs sm:text-[13px] font-mono text-slate-500 font-normal">
                      {{ getProjectYear(project) }}
                    </div>
                  </div>
                </div>

                <!-- Minimal Pagination under the Table (Exactly matching reference mockup!) -->
                <div v-if="data?.totalPages > 1" class="flex justify-center items-center mt-6 pt-2 gap-2 select-none">
                  <button 
                    @click="page > 1 && page--" 
                    :disabled="page === 1"
                    class="w-7 h-7 flex justify-center items-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                    aria-label="Previous Page"
                  >
                    <Icon name="lucide:chevron-left" class="text-xs" />
                  </button>
                  
                  <button 
                    v-for="p in data.totalPages" :key="p"
                    @click="page = p"
                    class="w-7 h-7 flex justify-center items-center rounded-full text-xs font-semibold transition-colors cursor-pointer"
                    :class="page === p ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
                  >
                    {{ p }}
                  </button>

                  <button 
                    @click="page < data.totalPages && page++" 
                    :disabled="page === data.totalPages"
                    class="w-7 h-7 flex justify-center items-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                    aria-label="Next Page"
                  >
                    <Icon name="lucide:chevron-right" class="text-xs" />
                  </button>
                </div>
              </div>

              <!-- Right Column: Large Fixed/Sticky Image Preview (lg:col-span-5) -->
              <div class="lg:col-span-5 order-2">
                <div class="lg:sticky lg:top-28">
                  <div v-if="previewProject" class="space-y-3">
                    <!-- Large Visually Prominent Image Preview Container -->
                    <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                      <Transition name="preview-crossfade" mode="out-in">
                        <div :key="previewProject.id" class="w-full h-full relative group">
                          <NuxtLink :to="'/projects/' + previewProject.id" class="block w-full h-full" :title="'View ' + previewProject.title">
                            <img 
                              :src="getProjectImage(previewProject)" 
                              :alt="previewProject.title"
                              loading="lazy"
                              decoding="async"
                              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          </NuxtLink>
                        </div>
                      </Transition>
                    </div>

                    <!-- Touch Devices Helper Hint -->
                    <p class="lg:hidden text-center text-[11px] text-slate-400 font-medium">
                      Tap any project row above to update preview, or tap the preview to explore details.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- No Results State (Shared) -->
          <div v-if="filteredProjects.length === 0" class="py-16 flex flex-col items-center justify-center text-gray-400">
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

        <!-- Pagination Controls (Grid View only, since List view has pagination under table) -->
        <div v-if="activeLayout === 'grid' && data?.totalPages > 1" class="flex justify-center items-center mt-12 gap-2" data-aos="fade-up">
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
            <h3 class="text-2xl font-medium tracking-tight text-white leading-tight">
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
const { data: configRes } = await useFetch('/api/advanced-search-config', {
  key: 'advanced-search-config'
})

const filtersConfig = computed(() => {
  const cfg = configRes.value?.filters
  return {
    sector: cfg ? cfg.sector !== false : true,
    category: cfg ? cfg.category !== false : true,
    year: cfg ? cfg.year !== false : true,
    status: cfg ? cfg.status !== false : true,
    contract_value: cfg ? cfg.contract_value !== false : true,
    project_value: cfg ? cfg.project_value !== false : true
  }
})

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

// Automatically reset state when an individual filter is disabled by admin
watch(filtersConfig, (cfg) => {
  if (!cfg.sector && (advFilters.sectorId !== 'all' || activeFilter.value !== 'all')) {
    advFilters.sectorId = 'all'
    activeFilter.value = 'all'
  }
  if (!cfg.category && advFilters.categoryIds.length > 0) {
    advFilters.categoryIds = []
  }
  if (!cfg.year && advFilters.year !== 'all') {
    advFilters.year = 'all'
  }
  if (!cfg.status && advFilters.status !== 'all') {
    advFilters.status = 'all'
  }
  if (!cfg.contract_value && (advFilters.minContractValue !== '' || advFilters.maxContractValue !== '')) {
    advFilters.minContractValue = ''
    advFilters.maxContractValue = ''
  }
  if (!cfg.project_value && (advFilters.minProjectValue !== '' || advFilters.maxProjectValue !== '')) {
    advFilters.minProjectValue = ''
    advFilters.maxProjectValue = ''
  }
}, { immediate: true, deep: true })

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

const toggleStatus = (val) => {
  advFilters.status = advFilters.status === val ? 'all' : val
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

// Route and admin-controlled layout state
const route = useRoute()

// Query Params for API — limit is determined by the layout query param if present,
// otherwise the server returns the correct limit based on the DB layout setting.
const queryParams = computed(() => {
  // Use route query param for layout-aware limit on client; server handles DB fallback
  const routeLayout = (route.query.layout === 'list' || route.query.layout === 'grid')
    ? String(route.query.layout)
    : null
  const pageLimit = routeLayout === 'list' ? 10 : routeLayout === 'grid' ? 12 : undefined

  const params = {
    page: page.value,
    search: debouncedSearch.value,
    sectorId: (filtersConfig.value.sector && activeFilter.value !== 'all') ? activeFilter.value : undefined
  }

  if (pageLimit !== undefined) {
    params.limit = pageLimit
  }

  if (routeLayout) {
    params.layout = routeLayout
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

// Active layout: prefers query param override (?layout=list or ?layout=grid), defaults to database setting
const activeLayout = computed(() => {
  if (route.query.layout === 'list' || route.query.layout === 'grid') {
    return String(route.query.layout)
  }
  return data.value?.projects_page_layout || 'grid'
})

// Projects Header Content (dynamic from Admin Panel page_sections)
const defaultHeader = {
  title: 'Our projects',
  content: 'Explore our portfolio of engineering and consultancy projects across Bangladesh — from large-scale industrial facilities to commercial, infrastructure and private developments.',
  subtitle: '',
  is_active: true
}

const headerData = computed(() => {
  const h = data.value?.header
  if (!h) return defaultHeader
  return {
    title: h.title || defaultHeader.title,
    content: (h.content !== undefined && h.content !== null) ? h.content : defaultHeader.content,
    subtitle: h.subtitle || '',
    is_active: h.is_active !== false
  }
})

const lightboxProject = ref(null)

const filteredProjects = computed(() => {
  return data.value?.projects || []
})

// Modern List View State & Interaction Handlers
const hoveredProjectId = ref(null)
const selectedProjectId = ref(null)

const previewProject = computed(() => {
  const list = filteredProjects.value
  if (!list || list.length === 0) return null
  if (hoveredProjectId.value !== null) {
    const p = list.find(item => item.id === hoveredProjectId.value)
    if (p) return p
  }
  if (selectedProjectId.value !== null) {
    const p = list.find(item => item.id === selectedProjectId.value)
    if (p) return p
  }
  return list[0]
})

const getProjectYear = (project) => {
  if (project?.end_date) {
    const y = new Date(project.end_date).getFullYear()
    if (!isNaN(y)) return y
  }
  if (project?.start_date) {
    const y = new Date(project.start_date).getFullYear()
    if (!isNaN(y)) return y
  }
  return '—'
}

const getProjectImage = (project) => {
  if (project?.images && project.images.length > 0) {
    const img = project.images[0]
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/'))) {
      return img
    }
    return `/assets/img/projects/${img}`
  }
  return '/assets/img/projects/remodeling-1.jpg'
}

const isRowActive = (projectId) => {
  if (hoveredProjectId.value !== null) {
    return hoveredProjectId.value === projectId
  }
  if (selectedProjectId.value !== null) {
    return selectedProjectId.value === projectId
  }
  return previewProject.value?.id === projectId
}

const handleRowClick = (project, event) => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    // On touch/mobile devices, tapping updates the preview first
    if (selectedProjectId.value !== project.id) {
      selectedProjectId.value = project.id
      return
    }
  }
  navigateTo(`/projects/${project.id}`)
}

// Automatically sync selected project with top item whenever filtered list updates
watch(filteredProjects, (newList) => {
  if (newList && newList.length > 0) {
    if (!newList.some(p => p.id === selectedProjectId.value)) {
      selectedProjectId.value = newList[0].id
    }
  } else {
    selectedProjectId.value = null
  }
}, { immediate: true })

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

/* Category Dropdown Popover */
.category-dropdown-popover {
  background-color: #ffffff !important;
  opacity: 1 !important;
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

/* Modern List View Live Hover Preview Transition */
.preview-crossfade-enter-active,
.preview-crossfade-leave-active {
  transition: opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.preview-crossfade-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.preview-crossfade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
