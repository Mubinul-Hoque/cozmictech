<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Services</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Configure company operations & services</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/services/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95"
        >
          <Icon name="lucide:plus" class="text-sm" /> Add Service
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="pageContentError" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:exclamation-triangle-fill" class="text-rose-500 text-lg" />
        <span class="font-bold text-slate-700">{{ pageContentError }}</span>
      </div>
    </div>

    <!-- Services Page Content (Hero / Process / CTA) -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm">
      <button
        type="button"
        @click="contentOpen = !contentOpen"
        class="w-full flex items-center justify-between p-6 cursor-pointer select-none"
      >
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <Icon name="lucide:layout-template" class="text-[#feb900]" /> Services Page Content
          </h3>
          <p class="text-xs text-slate-400 mt-1">Hero banner, methodology process steps & closing call-to-action for the public /services page</p>
        </div>
        <Icon name="lucide:chevron-down" class="text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': contentOpen }" />
      </button>

      <div v-show="contentOpen" class="px-6 pb-8 space-y-8 border-t border-slate-100 pt-6">
        <div v-if="contentPending" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
        </div>

        <template v-else>
          <!-- Section Header (Landing & Services Hero) -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="lucide:server" class="text-amber-500" /> Section Header
            </h4>
            <p class="text-xs text-slate-400">Controls the primary heading and description on the public /services hero and the homepage services section.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                <input type="text" v-model="pageContent.section_title" placeholder="Our Services" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tagline / Short Description</label>
                <input type="text" v-model="pageContent.section_tagline" placeholder="Brief overview of services..." class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>
          </div>

          <!-- Hero Section -->
          <div class="space-y-4 border-t border-slate-100 pt-6">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Hero Banner</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
                <input type="text" v-model="pageContent.hero_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Caption Label</label>
                <input type="text" v-model="pageContent.hero_caption_label" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Caption Location</label>
                <input type="text" v-model="pageContent.hero_caption_location" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Photograph</label>
                <div class="flex items-center gap-3">
                  <img v-if="pageContent.hero_image" :src="pageContent.hero_image" class="w-20 h-14 object-cover rounded-lg border border-slate-200" />
                  <input type="file" accept="image/*" @change="handleContentImageUpload($event, 'hero_image')" class="text-xs" />
                  <span v-if="uploadingField === 'hero_image'" class="text-xs text-slate-400">Uploading...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Process Section -->
          <div class="space-y-4 border-t border-slate-100 pt-6">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Methodology / Process</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
                <input type="text" v-model="pageContent.process_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Section Heading</label>
                <input type="text" v-model="pageContent.process_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Image Caption</label>
                <input type="text" v-model="pageContent.process_caption" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Process Photograph</label>
                <div class="flex items-center gap-3">
                  <img v-if="pageContent.process_image" :src="pageContent.process_image" class="w-20 h-14 object-cover rounded-lg border border-slate-200" />
                  <input type="file" accept="image/*" @change="handleContentImageUpload($event, 'process_image')" class="text-xs" />
                  <span v-if="uploadingField === 'process_image'" class="text-xs text-slate-400">Uploading...</span>
                </div>
              </div>
            </div>

            <!-- Steps Repeater -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Process Steps</label>
                <button type="button" @click="addStep" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#feb900] hover:text-amber-600">
                  <Icon name="lucide:plus-circle" /> Add Step
                </button>
              </div>

              <div
                v-for="(step, idx) in pageContent.process_steps"
                :key="idx"
                class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-slate-400">Step {{ String(idx + 1).padStart(2, '0') }}</span>
                  <div class="flex items-center gap-1">
                    <button type="button" @click="moveStep(idx, -1)" :disabled="idx === 0" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center justify-center">
                      <Icon name="lucide:chevron-up" class="text-xs" />
                    </button>
                    <button type="button" @click="moveStep(idx, 1)" :disabled="idx === pageContent.process_steps.length - 1" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center justify-center">
                      <Icon name="lucide:chevron-down" class="text-xs" />
                    </button>
                    <button type="button" @click="removeStep(idx)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center">
                      <Icon name="lucide:trash-2" class="text-xs" />
                    </button>
                  </div>
                </div>
                <input type="text" v-model="step.title" placeholder="Step title" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <textarea v-model="step.description" rows="2" placeholder="Step description" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"></textarea>
              </div>

              <p v-if="!pageContent.process_steps.length" class="text-xs text-slate-400 text-center py-4">No steps yet. Click "Add Step" to create the process timeline shown on the public Services page.</p>
            </div>
          </div>

          <!-- CTA Banner -->
          <div class="space-y-4 border-t border-slate-100 pt-6">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Closing Call-To-Action Banner</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
                <input type="text" v-model="pageContent.cta_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Heading</label>
                <input type="text" v-model="pageContent.cta_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Body Text</label>
              <textarea rows="3" v-model="pageContent.cta_body" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"></textarea>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="button"
              @click="savePageContent"
              :disabled="savingContent"
              class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <span v-if="savingContent" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
              <Icon v-else name="lucide:check" class="text-sm" />
              {{ savingContent ? 'Saving...' : 'Save Page Content' }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <div v-else-if="!sectors || !sectors.length" class="text-center py-20 text-slate-400">
        <Icon name="lucide:server" class="text-4xl mb-4 block" />
        <p class="font-semibold">No services defined. Add a service to get started.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Name</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Icon Badge</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Description</th>
              <th scope="col" class="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="s in sectors || []" :key="s.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-slate-800">{{ s.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl">
                  <Icon :name="s.icon || 'lucide:activity'" mode="svg" class="text-slate-500" />
                  {{ s.icon }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{{ s.short_description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="inline-flex gap-2">
                  <NuxtLink 
                    :to="'/admin/services/' + s.id" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <Icon name="lucide:pencil" />
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(s.id)" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <Icon name="lucide:trash-2" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Services'
});

const successMsg = ref('');
const headers = useRequestHeaders(['cookie']);
const { data: sectors, pending, refresh } = useFetch('/api/admin/services', { headers, key: 'admin-services-list' });

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      successMsg.value = 'Service deleted successfully.';
      setTimeout(() => successMsg.value = '', 4000);
      clearNuxtData();
      refresh();
    } catch (err) {
      console.error(err);
      useToast().error('Delete operation failed.');
    }
  }
};

