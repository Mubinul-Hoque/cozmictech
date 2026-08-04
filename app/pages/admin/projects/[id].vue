<template>
  <div class="font-sans">
    <div class="mb-6 flex flex-col gap-1">
      <NuxtLink to="/admin/projects" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 mb-1">
        <Icon name="lucide:arrow-left" /> Back to Projects
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
                    <Icon name="lucide:x" class="text-sm leading-none text-slate-400 hover:text-red-650 transition-colors" />
                  </span>
                  
                  <!-- Placeholder / Trigger label -->
                  <span v-if="!form.category_ids?.length" class="text-slate-400 text-sm pl-2 select-none">
                    Select categories...
                  </span>
                  
                  <!-- Chevron Indicator -->
                  <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Icon :name="showDropdown ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
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
                      <Icon name="lucide:search" class="text-xs" />
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
                      <Icon v-if="isCategorySelected(cat.id)" name="lucide:check" class="text-amber-600 font-bold" />
                    </div>
                    <div v-if="!filteredCategories.length" class="text-center py-4 text-xs text-slate-400">
                      No matching categories found
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sector & Client -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sector *</label>
                  <select v-model="form.sector_id" required class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                    <option v-for="sec in options?.sectors || []" :key="sec.id" :value="sec.id">
                      {{ sec.sector || 'Sector ' + sec.id }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Client</label>
                  <select v-model="form.client_id" class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                    <option :value="null">No Client (Internal/Unassigned)</option>
                    <option v-for="client in options?.clients || []" :key="client.id" :value="client.id">
                      {{ client.client_name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select v-model="form.status" class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                <input v-model="form.start_date" type="date" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Date</label>
                <input v-model="form.end_date" type="date" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
              <input v-model="form.location" type="text" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <LazyRichTextEditor v-model="form.description" placeholder="Describe the project narrative..." />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Images</label>
              
              <!-- Image Gallery Preview -->
              <div v-if="form.images && form.images.length > 0" class="flex flex-wrap gap-3 mb-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative group w-20 h-20 rounded-md overflow-hidden border border-slate-200 shadow-sm bg-white">
                  <img :src="`/assets/img/projects/${img}`" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" @click.prevent="removeImage(idx)" class="w-7 h-7 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm" title="Remove image">
                      <Icon name="lucide:trash-2" />
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="mb-3 p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-center text-xs text-slate-400">
                No images uploaded yet.
              </div>

              <!-- Drag & Drop Upload Zone -->
              <div 
                class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center gap-3 group"
                :class="isDragging ? 'border-[#feb900] bg-amber-50/50 scale-[1.02]' : 'border-slate-300 hover:border-[#feb900] bg-slate-50 hover:bg-white'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
              >
                <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#feb900] transition-colors" :class="{'text-[#feb900]': isDragging}">
                  <Icon v-if="uploading" name="lucide:loader-2" class="animate-spin text-xl text-amber-500" />
                  <Icon v-else name="lucide:cloud-upload" class="text-xl" />
                </div>
                
                <div v-if="uploading" class="text-sm font-bold text-amber-600 animate-pulse">
                  Uploading image(s)...
                </div>
                <div v-else>
                  <p class="text-sm font-bold text-slate-700">Drag & drop images here, or</p>
                  <label class="text-xs font-bold text-[#feb900] hover:text-amber-600 cursor-pointer mt-1 inline-block transition-colors bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg">
                    browse files
                    <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" multiple />
                  </label>
                  <p class="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider">Supports JPG, PNG (Max 500KB per image)</p>
                </div>
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
  start_date: '',
  end_date: '',
  description: '',
  images: [],
  location: '',
  project_cost: '',
  service_cost: '',
  area: '',
  height: '',
  feature: '',
  services: '',
  story: ''
});

const saving = ref(false);
const uploading = ref(false);
const showDropdown = ref(false);
const catSearch = ref('');
const isDragging = ref(false);


const { data: options } = await useFetch('/api/admin/projects/options');

onMounted(async () => {
  if (!isNew) {
    try {
      const project = await useNuxtApp().$fetch(`/api/admin/projects/${route.params.id}`);
      if (project) {
        // Populate form
        Object.keys(form.value).forEach(key => {
          if (project[key] !== undefined && project[key] !== null) {
            if (key === 'images' && !Array.isArray(project[key])) {
              // Fallback if data hasn't been migrated properly
              form.value[key] = project[key] ? String(project[key]).split(',').map(s => s.trim()) : [];
            } else if ((key === 'start_date' || key === 'end_date') && project[key]) {
              form.value[key] = String(project[key]).split('T')[0];
            } else {
              form.value[key] = project[key];
            }
          }
        });
        // Populate category_ids from project_categories relationship
        if (project.project_categories) {
          form.value.category_ids = project.project_categories.map(pc => pc.category_id);
        }
      }
    } catch (err) {
      useToast().error('Failed to load project data');
    }
  }
});

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

const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    useToast().error(`Invalid file format: ${file.name}. Only JPG and PNG are allowed.`);
    return false;
  }
  
  if (file.size > 500 * 1024) { // 500 KB limit
    useToast().error(`File too large: ${file.name}. Maximum size is 500KB.`);
    return false;
  }
  
  return true;
};

const processFile = async (file) => {
  if (!file || !validateFile(file)) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'projects');

  try {
    const res = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    
    if (res.success) {
      if (!Array.isArray(form.value.images)) {
        form.value.images = [];
      }
      form.value.images.push(res.filename);
      clearNuxtData();
    useToast().success('Image uploaded successfully');
    }
  } catch (error) {
    useToast().error('Upload failed: ' + (error.data?.statusMessage || error.message));
  } finally {
    uploading.value = false;
  }
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files || !files.length) return;
  
  for (let i = 0; i < files.length; i++) {
    await processFile(files[i]);
  }
  event.target.value = ''; // Reset input
};

const handleFileDrop = async (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (!files || !files.length) return;
  
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.startsWith('image/')) {
      await processFile(files[i]);
    } else {
      useToast().error('Only image files are allowed: ' + files[i].name);
    }
  }
};

const removeImage = (idx) => {
  if (Array.isArray(form.value.images)) {
    form.value.images.splice(idx, 1);
  }
};

const saveProject = async () => {
  saving.value = true;
  try {
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${route.params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    await useNuxtApp().$fetch(url, { method, body: form.value });
    
    // Clear Nuxt's client-side useFetch cache so that public pages load fresh data
    clearNuxtData();
    await refreshNuxtData('admin-projects-list');

    clearNuxtData();
    useToast().success('Project saved successfully!');
    router.push('/admin/projects');
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save project');
  } finally {
    saving.value = false;
  }
};
</script>
