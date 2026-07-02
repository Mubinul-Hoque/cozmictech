<template>
  <div class="font-sans">
    <div class="mb-6 flex flex-col gap-1">
      <NuxtLink to="/admin/projects" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 mb-1">
        <i class="bi bi-arrow-left"></i> Back to Projects
      </NuxtLink>
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">{{ isNew ? 'Add New Project' : 'Edit Project' }}</h2>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <form @submit.prevent="saveProject" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Title</label>
              <input v-model="form.title" type="text" required class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
            </div>

            <div class="space-y-4">
              <!-- Searchable Multiple Category Selection Dropdown -->
              <div class="relative relative-dropdown-container">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Categories *</label>
                
                <!-- Selected Badges Area & Dropdown Trigger -->
                <div 
                  @click="toggleDropdown" 
                  class="min-h-[42px] w-full bg-white border border-slate-300 rounded-lg p-1.5 flex flex-wrap gap-1.5 items-center cursor-pointer focus-within:border-[#feb900] focus-within:ring-1 focus-within:ring-[#feb900] transition-colors"
                >
                  <!-- Selected Badges -->
                  <span 
                    v-for="catId in form.category_ids" 
                    :key="catId"
                    class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-md hover:bg-amber-100 transition-colors"
                    @click.stop="removeCategory(catId)"
                  >
                    {{ getCategoryName(catId) }}
                    <i class="bi bi-x text-sm leading-none text-slate-400 hover:text-red-650 transition-colors"></i>
                  </span>
                  
                  <!-- Placeholder / Trigger label -->
                  <span v-if="!form.category_ids?.length" class="text-slate-400 text-sm pl-2 select-none">
                    Select categories...
                  </span>
                  
                  <!-- Chevron Indicator -->
                  <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <i class="bi" :class="showDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </div>
                </div>

                <!-- Dropdown Menu -->
                <div 
                  v-show="showDropdown" 
                  class="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-3 space-y-2 max-h-60 overflow-y-auto"
                >
                  <!-- Search Bar inside Dropdown -->
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <i class="bi bi-search text-xs"></i>
                    </span>
                    <input 
                      v-model="catSearch" 
                      type="text" 
                      placeholder="Search categories..." 
                      class="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-xs bg-slate-50 focus:outline-none focus:border-[#feb900] focus:bg-white transition-all"
                      @click.stop
                    />
                  </div>

                  <!-- Options List -->
                  <div class="space-y-0.5 mt-2">
                    <div 
                      v-for="cat in filteredCategories" 
                      :key="cat.id"
                      @click="toggleCategorySelection(cat.id)"
                      class="flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                      :class="isCategorySelected(cat.id) ? 'bg-amber-50 text-[#0f172a] font-bold' : 'text-slate-700 hover:bg-slate-50'"
                    >
                      <span>{{ cat.name }}</span>
                      <i v-if="isCategorySelected(cat.id)" class="bi bi-check-lg text-amber-600 font-bold"></i>
                    </div>
                    <div v-if="!filteredCategories.length" class="text-center py-4 text-xs text-slate-400">
                      No matching categories found
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sector -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sector</label>
                <select v-model="form.sector_id" required class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                  <option v-for="sec in options?.sectors || []" :key="sec.id" :value="sec.id">
                    {{ sec.sector || 'Sector ' + sec.id }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select v-model="form.status" class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
              <input v-model="form.location" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <RichTextEditor v-model="form.description" placeholder="Describe the project narrative..." />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Images (Comma separated filenames)</label>
              <input v-model="form.images" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" placeholder="image1.jpg, image2.jpg" />
              <p class="mt-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Or upload a new image below (added automatically)</p>
              
              <div class="mt-3 flex items-center gap-3">
                <input type="file" @change="handleFileUpload" accept="image/*" class="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:transition-colors file:cursor-pointer" />
                <span v-if="uploading" class="text-xs font-bold text-amber-600 animate-pulse flex items-center gap-1"><i class="bi bi-arrow-repeat animate-spin"></i> Uploading...</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Cost</label>
                <input v-model="form.project_cost" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Cost</label>
                <input v-model="form.service_cost" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Area</label>
                <input v-model="form.area" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Height</label>
                <input v-model="form.height" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Feature</label>
              <input v-model="form.feature" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Services (Comma separated)</label>
              <textarea v-model="form.services" rows="2" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors"></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-5 border-t border-slate-200">
          <button type="button" @click="router.push('/admin/projects')" class="bg-white py-2 px-5 border border-slate-300 rounded-full shadow-sm text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 focus:outline-none mr-3 transition-colors">Cancel</button>
          <button type="submit" :disabled="saving" class="bg-[#feb900] border border-transparent rounded-full shadow-sm py-2 px-5 text-xs font-bold hover:bg-[#e5a600] focus:outline-none disabled:opacity-50 transition-colors" style="color: #1e293b;">
            {{ saving ? 'Saving...' : 'Save Project' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const isNew = route.params.id === 'new';

const form = ref({
  title: '',
  category_ids: [],
  sector_id: 1,
  client_id: null,
  status: 'Completed',
  description: '',
  images: '',
  location: '',
  project_cost: '',
  service_cost: '',
  area: '',
  height: '',
  feature: '',
  services: '',
  show_status: '',
  story: ''
});

const saving = ref(false);
const uploading = ref(false);
const showDropdown = ref(false);
const catSearch = ref('');

const { data: options } = await useFetch('/api/admin/projects/options');

if (!isNew) {
  const { data: project } = await useFetch(`/api/admin/projects/${route.params.id}`);
  if (project.value) {
    // Populate form
    Object.keys(form.value).forEach(key => {
      if (project.value[key] !== undefined && project.value[key] !== null) {
        form.value[key] = project.value[key];
      }
    });
    // Populate category_ids from project_categories relationship
    if (project.value.project_categories) {
      form.value.category_ids = project.value.project_categories.map(pc => pc.category_id);
    }
  }
}

// Close dropdown on click outside
if (process.client) {
  window.addEventListener('click', (e) => {
    const relative = document.querySelector('.relative-dropdown-container');
    if (relative && !relative.contains(e.target)) {
      showDropdown.value = false;
    }
  });
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const getCategoryName = (catId) => {
  const cat = options.value?.categories?.find(c => c.id === catId);
  return cat ? cat.name : 'Category #' + catId;
};

const filteredCategories = computed(() => {
  const allCats = options.value?.categories || [];
  if (!catSearch.value.trim()) return allCats;
  return allCats.filter(c => 
    c.name?.toLowerCase().includes(catSearch.value.toLowerCase())
  );
});

const isCategorySelected = (catId) => {
  return form.value.category_ids.includes(catId);
};

const toggleCategorySelection = (catId) => {
  const idx = form.value.category_ids.indexOf(catId);
  if (idx > -1) {
    form.value.category_ids.splice(idx, 1);
  } else {
    form.value.category_ids.push(catId);
  }
};

const removeCategory = (catId) => {
  const idx = form.value.category_ids.indexOf(catId);
  if (idx > -1) {
    form.value.category_ids.splice(idx, 1);
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await $fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    
    if (res.success) {
      if (form.value.images) {
        form.value.images += `, ${res.filename}`;
      } else {
        form.value.images = res.filename;
      }
    }
  } catch (error) {
    alert('Upload failed: ' + (error.data?.statusMessage || error.message));
  } finally {
    uploading.value = false;
    event.target.value = ''; // Reset input
  }
};

const saveProject = async () => {
  saving.value = true;
  try {
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${route.params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    await $fetch(url, { method, body: form.value });
    router.push('/admin/projects');
  } catch (error) {
    alert(error.data?.statusMessage || 'Failed to save project');
  } finally {
    saving.value = false;
  }
};
</script>
