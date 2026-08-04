<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">
          {{ isNew ? 'Add Business Service' : 'Edit Service Details' }}
        </h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
          {{ isNew ? 'Add a new operational service' : 'Update existing service information' }}
        </p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/services" 
          class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 border border-slate-200 active:scale-95"
        >
          <Icon name="lucide:arrow-left" /> Cancel
        </NuxtLink>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:x-circle" class="text-rose-400 text-lg" />
        <span class="font-bold text-rose-300">{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div v-if="loadingData" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <form v-else @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Service Name -->
          <div>
            <label for="name" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Name</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              required 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. Geotechnical Investigation" 
            />
          </div>

          <!-- Icon Picker (Lucide) -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Icon</label>
            <div class="flex flex-col sm:flex-row gap-6">
              
              <!-- Live Preview & Input -->
              <div class="flex-shrink-0 sm:w-64 space-y-3">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#feb900]">
                    <Icon :name="form.icon || 'lucide:activity'" mode="svg" class="text-xl" />
                  </div>
                  <input 
                    id="icon" 
                    v-model="form.icon" 
                    type="text" 
                    required 
                    class="block w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm font-medium" 
                    placeholder="e.g. lucide:building" 
                  />
                </div>
                <p class="text-[10px] text-slate-500 leading-tight">
                  Select an icon from the grid or enter any valid <a href="https://icones.js.org/collection/lucide" target="_blank" class="text-blue-500 hover:underline">Lucide icon name</a> (e.g. `lucide:hard-hat`).
                </p>
              </div>

              <!-- Icon Grid (Curated) -->
              <div class="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-4 h-48 overflow-y-auto">
                <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  <button 
                    v-for="icon in popularIcons" 
                    :key="icon"
                    type="button"
                    @click="form.icon = 'lucide:' + icon"
                    class="p-2.5 rounded-xl border flex items-center justify-center transition-all hover:scale-110"
                    :class="form.icon === 'lucide:' + icon ? 'bg-[#feb900] text-slate-900 border-[#feb900] shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'"
                    :title="'lucide:' + icon"
                  >
                    <Icon :name="'lucide:' + icon" mode="svg" class="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cover Image Upload -->
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Cover Image</label>
          <div class="flex items-center gap-4">
            <div class="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
              <img 
                v-if="form.image" 
                :src="form.image.includes('/') ? form.image : '/assets/img/sectors/' + form.image" 
                class="w-full h-full object-cover" 
                @error="$event.target.src='/assets/img/services.jpg'"
              />
              <i v-else class="bi bi-image text-2xl text-slate-300"></i>
            </div>
            
            <div class="space-y-1">
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileUpload" 
                accept="image/*" 
                class="hidden" 
              />
              <button 
                type="button" 
                @click="$refs.fileInput.click()" 
                :disabled="uploading"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
              >
                {{ uploading ? 'Uploading...' : 'Choose Image' }}
              </button>
              <p class="text-[10px] text-slate-400">Supported formats: JPG, PNG, WEBP (Max 2MB)</p>
            </div>
          </div>
        </div>

        <!-- Short Description -->
        <div>
          <label for="short_description" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Summary Description</label>
          <textarea 
            id="short_description" 
            v-model="form.short_description" 
            rows="3" 
            class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm leading-relaxed" 
            placeholder="Write a brief overview snippet for homepage service cards..."
          ></textarea>
        </div>

        <!-- Long Description -->
        <div>
          <label for="description" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Service Description</label>
          <LazyRichTextEditor 
            id="description" 
            v-model="form.description" 
            placeholder="Write detailed info about the engineering sector and services provided. Formatting options are supported."
          />
        </div>

        <!-- Submit Buttons -->
        <div class="border-t border-slate-100 pt-6 flex justify-end gap-3">
          <NuxtLink 
            to="/admin/services" 
            class="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wider uppercase border border-slate-200 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="saving"
            class="px-6 py-2.5 bg-[#feb900] hover:bg-amber-500 text-slate-950 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving Service...' : 'Save Service' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Service Details'
});

const route = useRoute();
const router = useRouter();
const isNew = computed(() => route.params.id === 'new');
const id = parseInt(route.params.id || '0');

const loadingData = ref(false);
const uploading = ref(false);
const saving = ref(false);
const errorMsg = ref('');

const form = ref({
  name: '',
  icon: 'lucide:activity',
  image: '',
  short_description: '',
  description: ''
});

onMounted(async () => {
  if (!isNew.value) {
    loadingData.value = true;
    try {
      const data = await useNuxtApp().$fetch(`/api/admin/services/${id}`);
      form.value = {
        name: data.name || '',
        icon: data.icon || 'lucide:activity',
        image: data.image || '',
        short_description: data.short_description || '',
        description: data.description || ''
      };
    } catch (err) {
      console.error(err);
      errorMsg.value = 'Failed to load service information.';
    } finally {
      loadingData.value = false;
    }
  }
});

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'services');

  uploading.value = true;
  errorMsg.value = '';

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    form.value.image = data.filename;
  } catch (err) {
    console.error(err);
    errorMsg.value = 'File upload failed. Make sure it is an image and is under 2MB.';
  } finally {
    uploading.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  errorMsg.value = '';

  const url = isNew.value ? '/api/admin/services' : `/api/admin/services/${id}`;
  const method = isNew.value ? 'POST' : 'PUT';

  try {
    await useNuxtApp().$fetch(url, {
      method,
      body: form.value
    });
    clearNuxtData();
    useToast().success('Saved successfully');
    await refreshNuxtData('admin-services-list'); // Force Nuxt to fetch fresh list data
    router.push('/admin/services');
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Failed to save service details. Please try again.';
  } finally {
    saving.value = false;
  }
};
const popularIcons = [
  'building-2', 'building', 'hard-hat', 'wrench', 'hammer', 'map-pin',
  'map', 'ruler', 'compass', 'truck', 'shield-check', 'users',
  'file-text', 'clipboard-check', 'check-circle', 'activity',
  'briefcase', 'lightbulb', 'globe', 'home', 'factory', 'landmark',
  'settings', 'cog', 'zap', 'flame', 'droplets', 'leaf', 'mountain',
  'waves', 'wind', 'scale', 'book-open', 'calculator', 'bar-chart',
  'network', 'cpu', 'database', 'cloud', 'layout-grid', 'list',
  'alert-circle', 'info', 'check', 'x', 'star', 'pen-tool', 'user'
];
</script>
