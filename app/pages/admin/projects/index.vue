<template>
  <div class="space-y-6 font-sans">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Portfolio & Business Management</h2>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Manage projects, categories, and business sectors</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink 
          v-if="activeTab === 'projects'"
          to="/admin/projects/new" 
          class="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-[#feb900] hover:bg-[#e5a600] border border-transparent rounded-full shadow-sm hover:shadow-md focus:outline-none cursor-pointer" 
          style="color: #1e293b;"
        >
          <Icon name="lucide:plus" class="mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Add Project
        </NuxtLink>
        <button 
          v-if="activeTab === 'categories'"
          @click="openCategoryModal()" 
          class="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all bg-[#feb900] hover:bg-[#e5a600] text-slate-900 border border-transparent rounded-full shadow-sm cursor-pointer"
        >
          <Icon name="lucide:plus" class="mr-2" /> Add Category
        </button>
        <button 
          v-if="activeTab === 'sectors'"
          @click="openSectorModal()" 
          class="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all bg-[#feb900] hover:bg-[#e5a600] text-slate-900 border border-transparent rounded-full shadow-sm cursor-pointer"
        >
          <Icon name="lucide:plus" class="mr-2" /> Add Sector
        </button>
        <button 
          v-if="activeTab === 'header'"
          @click="saveHeader()" 
          :disabled="savingHeader"
          class="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all bg-[#feb900] hover:bg-[#e5a600] disabled:opacity-50 text-slate-900 border border-transparent rounded-full shadow-sm cursor-pointer"
        >
          <span v-if="savingHeader" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-900 border-t-transparent mr-2"></span>
          <Icon v-else name="lucide:check" class="mr-2" />
          {{ savingHeader ? 'Saving...' : 'Save Header' }}
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex border-b border-slate-200 gap-6">
      <button 
        @click="activeTab = 'projects'" 
        class="pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 focus:outline-none cursor-pointer"
        :class="activeTab === 'projects' ? 'border-[#feb900] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-650'"
      >
        Portfolio Projects
      </button>
      <button 
        @click="activeTab = 'categories'" 
        class="pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 focus:outline-none cursor-pointer"
        :class="activeTab === 'categories' ? 'border-[#feb900] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-650'"
      >
        Project Categories
      </button>
      <button 
        @click="activeTab = 'sectors'" 
        class="pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 focus:outline-none cursor-pointer"
        :class="activeTab === 'sectors' ? 'border-[#feb900] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-650'"
      >
        Business Sectors
      </button>
      <button 
        @click="activeTab = 'header'" 
        class="pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 focus:outline-none cursor-pointer"
        :class="activeTab === 'header' ? 'border-[#feb900] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-650'"
      >
        Page Header & Content
      </button>
    </div>

    <!-- Frontend Layout Control Bar -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#feb900] flex-shrink-0">
          <Icon name="lucide:layout" class="text-lg" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Frontend Public Layout:</span>
            <span 
              class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full"
              :class="currentLayout === 'list' ? 'bg-amber-50 text-amber-800 border border-amber-300/50' : 'bg-slate-100 text-slate-700 border border-slate-200'"
            >
              {{ currentLayout === 'list' ? 'Modern List View' : 'Card / Grid View' }}
            </span>
          </div>
          <p class="text-[11px] text-slate-400">Controls whether visitors browse projects via traditional cards or the modern list with hover image preview.</p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <div class="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200/80">
          <button
            type="button"
            @click="switchLayout('grid')"
            :disabled="switchingLayout"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
            :class="currentLayout !== 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            <Icon name="lucide:layout-grid" class="text-xs" />
            <span>Card Grid</span>
          </button>
          <button
            type="button"
            @click="switchLayout('list')"
            :disabled="switchingLayout"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
            :class="currentLayout === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            <Icon name="lucide:layout-list" class="text-xs" />
            <span>Modern List</span>
          </button>
        </div>
        <NuxtLink
          to="/projects"
          target="_blank"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Preview live public /projects page"
        >
          <span>Preview</span>
          <Icon name="lucide:external-link" class="text-xs" />
        </NuxtLink>
      </div>
    </div>

    <!-- Tab Content 1: Projects -->
    <div v-if="activeTab === 'projects'" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
      <!-- Loading State -->
      <div v-if="pending" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center min-h-[300px]">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#feb900] mb-3"></div>
          <span class="text-slate-500 font-semibold text-xs uppercase tracking-wider">Loading projects...</span>
        </div>
      </div>
      
      <!-- Search and Filter Bar -->
      <div class="p-5 border-b border-slate-200 bg-slate-50/40 flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
        <div class="relative max-w-sm w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon name="lucide:search" class="text-slate-400" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" 
            placeholder="Search projects..."
          />
        </div>
        <div class="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-start xl:justify-end">
          <!-- Category Filter -->
          <select 
            v-model="selectedCategory" 
            class="px-3.5 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="">All Categories</option>
            <option 
              v-for="cat in filterCategories" 
              :key="cat.id" 
              :value="cat.id"
            >
              {{ cat.name }} ({{ cat.count }})
            </option>
          </select>

          <!-- Sector Filter -->
          <select 
            v-model="selectedSector" 
            class="px-3.5 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="">All Sectors</option>
            <option 
              v-for="sec in filterSectors" 
              :key="sec.id" 
              :value="sec.id"
            >
              {{ sec.sector }} ({{ sec.count }})
            </option>
          </select>

          <!-- Status Filter -->
          <select 
            v-model="selectedStatus" 
            class="px-3.5 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>

          <!-- Sort Control Group -->
          <div class="inline-flex items-center bg-white border border-slate-350 rounded-full shadow-sm pl-3 pr-1 py-1 gap-1.5 text-xs">
            <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Icon name="lucide:arrow-up-down" class="text-slate-400 text-xs" />
              Sort:
            </span>
            <select 
              v-model="sortBy" 
              class="bg-transparent font-bold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="id">Default (Newest)</option>
              <option value="end_date">End Date</option>
              <option value="start_date">Start Date</option>
              <option value="service_cost">Contract Value</option>
            </select>
            <button 
              type="button"
              @click="toggleSortOrder" 
              class="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#feb900] text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              :title="sortOrder === 'asc' ? 'Ascending (Click for Descending)' : 'Descending (Click for Ascending)'"
            >
              <Icon :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="text-xs font-bold" />
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Project Details</th>
              
              <!-- Start Date Sort Header -->
              <th scope="col" class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none group" @click="handleSort('start_date')">
                <div class="inline-flex items-center gap-1.5 transition-colors" :class="sortBy === 'start_date' ? 'text-amber-600 font-extrabold' : 'text-slate-400 group-hover:text-slate-700'">
                  <span>Start Date</span>
                  <span v-if="sortBy === 'start_date'" class="inline-flex items-center text-amber-500">
                    <Icon :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="text-sm font-bold" />
                  </span>
                  <Icon v-else name="lucide:arrow-up-down" class="text-xs text-slate-300 group-hover:text-slate-400" />
                </div>
              </th>

              <!-- End Date Sort Header -->
              <th scope="col" class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none group" @click="handleSort('end_date')">
                <div class="inline-flex items-center gap-1.5 transition-colors" :class="sortBy === 'end_date' ? 'text-amber-600 font-extrabold' : 'text-slate-400 group-hover:text-slate-700'">
                  <span>End Date</span>
                  <span v-if="sortBy === 'end_date'" class="inline-flex items-center text-amber-500">
                    <Icon :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="text-sm font-bold" />
                  </span>
                  <Icon v-else name="lucide:arrow-up-down" class="text-xs text-slate-300 group-hover:text-slate-400" />
                </div>
              </th>

              <!-- Contract Value Sort Header -->
              <th scope="col" class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none group" @click="handleSort('service_cost')">
                <div class="inline-flex items-center gap-1.5 transition-colors" :class="sortBy === 'service_cost' ? 'text-amber-600 font-extrabold' : 'text-slate-400 group-hover:text-slate-700'">
                  <span>Contract Value</span>
                  <span v-if="sortBy === 'service_cost'" class="inline-flex items-center text-amber-500">
                    <Icon :name="sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="text-sm font-bold" />
                  </span>
                  <Icon v-else name="lucide:arrow-up-down" class="text-xs text-slate-300 group-hover:text-slate-400" />
                </div>
              </th>

              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="project in projectsData?.data || []" :key="project.id" class="hover:bg-slate-50/50 transition-colors duration-150 group">
              <!-- Project Details -->
              <td class="px-6 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-11 w-11 rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50 flex items-center justify-center">
                    <img v-if="project.images && project.images.length > 0" :src="`/assets/img/projects/${project.images[0]}`" class="h-11 w-11 object-cover transition-transform duration-300 group-hover:scale-105" @error="$event.target.src='/assets/img/placeholder.jpg'" />
                    <Icon v-else name="lucide:image" class="text-slate-300 text-xl" />
                  </div>
                  <div class="ml-3.5 max-w-xs sm:max-w-sm truncate">
                    <div class="text-sm font-bold text-[#364d59] group-hover:text-slate-900 transition-colors truncate" :title="project.title">{{ project.title }}</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span v-for="pc in project.project_categories || []" :key="pc.category.id" class="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                        {{ pc.category.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Start Date -->
              <td class="px-5 py-3 whitespace-nowrap">
                <span class="text-xs font-semibold" :class="sortBy === 'start_date' ? 'text-amber-800 font-bold bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/80' : 'text-slate-600'">
                  {{ formatDate(project.start_date) }}
                </span>
              </td>

              <!-- End Date -->
              <td class="px-5 py-3 whitespace-nowrap">
                <span class="text-xs font-semibold" :class="sortBy === 'end_date' ? 'text-amber-800 font-bold bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/80' : 'text-slate-600'">
                  {{ formatDate(project.end_date) }}
                </span>
              </td>

              <!-- Contract Value -->
              <td class="px-5 py-3 whitespace-nowrap">
                <span class="text-xs" :class="sortBy === 'service_cost' ? 'text-amber-800 font-extrabold bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/80' : 'text-slate-700 font-bold'">
                  {{ formatCost(project.service_cost) }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border" 
                  :class="project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50/50 text-amber-700 border-amber-200'">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" :class="project.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  {{ project.status }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <NuxtLink :to="`/admin/projects/${project.id}`" class="w-9 h-9 flex items-center justify-center text-slate-450 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all duration-150" title="Edit Project">
                    <Icon name="lucide:edit" class="text-base" />
                  </NuxtLink>
                  <button @click="deleteProject(project.id)" class="w-9 h-9 flex items-center justify-center text-slate-450 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-150" title="Delete Project">
                    <Icon name="lucide:trash-2" class="text-base" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="projectsData?.data?.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <Icon name="lucide:inbox" class="text-5xl mb-4 text-slate-350" />
                  <p class="text-base font-bold text-slate-700">No projects found</p>
                  <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Try resetting filters or write another query.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Footer -->
      <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Showing <span class="font-extrabold text-slate-700">{{ projectsData?.data?.length || 0 }}</span> of <span class="font-extrabold text-slate-700">{{ projectsData?.total || 0 }}</span> projects
        </span>
        <div class="flex items-center gap-4">
          <span class="text-xs text-slate-500 font-semibold">Page {{ currentPage }} of {{ projectsData?.totalPages || 1 }}</span>
          <div class="flex gap-2">
            <button 
              @click="currentPage--" 
              :disabled="currentPage <= 1"
              class="px-4 py-1.5 border border-slate-300 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              Previous
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= (projectsData?.totalPages || 1)"
              class="px-4 py-1.5 border border-slate-300 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content 2: Categories -->
    <div v-if="activeTab === 'categories'" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="catsPending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>
      <div v-else-if="!categories?.data?.length" class="text-center py-20 text-slate-400">
        <Icon name="lucide:tags" class="text-4xl mb-4 block" />
        <p class="font-semibold text-slate-700">No project categories found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name</th>
              <th scope="col" class="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white text-sm">
            <tr v-for="cat in categories?.data || []" :key="cat.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 font-mono text-xs text-slate-400">#{{ cat.id }}</td>
              <td class="px-6 py-4 font-bold text-slate-800">
                <div class="flex items-center gap-2">
                  <span>{{ cat.name }}</span>
                  <span 
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="(cat.project_count || 0) > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'"
                  >
                    {{ cat.project_count || 0 }} {{ (cat.project_count || 0) === 1 ? 'project' : 'projects' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="inline-flex gap-2">
                  <button @click="openCategoryModal(cat)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"><Icon name="lucide:pencil" /></button>
                  <button @click="deleteCategory(cat.id)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"><Icon name="lucide:trash-2" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab Content 3: Sectors -->
    <div v-if="activeTab === 'sectors'" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="sectorsPending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>
      <div v-else-if="!sectors?.data?.length" class="text-center py-20 text-slate-400">
        <Icon name="lucide:layout-grid" class="text-4xl mb-4 block" />
        <p class="font-semibold text-slate-700">No sectors found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sector Name</th>
              <th scope="col" class="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white text-sm">
            <tr v-for="sec in sectors?.data || []" :key="sec.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 font-mono text-xs text-slate-400">#{{ sec.id }}</td>
              <td class="px-6 py-4 font-bold text-slate-800">
                <div class="flex items-center gap-2">
                  <span>{{ sec.sector }}</span>
                  <span 
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="(sec.project_count || 0) > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'"
                  >
                    {{ sec.project_count || 0 }} {{ (sec.project_count || 0) === 1 ? 'project' : 'projects' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="inline-flex gap-2">
                  <button @click="openSectorModal(sec)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"><Icon name="lucide:pencil" /></button>
                  <button @click="deleteSector(sec.id)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"><Icon name="lucide:trash-2" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab Content 4: Page Header & Description Content -->
    <div v-if="activeTab === 'header'" class="space-y-6">
      <div v-if="headerPending" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Header Content Form (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Icon name="lucide:type" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-800">Projects Page Header</h3>
                <p class="text-xs text-slate-400">Configure the headline and introductory narrative shown on /projects</p>
              </div>
            </div>
            <div>
              <span 
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                :class="headerForm.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="headerForm.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                {{ headerForm.is_active ? 'Section Visible' : 'Section Hidden' }}
              </span>
            </div>
          </div>

          <form @submit.prevent="saveHeader" class="space-y-5">
            <!-- Section Heading (Title) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Page Heading / Title <span class="text-rose-500">*</span>
                </label>
                <span class="text-[11px] text-slate-400">{{ (headerForm.title || '').length }} chars</span>
              </div>
              <input 
                type="text" 
                v-model="headerForm.title" 
                required
                placeholder="e.g. Our projects" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all"
              />
              <p class="text-[11px] text-slate-400">Main primary heading rendered in elegant display typography.</p>
            </div>

            <!-- Optional Subtitle / Tag -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Badge / Subtitle Tag <span class="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <span class="text-[11px] text-slate-400">{{ (headerForm.subtitle_or_tag || '').length }} chars</span>
              </div>
              <input 
                type="text" 
                v-model="headerForm.subtitle_or_tag" 
                placeholder="e.g. ARCHITECTURE & PLANNING" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all"
              />
              <p class="text-[11px] text-slate-400">Small uppercase accent badge displayed directly above the heading.</p>
            </div>

            <!-- Introductory Paragraph / Content -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Introductory Narrative / Description <span class="text-rose-500">*</span>
                </label>
                <span class="text-[11px] text-slate-400">{{ (headerForm.content || '').length }} chars</span>
              </div>
              <textarea 
                rows="5"
                v-model="headerForm.content" 
                required
                placeholder="Since 2009, REINCARNATION has shaped spaces across Bangladesh..." 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all"
              ></textarea>
              <p class="text-[11px] text-slate-400">The narrative description paragraph shown directly below the heading.</p>
            </div>

            <!-- Section Active Switch -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div class="space-y-0.5">
                <div class="text-xs font-bold text-slate-700 uppercase tracking-wider">Display on Public Page</div>
                <div class="text-[11px] text-slate-400">When enabled, this header block is rendered at the top of the /projects route.</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="headerForm.is_active" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#feb900]"></div>
              </label>
            </div>

            <!-- Form Actions -->
            <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button 
                type="button" 
                @click="showResetHeaderModal = true"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              >
                <Icon name="lucide:rotate-ccw" class="text-xs" />
                <span>Reset to Default</span>
              </button>

              <div class="flex items-center gap-3">
                <button 
                  type="submit"
                  :disabled="savingHeader"
                  class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  <span v-if="savingHeader" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
                  <Icon v-else name="lucide:check" class="text-sm" />
                  <span>{{ savingHeader ? 'Saving Changes...' : 'Save Changes' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right: Live Visual Preview Card (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <Icon name="lucide:eye" class="text-amber-500 text-sm" />
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Live Website Preview</h4>
              </div>
              <NuxtLink 
                to="/projects" 
                target="_blank" 
                class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700"
              >
                <span>View /projects</span>
                <Icon name="lucide:external-link" class="text-xs" />
              </NuxtLink>
            </div>

            <!-- Simulated Browser / Viewport Container -->
            <div class="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
              <!-- Browser mock header bar -->
              <div class="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 rounded-full bg-rose-400"></div>
                  <div class="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <div class="text-[10px] font-mono text-slate-400">cozmictechnology.com/projects</div>
                <div class="w-8"></div>
              </div>

              <!-- Preview Content Area -->
              <div class="p-6 bg-white min-h-[220px] transition-all">
                <div v-if="!headerForm.is_active" class="py-12 text-center text-slate-400">
                  <Icon name="lucide:eye-off" class="text-2xl mb-2 mx-auto block text-slate-300" />
                  <p class="text-xs font-semibold">Header section is currently set to hidden.</p>
                </div>
                <div v-else class="space-y-3">
                  <p v-if="headerForm.subtitle_or_tag" class="text-[10px] uppercase tracking-widest text-[#feb900] font-bold">
                    {{ headerForm.subtitle_or_tag }}
                  </p>
                  <h1 class="font-display text-2xl sm:text-3xl font-normal text-slate-950 tracking-tight leading-tight">
                    {{ headerForm.title || 'Our projects' }}
                  </h1>
                  <p class="text-slate-600 text-xs leading-relaxed font-normal whitespace-pre-line">
                    {{ headerForm.content || 'No description provided.' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Database Status Indicator -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div class="flex items-center justify-between text-slate-500 font-medium">
                <span>Storage Backend:</span>
                <span class="font-mono text-slate-800 font-bold">page_sections (slug: 'projects')</span>
              </div>
              <div class="flex items-center justify-between text-slate-500 font-medium">
                <span>Section Status:</span>
                <span 
                  class="font-bold px-2 py-0.5 rounded text-[11px]"
                  :class="headerExists ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'"
                >
                  {{ headerExists ? 'Customized in Database' : 'Using Initial Default' }}
                </span>
              </div>
              <div v-if="headerDataRes?.data?.updated_at" class="flex items-center justify-between text-slate-500 font-medium">
                <span>Last Updated:</span>
                <span class="font-bold text-slate-700">{{ formatDate(headerDataRes.data.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <Teleport to="body">
      <div v-if="showCatModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100">
          <div class="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-800">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
            <button @click="showCatModal = false" class="text-slate-400 hover:text-slate-700 text-lg focus:outline-none cursor-pointer"><Icon name="lucide:x-lg" /></button>
          </div>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Category Name *</label>
              <input type="text" v-model="catForm.name" required placeholder="e.g. Bridges & Highways" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" @click="showCatModal = false" class="px-4 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-[#feb900] hover:bg-amber-500 text-slate-900 font-bold rounded-full text-xs cursor-pointer">Save Category</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Sector Modal -->
    <Teleport to="body">
      <div v-if="showSecModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100">
          <div class="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-800">{{ editingSector ? 'Edit Sector' : 'Add Sector' }}</h3>
            <button @click="showSecModal = false" class="text-slate-400 hover:text-slate-700 text-lg focus:outline-none cursor-pointer"><Icon name="lucide:x-lg" /></button>
          </div>
          <form @submit.prevent="saveSector" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Sector Name *</label>
              <input type="text" v-model="secForm.sector" required placeholder="e.g. Geotechnical" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" @click="showSecModal = false" class="px-4 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-[#feb900] hover:bg-amber-500 text-slate-900 font-bold rounded-full text-xs cursor-pointer">Save Sector</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Reset Header Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showResetHeaderModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100">
          <div class="flex items-center gap-3 text-rose-600">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Icon name="lucide:rotate-ccw" class="text-xl" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">Reset Header Content?</h3>
              <p class="text-xs text-slate-400">Restore default heading and description</p>
            </div>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            This will reset the projects page heading to <strong>"Our projects"</strong> and the description narrative back to the original text. Are you sure you want to proceed?
          </p>
          <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button 
              type="button" 
              @click="showResetHeaderModal = false" 
              class="px-4 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-650 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="button" 
              @click="resetHeader"
              :disabled="resettingHeader" 
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-full text-xs cursor-pointer flex items-center gap-1.5"
            >
              <span v-if="resettingHeader" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
              <span>{{ resettingHeader ? 'Resetting...' : 'Yes, Reset to Default' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Portfolio & Business'
});

const route = useRoute();
const activeTab = ref(route.query.tab ? String(route.query.tab) : 'projects');
const feedbackMsg = ref('');

const searchQuery = ref('');
const debouncedSearch = ref('');
const selectedStatus = ref('');
const selectedCategory = ref('');
const selectedSector = ref('');
const sortBy = ref('id');
const sortOrder = ref('desc');
const currentPage = ref(1);
const pageSize = ref(10);

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'desc';
  }
  currentPage.value = 1;
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  currentPage.value = 1;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return String(dateStr);
  }
};

const formatCost = (costStr) => {
  if (!costStr || !String(costStr).trim()) return '—';
  return String(costStr).trim();
};

// Fetch layout, categories & sectors
const headers = useRequestHeaders(['cookie']);
const { data: layoutData, refresh: refreshLayout } = await useFetch('/api/admin/projects/layout', { headers });
const currentLayout = computed(() => layoutData.value?.layout || 'grid');
const switchingLayout = ref(false);

const switchLayout = async (targetLayout) => {
  if (currentLayout.value === targetLayout || switchingLayout.value) return;
  switchingLayout.value = true;
  try {
    const res = await useNuxtApp().$fetch('/api/admin/projects/layout', {
      method: 'POST',
      body: { layout: targetLayout }
    });
    if (res?.success) {
      await refreshLayout();
      useToast().success(res.message || `Layout switched to ${targetLayout === 'list' ? 'Modern List' : 'Card Grid'}`);
    }
  } catch (err) {
    useToast().error('Failed to update frontend layout');
  } finally {
    switchingLayout.value = false;
  }
};

const { data: categories, pending: catsPending, refresh: refreshCategories } = await useFetch('/api/admin/categories', { headers });
const { data: sectors, pending: sectorsPending, refresh: refreshSectors } = await useFetch('/api/admin/sectors', { headers });

// Fetch projects
const { data: projectsData, pending, refresh: refreshProjects } = await useFetch('/api/admin/projects', {
  query: {
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    status: selectedStatus,
    catId: selectedCategory,
    sectorId: selectedSector,
    sortBy,
    sortOrder
  },
  headers,
  key: 'admin-projects-list',
  watch: [currentPage, debouncedSearch, selectedStatus, selectedCategory, selectedSector, sortBy, sortOrder]
});

// Dynamically compute active category options (only categories with >= 1 project)
const filterCategories = computed(() => {
  if (projectsData.value?.filterOptions?.categories?.length) {
    return projectsData.value.filterOptions.categories;
  }
  return (categories.value?.data || [])
    .filter(c => (c.project_count || 0) > 0)
    .map(c => ({
      id: c.id,
      name: c.name,
      count: c.project_count || 0
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

// Dynamically compute active sector options (only sectors with >= 1 project)
const filterSectors = computed(() => {
  if (projectsData.value?.filterOptions?.sectors?.length) {
    return projectsData.value.filterOptions.sectors;
  }
  return (sectors.value?.data || [])
    .filter(s => (s.project_count || 0) > 0)
    .map(s => ({
      id: s.id,
      sector: s.sector || s.name,
      count: s.project_count || 0
    }))
    .sort((a, b) => (a.sector || '').localeCompare(b.sector || ''));
});

// Auto-reset filter if active selection no longer has projects
watch(filterCategories, (newCats) => {
  if (selectedCategory.value && newCats && newCats.length > 0 && !newCats.some(c => c.id === Number(selectedCategory.value))) {
    selectedCategory.value = '';
  }
});

watch(filterSectors, (newSecs) => {
  if (selectedSector.value && newSecs && newSecs.length > 0 && !newSecs.some(s => s.id === Number(selectedSector.value))) {
    selectedSector.value = '';
  }
});

// Debounce search query
let searchTimeout = null;
watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal.trim();
    currentPage.value = 1;
  }, 400);
});

watch([selectedStatus, selectedCategory, selectedSector, sortBy, sortOrder], () => {
  currentPage.value = 1;
});

const deleteProject = async (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      feedbackMsg.value = 'Project successfully deleted.';
      setTimeout(() => feedbackMsg.value = '', 4000);
      clearNuxtData();
      await Promise.all([
        refreshProjects(),
        refreshCategories(),
        refreshSectors()
      ]);
      useToast().success('Project successfully deleted.');
    } catch (error) {
      useToast().error('Failed to delete project.');
    }
  }
};

watch(activeTab, (tab) => {
  if (tab === 'projects') {
    refreshProjects();
    refreshCategories();
    refreshSectors();
  }
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => {
      if (activeTab.value === 'projects') {
        refreshProjects();
        refreshCategories();
        refreshSectors();
      }
    });
  }
});

// ----------------------------------------
// CATEGORY CRUD
// ----------------------------------------
const showCatModal = ref(false);
const editingCategory = ref(null);
const catForm = reactive({
  name: ''
});

const openCategoryModal = (cat = null) => {
  editingCategory.value = cat;
  if (cat) {
    catForm.name = cat.name || '';
  } else {
    catForm.name = '';
  }
  showCatModal.value = true;
};

const saveCategory = async () => {
  const url = editingCategory.value ? `/api/admin/categories/${editingCategory.value.id}` : '/api/admin/categories';
  const method = editingCategory.value ? 'PUT' : 'POST';
  try {
    await useNuxtApp().$fetch(url, { method, body: catForm });
    feedbackMsg.value = editingCategory.value ? 'Category successfully updated.' : 'Category successfully created.';
    setTimeout(() => feedbackMsg.value = '', 4000);
    showCatModal.value = false;
    clearNuxtData();
    refreshCategories();
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save category');
  }
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      feedbackMsg.value = 'Category successfully deleted.';
      setTimeout(() => feedbackMsg.value = '', 4000);
      clearNuxtData();
      refreshCategories();
    } catch (error) {
      useToast().error('Failed to delete category.');
    }
  }
};

const getSectorName = (sectorId) => {
  if (!sectorId || !sectors.value?.data) return '-';
  const matched = sectors.value.data.find(s => s.id === sectorId);
  return matched ? matched.sector : '-';
};

// ----------------------------------------
// SECTOR CRUD
// ----------------------------------------
const showSecModal = ref(false);
const editingSector = ref(null);
const secForm = reactive({
  sector: ''
});

const openSectorModal = (sec = null) => {
  editingSector.value = sec;
  if (sec) {
    secForm.sector = sec.sector || '';
  } else {
    secForm.sector = '';
  }
  showSecModal.value = true;
};

const saveSector = async () => {
  const url = editingSector.value ? `/api/admin/sectors/${editingSector.value.id}` : '/api/admin/sectors';
  const method = editingSector.value ? 'PUT' : 'POST';
  try {
    await useNuxtApp().$fetch(url, { method, body: secForm });
    feedbackMsg.value = editingSector.value ? 'Sector successfully updated.' : 'Sector successfully created.';
    setTimeout(() => feedbackMsg.value = '', 4000);
    showSecModal.value = false;
    clearNuxtData();
    refreshSectors();
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save sector');
  }
};

const deleteSector = async (id) => {
  if (confirm('Are you sure you want to delete this sector? All associated categories may lose their link.')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/sectors/${id}`, { method: 'DELETE' });
      feedbackMsg.value = 'Sector successfully deleted.';
      setTimeout(() => feedbackMsg.value = '', 4000);
      clearNuxtData();
      refreshSectors();
    } catch (error) {
      useToast().error('Failed to delete sector.');
    }
  }
};

// ----------------------------------------
// PROJECTS PAGE HEADER CRUD
// ----------------------------------------
const headerForm = reactive({
  title: 'Our projects',
  subtitle_or_tag: '',
  content: 'Since 2009, REINCARNATION has shaped spaces across Bangladesh — from large-scale industrial and RMG facilities to corporate interiors, hospitality, mixed-use landmarks and private residences. Each project pairs architectural rigour with a careful eye for how people actually use a space.',
  is_active: true
});
const headerExists = ref(false);
const savingHeader = ref(false);
const resettingHeader = ref(false);
const showResetHeaderModal = ref(false);

const { data: headerDataRes, pending: headerPending, refresh: refreshHeader } = await useFetch('/api/admin/projects/header', { headers });

const initHeaderForm = () => {
  if (headerDataRes.value?.data) {
    const d = headerDataRes.value.data;
    headerForm.title = d.title || 'Our projects';
    headerForm.subtitle_or_tag = d.subtitle_or_tag || '';
    headerForm.content = (d.content !== null && d.content !== undefined) ? d.content : '';
    headerForm.is_active = d.is_active ?? true;
    headerExists.value = !!headerDataRes.value.exists;
  }
};

watch(() => headerDataRes.value, () => {
  initHeaderForm();
}, { immediate: true });

const saveHeader = async () => {
  savingHeader.value = true;
  try {
    const res = await useNuxtApp().$fetch('/api/admin/projects/header', {
      method: 'POST',
      body: headerForm
    });
    if (res?.success) {
      await refreshHeader();
      clearNuxtData();
      useToast().success(res.message || 'Page header content saved successfully');
    }
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save page header content');
  } finally {
    savingHeader.value = false;
  }
};

const resetHeader = async () => {
  resettingHeader.value = true;
  try {
    const res = await useNuxtApp().$fetch('/api/admin/projects/header', {
      method: 'DELETE'
    });
    if (res?.success) {
      await refreshHeader();
      clearNuxtData();
      showResetHeaderModal.value = false;
      useToast().success(res.message || 'Page header reset to system defaults');
    }
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to reset page header');
  } finally {
    resettingHeader.value = false;
  }
};
</script>
