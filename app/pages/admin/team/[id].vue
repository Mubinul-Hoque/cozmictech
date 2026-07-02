<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">
          {{ isNew ? 'Add Team Member' : 'Edit Member Profile' }}
        </h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
          {{ isNew ? 'Add a new member profile to directory' : 'Update existing profile details' }}
        </p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/team" 
          class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 border border-slate-200 active:scale-95"
        >
          <i class="bi bi-arrow-left"></i> Cancel
        </NuxtLink>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <i class="bi bi-x-circle-fill text-rose-400 text-lg"></i>
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
          <!-- Member Name -->
          <div>
            <label for="name" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              required 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. Mrs. Zannatul Ferdusi" 
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
              placeholder="e.g. Chief Executive Officer" 
            />
          </div>



          <!-- Facebook URL -->
          <div>
            <label for="fb" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facebook Link (Optional)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><i class="bi bi-facebook"></i></span>
              <input 
                id="fb" 
                v-model="form.fb" 
                type="url" 
                class="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
                placeholder="e.g. https://facebook.com/username" 
              />
            </div>
          </div>

          <!-- Instagram URL -->
          <div>
            <label for="insta" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instagram Link (Optional)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><i class="bi bi-instagram"></i></span>
              <input 
                id="insta" 
                v-model="form.insta" 
                type="url" 
                class="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
                placeholder="e.g. https://instagram.com/username" 
              />
            </div>
          </div>

          <!-- LinkedIn URL -->
          <div>
            <label for="linkedin" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">LinkedIn Link (Optional)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><i class="bi bi-linkedin"></i></span>
              <input 
                id="linkedin" 
                v-model="form.linkedin" 
                type="url" 
                class="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
                placeholder="e.g. https://linkedin.com/in/username" 
              />
            </div>
          </div>
        </div>

        <!-- Image Upload Component -->
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Image / Photo</label>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
              <img 
                v-if="form.image" 
                :src="form.image.includes('/') ? form.image : '/assets/img/team/' + form.image" 
                class="w-full h-full object-cover" 
                @error="$event.target.src='/assets/img/team/team-1.jpg'"
              />
              <i v-else class="bi bi-person text-3xl text-slate-300"></i>
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

        <!-- Member Statement / message -->
        <div>
          <label for="message" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Statement / Message</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            rows="5" 
            class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm leading-relaxed" 
            placeholder="Write a short statement or introductory message..."
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="border-t border-slate-100 pt-6 flex justify-end gap-3">
          <NuxtLink 
            to="/admin/team" 
            class="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wider uppercase border border-slate-200 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="saving"
            class="px-6 py-2.5 bg-[#feb900] hover:bg-amber-500 text-slate-950 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving Profile...' : 'Save Member' }}
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
  title: 'Team Member Detail'
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
  message: '',
  image: '',
  fb: '',
  insta: '',
  linkedin: ''
});

onMounted(async () => {
  if (!isNew.value) {
    loadingData.value = true;
    try {
      const data = await $fetch(`/api/admin/team/${id}`);
      form.value = {
        name: data.name || '',
        designation: data.designation || '',
        message: data.message || '',
        image: data.image || '',
        fb: data.fb || '',
        insta: data.insta || '',
        linkedin: data.linkedin || ''
      };
    } catch (err) {
      console.error(err);
      errorMsg.value = 'Failed to load member profile details.';
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

  uploading.value = true;
  errorMsg.value = '';

  try {
    const data = await $fetch('/api/admin/upload', {
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

  const url = isNew.value ? '/api/admin/team' : `/api/admin/team/${id}`;
  const method = isNew.value ? 'POST' : 'PUT';

  try {
    await $fetch(url, {
      method,
      body: form.value
    });
    router.push('/admin/team');
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Failed to save member profile. Please try again.';
  } finally {
    saving.value = false;
  }
};
</script>
