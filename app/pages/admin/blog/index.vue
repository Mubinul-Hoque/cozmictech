<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Blog Articles</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Configure news, updates, & research insights</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/blog/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95"
        >
          <Icon name="lucide:plus" class="text-sm" /> Write Article
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm mb-6">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="pageContentError" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm mb-6">
      <div class="flex items-center gap-3">
        <Icon name="lucide:exclamation-triangle-fill" class="text-rose-500 text-lg" />
        <span class="font-bold text-slate-700">{{ pageContentError }}</span>
      </div>
    </div>

    <!-- Blog Page Header Content -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm mb-6">
      <button
        type="button"
        @click="contentOpen = !contentOpen"
        class="w-full flex items-center justify-between p-6 cursor-pointer select-none"
      >
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <Icon name="lucide:layout-template" class="text-[#feb900]" /> Blog Page Header
          </h3>
          <p class="text-xs text-slate-400 mt-1">Hero eyebrow, heading &amp; intro paragraph for the public /blog page</p>
        </div>
        <Icon name="lucide:chevron-down" class="text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': contentOpen }" />
      </button>

      <div v-show="contentOpen" class="px-6 pb-8 space-y-5 border-t border-slate-100 pt-6">
        <div v-if="contentPending" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
        </div>
        <template v-else>
          <!-- Public /blog Page Header -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Public /blog Page Header</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
                <input type="text" v-model="pageContent.hero_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Heading</label>
                <input type="text" v-model="pageContent.hero_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Intro Paragraph</label>
              <textarea rows="3" v-model="pageContent.hero_body" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"></textarea>
            </div>
          </div>

          <!-- Homepage News & Insights Section Header -->
          <div class="space-y-4 border-t border-slate-100 pt-6">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="lucide:book-open-text" class="text-amber-500" /> Homepage News &amp; Insights Section Header
            </h4>
            <p class="text-xs text-slate-400">Controls the title and tagline displayed above the recent articles section on the homepage.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Section Title</label>
                <input type="text" v-model="pageContent.home_section_title" placeholder="Recent News & Perspectives" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tagline / Short Description</label>
                <input type="text" v-model="pageContent.home_section_tag" placeholder="Discourse, field studies, and infrastructure progress..." class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-1">
            <button
              type="button"
              @click="savePageContent"
              :disabled="savingContent"
              class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <span v-if="savingContent" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
              <Icon v-else name="lucide:check" class="text-sm" />
              {{ savingContent ? 'Saving...' : 'Save Page Header' }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
      <div class="relative max-w-sm w-full">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon name="lucide:search" class="text-slate-400" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" 
          placeholder="Search articles..."
        />
      </div>
      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          class="px-4 py-2 bg-white border border-slate-350 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.name }}</option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!postsData?.data?.length" class="text-center py-20 text-slate-400">
        <Icon name="lucide:book-open-text" class="text-4xl mb-4 block" />
        <p class="font-semibold">No blog articles found. Write your first article or reset filters.</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article Title</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Author</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="post in postsData?.data || []" :key="post.id" class="hover:bg-slate-55 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-8 rounded overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img 
                      :src="post.image ? (post.image.includes('/') ? post.image : '/assets/img/blog/' + post.image) : '/assets/img/blog/blog-1.jpg'" 
                      class="w-full h-full object-cover" 
                      @error="$event.target.src='/assets/img/blog/blog-1.jpg'"
                    />
                  </div>
                  <div class="max-w-xs sm:max-w-sm truncate text-sm font-bold text-slate-800">
                    {{ post.title }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">{{ post.author || 'Authority' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {{ getCategoryLabel(post.post_catid) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-semibold">{{ post.sdate || 'Recent' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="inline-flex gap-2">
                  <NuxtLink 
                    :to="'/admin/blog/' + post.id" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <Icon name="lucide:pencil" />
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(post.id)" 
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

      <!-- Pagination Footer -->
      <div v-if="postsData?.data?.length" class="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Showing <span class="font-extrabold text-slate-700">{{ postsData?.data?.length || 0 }}</span> of <span class="font-extrabold text-slate-700">{{ postsData?.total || 0 }}</span> articles
        </span>
        <div class="flex items-center gap-4">
          <span class="text-xs text-slate-500 font-semibold">Page {{ currentPage }} of {{ postsData?.totalPages || 1 }}</span>
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
              :disabled="currentPage >= (postsData?.totalPages || 1)"
              class="px-4 py-1.5 border border-slate-300 rounded-full text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Blog Articles'
});

const successMsg = ref('');
const searchQuery = ref('');
const debouncedSearch = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Fetch posts with reactive query parameters for pagination and filtering
const { data: postsData, pending, refresh } = useFetch('/api/admin/blog', {
  query: {
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    catId: selectedCategory
  },
  key: 'admin-blog-list',
  watch: [currentPage, debouncedSearch, selectedCategory]
});

// Fetch real categories from the DB for the filter dropdown and labels
const { data: categoriesData } = await useFetch('/api/admin/categories', { key: 'admin-blog-categories' });
const categories = computed(() => categoriesData.value?.data || []);

// ─── Blog Page Header Content ────────────────────────────────────────────
const contentOpen = ref(false);
const contentPending = ref(true);
const savingContent = ref(false);
const pageContentError = ref('');

const pageContent = reactive({
  hero_eyebrow: '',
  hero_heading: '',
  hero_body: '',
  home_section_title: '',
  home_section_tag: ''
});

const loadPageContent = async () => {
  contentPending.value = true;
  try {
    const res = await useNuxtApp().$fetch('/api/admin/blog/page-content');
    if (res.success && res.content) {
      Object.assign(pageContent, res.content);
    }
  } catch (err) {
    console.error(err);
    pageContentError.value = 'Failed to load blog page header content.';
  } finally {
    contentPending.value = false;
  }
};

onMounted(loadPageContent);

const savePageContent = async () => {
  savingContent.value = true;
  pageContentError.value = '';
  successMsg.value = '';

  try {
    const res = await useNuxtApp().$fetch('/api/admin/blog/page-content', {
      method: 'POST',
      body: pageContent
    });
    if (res.success) {
      successMsg.value = 'Blog page header saved successfully.';
      setTimeout(() => { successMsg.value = ''; }, 4000);
    }
  } catch (err) {
    console.error(err);
    pageContentError.value = err?.data?.statusMessage || 'Failed to save blog page header.';
  } finally {
    savingContent.value = false;
  }
};

// Debounce search query updates
let searchTimeout = null;
watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal.trim();
    currentPage.value = 1; // Reset to page 1 on search
  }, 400);
});

// Reset page to 1 on category change
watch(selectedCategory, () => {
  currentPage.value = 1;
});

const getCategoryLabel = (catId) => {
  return categories.value.find(c => c.id === catId)?.name || 'Uncategorized';
};

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      successMsg.value = 'Article deleted successfully.';
      setTimeout(() => successMsg.value = '', 4000);
      clearNuxtData();
      refresh();
    } catch (err) {
      console.error(err);
      useToast().error('Delete operation failed.');
    }
  }
};
</script>
