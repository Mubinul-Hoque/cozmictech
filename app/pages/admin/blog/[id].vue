<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">
          {{ isNew ? 'Compose Blog Article' : 'Edit Blog Article' }}
        </h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
          {{ isNew ? 'Publish new engineering insights or corporate news' : 'Update existing published article content' }}
        </p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/blog" 
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
          <!-- Article Title -->
          <div class="sm:col-span-2">
            <label for="title" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Title</label>
            <input 
              id="title" 
              v-model="form.title" 
              type="text" 
              required 
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. Fostering Innovation in Engineering" 
            />
          </div>

          <!-- Category -->
          <div>
            <label for="post_catid" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
            <select 
              id="post_catid" 
              v-model="form.post_catid" 
              required
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm"
            >
              <option :value="1">Events</option>
              <option :value="2">Engineering</option>
              <option :value="3">Research</option>
              <option :value="4">Insights</option>
            </select>
          </div>

          <!-- Author -->
          <div>
            <label for="author" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Author</label>
            <input 
              id="author" 
              v-model="form.author" 
              type="text" 
              required
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. Authority" 
            />
          </div>

          <!-- Display Date -->
          <div>
            <label for="sdate" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Date</label>
            <input 
              id="sdate" 
              v-model="form.sdate" 
              type="text" 
              required
              class="block w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm" 
              placeholder="e.g. 29-06-2026" 
            />
          </div>
        </div>

        <!-- Cover Image Upload -->
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image</label>
          <div class="flex items-center gap-4">
            <div class="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
              <img 
                v-if="form.image" 
                :src="form.image.includes('/') ? form.image : '/assets/img/blog/' + form.image" 
                class="w-full h-full object-cover" 
                @error="$event.target.src='/assets/img/blog/blog-1.jpg'"
              />
              <Icon v-else name="lucide:image" class="text-2xl text-slate-300" />
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

        <!-- Main Body Content -->
        <div>
          <label for="content" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content (HTML / Paragraphs supported)</label>
          <LazyRichTextEditor 
            id="content" 
            v-model="form.content" 
            placeholder="Write the full body content of the blog post. Formatting options are supported."
          />
        </div>

        <!-- Submit Buttons -->
        <div class="border-t border-slate-100 pt-6 flex justify-end gap-3">
          <NuxtLink 
            to="/admin/blog" 
            class="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wider uppercase border border-slate-200 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="saving"
            class="px-6 py-2.5 bg-[#feb900] hover:bg-amber-500 text-slate-950 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving Post...' : 'Publish Post' }}
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
  title: 'Article Composer'
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
  title: '',
  post_catid: 2,
  author: 'Authority',
  sdate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), // e.g. "29-06-2026"
  image: '',
  content: ''
});

onMounted(async () => {
  if (!isNew.value) {
    loadingData.value = true;
    try {
      const data = await useNuxtApp().$fetch(`/api/admin/blog/${id}`);
      form.value = {
        title: data.title || '',
        post_catid: data.post_catid || 2,
        author: data.author || 'Authority',
        sdate: data.sdate || '',
        image: data.image || '',
        content: data.content || ''
      };
    } catch (err) {
      console.error(err);
      errorMsg.value = 'Failed to load blog post details.';
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
  formData.append('folder', 'blog');

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

  const url = isNew.value ? '/api/admin/blog' : `/api/admin/blog/${id}`;
  const method = isNew.value ? 'POST' : 'PUT';

  try {
    await useNuxtApp().$fetch(url, {
      method,
      body: form.value
    });
    clearNuxtData();
    useToast().success('Saved successfully');
    await refreshNuxtData('admin-blog-list');
    router.push('/admin/blog');
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Failed to save blog article. Please try again.';
  } finally {
    saving.value = false;
  }
};
</script>
