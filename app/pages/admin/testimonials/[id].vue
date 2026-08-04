<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">
          {{ isNew ? 'Create New Testimonial' : 'Edit Testimonial' }}
        </h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
          {{ isNew ? 'Add a new client review to database' : 'Update existing review details' }}
        </p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/testimonials" 
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

      <form v-else @submit.prevent="handleSave" class="space-y-6 max-w-2xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Client Name -->
          <div>
            <label for="name" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Name</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              required 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. Mr. Zhao" 
            />
          </div>

          <!-- Designation -->
          <div>
            <label for="designation" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
            <input 
              id="designation" 
              v-model="form.designation" 
              type="text" 
              required 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. Project Engineer" 
            />
          </div>

          <!-- Company -->
          <div>
            <label for="company" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company</label>
            <input 
              id="company" 
              v-model="form.company" 
              type="text" 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. TBEA" 
            />
          </div>

          <!-- Stars Rating -->
          <div>
            <label for="stars" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stars Rating</label>
            <select 
              id="stars" 
              v-model="form.stars" 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm"
            >
              <option :value="5">5 Stars (Excellent)</option>
              <option :value="4">4 Stars (Good)</option>
              <option :value="3">3 Stars (Average)</option>
              <option :value="2">2 Stars (Fair)</option>
              <option :value="1">1 Star (Poor)</option>
            </select>
          </div>
        </div>

        <!-- Image Upload Component -->
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Image / Photo</label>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
              <img 
                v-if="form.image" 
                :src="form.image.includes('/') ? form.image : '/assets/img/testimonials/' + form.image" 
                class="w-full h-full object-cover" 
                @error="$event.target.src='/assets/img/testimonials/testimonials-1.jpg'"
              />
              <Icon v-else name="lucide:user" class="text-3xl text-slate-300" />
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
              <p class="text-[10px] text-slate-400">Supported formats: JPG, PNG, WEBP (Max 500KB)</p>
            </div>
          </div>
        </div>

        <!-- Comment / Story Body -->
        <div>
          <label for="story" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Review / Story</label>
          <textarea 
            id="story" 
            v-model="form.story" 
            rows="5" 
            required 
            class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm leading-relaxed" 
            placeholder="Write the testimonial story here..."
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="border-t border-slate-100 pt-6 flex justify-end gap-3">
          <NuxtLink 
            to="/admin/testimonials" 
            class="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wider uppercase border border-slate-200 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="saving"
            class="px-6 py-2.5 bg-[#feb900] hover:bg-amber-500 text-slate-950 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving Changes...' : 'Save Testimonial' }}
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
  title: 'Testimonials Detail'
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
  designation: '',
  company: '',
  stars: 5,
  image: '',
  story: ''
});

onMounted(async () => {
  if (!isNew.value) {
    loadingData.value = true;
    try {
      const data = await useNuxtApp().$fetch(`/api/admin/testimonials/${id}`);
      form.value = {
        name: data.name || '',
        designation: data.designation || '',
        company: data.company || '',
        stars: data.stars || 5,
        image: data.image || '',
        story: data.story || ''
      };
    } catch (err) {
      console.error(err);
      errorMsg.value = 'Failed to load testimonial details.';
    } finally {
      loadingData.value = false;
    }
  }
});

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 500 * 1024) {
    errorMsg.value = 'Client Image size limit is 500KB. Please choose a smaller image.';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'testimonials');

  uploading.value = true;
  errorMsg.value = '';

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    // For testimonials, we save them under assets/img/testimonials, but upload API returns /assets/img/{name}
    // We store the base filename and resolution logic handle the prefixing
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

  const url = isNew.value ? '/api/admin/testimonials' : `/api/admin/testimonials/${id}`;
  const method = isNew.value ? 'POST' : 'PUT';

  try {
    await useNuxtApp().$fetch(url, {
      method,
      body: form.value
    });
    clearNuxtData();
    useToast().success('Saved successfully');
    await refreshNuxtData('admin-testimonials-list');
    router.push('/admin/testimonials');
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Failed to save testimonial record. Please try again.';
  } finally {
    saving.value = false;
  }
};
</script>
