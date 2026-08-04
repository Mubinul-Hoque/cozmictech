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
    </div>

    <!-- Success / Error Feedback Banner -->
    <div v-if="feedbackMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ feedbackMsg }}</span>
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
      <div class="p-5 border-b border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row gap-4 justify-between items-center">
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
        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <!-- Category Filter -->
          <select 
            v-model="selectedCategory" 
            class="px-4 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="">All Categories</option>
            <option 
              v-for="cat in categories?.data || []" 
              :key="cat.id" 
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>

          <!-- Sector Filter -->
          <select 
            v-model="selectedSector" 
            class="px-4 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="">All Sectors</option>
            <option 
              v-for="sec in sectors?.data || []" 
              :key="sec.id" 
              :value="sec.id"
            >
              {{ sec.sector }}
            </option>
          </select>

          <!-- Status Filter -->
          <select 
            v-model="selectedStatus" 
            class="px-4 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Project Details</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="project in projectsData?.data || []" :key="project.id" class="hover:bg-slate-50/50 transition-colors duration-150 group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12 rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50 flex items-center justify-center">
                    <img v-if="project.images && project.images.length > 0" :src="`/assets/img/projects/${project.images[0]}`" class="h-12 w-12 object-cover transition-transform duration-300 group-hover:scale-105" @error="$event.target.src='/assets/img/placeholder.jpg'" />
                    <Icon v-else name="lucide:image" class="text-slate-300 text-xl" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-[#364d59] group-hover:text-slate-900 transition-colors">{{ project.title }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: #{{ project.id }}</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span v-for="pc in project.project_categories || []" :key="pc.category.id" class="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                        {{ pc.category.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border" 
                  :class="project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50/50 text-amber-700 border-amber-200'">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" :class="project.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  {{ project.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
              <td colspan="3" class="px-6 py-12 text-center">
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
              <td class="px-6 py-4 font-bold text-slate-800">{{ cat.name }}</td>
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
              <td class="px-6 py-4 font-bold text-slate-800">{{ sec.sector }}</td>
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

  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Portfolio & Business'
});

const activeTab = ref('projects');
const feedbackMsg = ref('');

const searchQuery = ref('');
const debouncedSearch = ref('');
const selectedStatus = ref('');
const selectedCategory = ref('');
const selectedSector = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Fetch categories & sectors
const headers = useRequestHeaders(['cookie']);
const { data: categories, pending: catsPending, refresh: refreshCategories } = await useFetch('/api/admin/categories', { headers });
const { data: sectors, pending: sectorsPending, refresh: refreshSectors } = await useFetch('/api/admin/sectors', { headers });

// Fetch projects
const { data: projectsData, pending, refresh: refreshProjects } = useFetch('/api/admin/projects', {
  query: {
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    status: selectedStatus,
    catId: selectedCategory,
    sectorId: selectedSector
  },
  headers,
  key: 'admin-projects-list',
  watch: [currentPage, debouncedSearch, selectedStatus, selectedCategory, selectedSector]
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

watch([selectedStatus, selectedCategory, selectedSector], () => {
  currentPage.value = 1;
});

const deleteProject = async (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      feedbackMsg.value = 'Project successfully deleted.';
      setTimeout(() => feedbackMsg.value = '', 4000);
      clearNuxtData();
      refreshProjects();
    } catch (error) {
      useToast().error('Failed to delete project.');
    }
  }
};

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
</script>