// ─── Services Page Content (Hero / Process / CTA) ────────────────────────
const contentOpen = ref(false);
const contentPending = ref(true);
const savingContent = ref(false);
const uploadingField = ref('');
const pageContentError = ref('');

const pageContent = reactive({
  section_title: '',
  section_tagline: '',
  hero_eyebrow: '',
  hero_image: '',
  hero_caption_label: '',
  hero_caption_location: '',
  process_eyebrow: '',
  process_heading: '',
  process_image: '',
  process_caption: '',
  process_steps: [],
  cta_eyebrow: '',
  cta_heading: '',
  cta_body: ''
});

const loadPageContent = async () => {
  contentPending.value = true;
  try {
    const res = await useNuxtApp().$fetch('/api/admin/services/page-content');
    if (res.success && res.content) {
      Object.assign(pageContent, res.content);
    }
  } catch (err) {
    console.error(err);
    pageContentError.value = 'Failed to load services page content.';
  } finally {
    contentPending.value = false;
  }
};

onMounted(loadPageContent);

const addStep = () => {
  pageContent.process_steps.push({ title: '', description: '' });
};

const removeStep = (idx) => {
  pageContent.process_steps.splice(idx, 1);
};

const moveStep = (idx, dir) => {
  const target = idx + dir;
  if (target < 0 || target >= pageContent.process_steps.length) return;
  const steps = pageContent.process_steps;
  [steps[idx], steps[target]] = [steps[target], steps[idx]];
};

const handleContentImageUpload = async (event, field) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'services');

  uploadingField.value = field;
  pageContentError.value = '';

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    pageContent[field] = data.url;
  } catch (err) {
    console.error(err);
    pageContentError.value = err?.data?.statusMessage || err?.message || 'Image upload failed. Make sure it is an image and is under 5MB.';
  } finally {
    uploadingField.value = '';
  }
};

const savePageContent = async () => {
  savingContent.value = true;
  pageContentError.value = '';
  successMsg.value = '';

  try {
    const res = await useNuxtApp().$fetch('/api/admin/services/page-content', {
      method: 'POST',
      body: pageContent
    });
    if (res.success) {
      successMsg.value = 'Services page content saved successfully.';
      setTimeout(() => successMsg.value = '', 4000);
    }
  } catch (err) {
    console.error(err);
    pageContentError.value = 'Failed to save services page content.';
  } finally {
    savingContent.value = false;
  }
};
</script>
