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
          <i class="bi bi-plus-lg text-sm"></i> Write Article
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm mb-6">
      <div class="flex items-center gap-3">
        <i class="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
      <div class="relative max-w-sm w-full">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <i class="bi bi-search text-slate-400"></i>
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
          <option value="1">Events</option>
          <option value="2">Engineering</option>
          <option value="3">Research</option>
          <option value="4">Insights</option>
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
        <i class="bi bi-journal-text text-4xl mb-4 block"></i>
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
                    <i class="bi bi-pencil"></i>
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(post.id)" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <i class="bi bi-trash"></i>
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
import { ref, watch } from 'vue';

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
  watch: [currentPage, debouncedSearch, selectedCategory]
});

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
  const categories = {
    1: 'Events',
    2: 'Engineering',
    3: 'Research',
    4: 'Insights'
  };
  return categories[catId] || 'News';
};

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      await $fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      successMsg.value = 'Article deleted successfully.';
      setTimeout(() => successMsg.value = '', 4000);
      refresh();
    } catch (err) {
      console.error(err);
      alert('Delete operation failed.');
    }
  }
};
</script>
