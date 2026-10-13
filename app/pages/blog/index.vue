<template>
  <div class="bg-white min-h-screen text-[#090402] pb-24">
    <!-- ======= Editorial Hero Header (Matching Services & Projects Pages) ======= -->
    <section class="pt-32 sm:pt-36 lg:pt-40 pb-8 sm:pb-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
          {{ data?.pageContent?.hero_eyebrow || 'Perspectives • Journal • Insights' }}
        </span>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#090402] leading-[1.12] tracking-tight mb-4">
          {{ data?.pageContent?.hero_heading || 'News & Perspectives' }}
        </h1>
        <p class="text-neutral-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl font-normal">
          {{ data?.pageContent?.hero_body || 'Thought leadership, technical innovations, project milestones, and contemporary engineering discourse from our team across Bangladesh.' }}
        </p>
      </div>
    </section>

    <!-- ======= Blog Content & Filter Section ======= -->
    <section class="pt-8 sm:pt-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        
        <!-- Controls Row: Category Filter Tabs & Search Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 sm:mb-12 border-b border-neutral-100">
          
          <!-- Category Filter Tabs -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="setCategory('all')"
              class="px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
              :class="selectedCategory === 'all'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'"
            >
              All Articles ({{ allPosts.length }})
            </button>
            <button
              v-for="cat in activeCategories"
              :key="cat.id"
              type="button"
              @click="setCategory(cat.id)"
              class="px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
              :class="selectedCategory === cat.id
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'"
            >
              {{ cat.name }} ({{ cat.count }})
            </button>
          </div>

          <!-- Minimal Search Input -->
          <div class="relative w-full md:w-72 lg:w-80">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Icon name="lucide:search" class="text-sm" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search articles..."
              class="w-full pl-10 pr-9 py-2 border border-neutral-200 rounded-full bg-white text-slate-900 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
              title="Clear search"
            >
              <Icon name="lucide:x" class="text-xs" />
            </button>
          </div>
        </div>

        <!-- Empty State When Filter Yields 0 Results -->
        <div v-if="filteredPosts.length === 0" class="py-20 text-center space-y-4">
          <div class="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Icon name="lucide:book-open" class="text-2xl" />
          </div>
          <div class="max-w-md mx-auto space-y-1">
            <h3 class="font-display text-xl font-normal text-slate-900">No articles found</h3>
            <p class="text-xs text-neutral-500">
              {{ searchQuery ? `No articles matching "${searchQuery}".` : 'There are currently no articles in this category.' }}
            </p>
          </div>
          <button
            type="button"
            @click="resetFilters"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-slate-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Icon name="lucide:rotate-ccw" class="text-xs" />
            Reset all filters
          </button>
        </div>

        <!-- Featured Spotlight Post (Clean editorial layout without card box) -->
        <div v-else-if="featuredPost && currentPage === 1 && selectedCategory === 'all' && !searchQuery.trim()" class="mb-14 sm:mb-16 pb-12 sm:pb-16 border-b border-neutral-150">
          <NuxtLink
            :to="'/blog/' + featuredPost.id"
            class="group block cursor-pointer"
          >
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <!-- Featured Image (7 cols) -->
              <div class="lg:col-span-7">
                <div class="relative overflow-hidden aspect-[16/10] rounded-lg bg-neutral-200">
                  <img
                    :src="getImageUrl(featuredPost.image)"
                    :alt="featuredPost.title"
                    class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    @error="$event.target.src = '/assets/img/blog/blog-1.jpg'"
                  />
                  <span class="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-xs">
                    {{ featuredPost.category_name }}
                  </span>
                </div>
              </div>

              <!-- Featured Narrative (5 cols) -->
              <div class="lg:col-span-5 space-y-4">
                <div class="flex items-center gap-2 text-xs font-medium text-neutral-400">
                  <span class="text-amber-600 font-bold uppercase tracking-wider text-[10px]">Featured Article</span>
                  <span>&bull;</span>
                  <time :datetime="featuredPost.date">{{ featuredPost.sdate }}</time>
                </div>

                <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-[#090402] leading-tight group-hover:text-amber-600 transition-colors">
                  {{ featuredPost.title }}
                </h2>

                <p class="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal line-clamp-4">
                  {{ featuredPost.excerpt || 'Explore technical insights and in-depth engineering perspectives from our experienced team.' }}
                </p>

                <div class="pt-2">
                  <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950 group-hover:text-amber-600 transition-colors">
                    <span>Read Article</span>
                    <Icon name="lucide:arrow-right" class="text-sm transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Grid of Articles -->
        <div v-if="paginatedPosts.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-12 sm:gap-y-14">
            <article
              v-for="post in paginatedPosts"
              :key="post.id"
              class="group flex flex-col h-full"
            >
              <NuxtLink
                :to="'/blog/' + post.id"
                class="flex flex-col h-full cursor-pointer select-none"
              >
                <!-- Aspect Ratio Image Container -->
                <div class="relative overflow-hidden aspect-[16/10] rounded-xl bg-neutral-100 border border-neutral-200/60 mb-5">
                  <img
                    :src="getImageUrl(post.image)"
                    :alt="post.title"
                    class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    @error="$event.target.src = '/assets/img/blog/blog-1.jpg'"
                  />
                  <!-- Category Badge -->
                  <span class="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
                    {{ post.category_name }}
                  </span>
                </div>

                <!-- Meta Row: Date & Author -->
                <div class="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
                  <time :datetime="post.date">{{ post.sdate }}</time>
                  <span>&bull;</span>
                  <span>{{ post.author }}</span>
                </div>

                <!-- Title -->
                <h3 class="font-display text-xl sm:text-2xl font-normal text-[#090402] leading-snug group-hover:text-amber-600 transition-colors duration-200 mb-2.5 line-clamp-2">
                  {{ post.title }}
                </h3>

                <!-- Excerpt / Summary -->
                <p class="text-neutral-500 text-sm leading-relaxed line-clamp-3 font-normal mb-5 flex-1">
                  {{ post.excerpt || 'Click to read the full article and explore related engineering topics...' }}
                </p>

                <!-- Read Link -->
                <div class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-amber-600 transition-colors mt-auto pt-2 border-t border-neutral-100">
                  <span>Read Article</span>
                  <Icon name="lucide:arrow-right" class="text-xs transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
                </div>
              </NuxtLink>
            </article>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-neutral-100 pt-8 mt-14 sm:mt-16">
            <div class="text-xs text-neutral-400 font-medium">
              Showing <span class="font-bold text-slate-700">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-700">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-700">{{ gridPostsSource.length }}</span> articles
            </div>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-slate-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              
              <button
                v-for="page in totalPages"
                :key="page"
                type="button"
                @click="currentPage = page"
                class="w-8 h-8 rounded-full text-xs font-bold transition-colors cursor-pointer"
                :class="currentPage === page ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-neutral-100'"
              >
                {{ page }}
              </button>

              <button
                type="button"
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-slate-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

useHead({
  title: 'Blog & Perspectives | Cozmic Technology - Engineering Consultancy',
  meta: [
    { name: 'description', content: 'Explore engineering insights, research, project achievements, and company announcements from Cozmic Technology.' },
    { property: 'og:title', content: 'Cozmic Technology Blog & Insights' },
  ]
})

// Fetch blog data
const { data } = await useFetch('/api/blog', { deep: false })

const allPosts = computed(() => data.value?.posts || [])
const allCategories = computed(() => data.value?.categories || [])

const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(6)

// Compute categories that have at least 1 post
const activeCategories = computed(() => {
  const counts = {}
  for (const post of allPosts.value) {
    if (post.category_id) {
      counts[post.category_id] = (counts[post.category_id] || 0) + 1
    }
  }

  return allCategories.value
    .filter(cat => (counts[cat.id] || 0) > 0)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      count: counts[cat.id] || 0
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const setCategory = (catId) => {
  selectedCategory.value = catId
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  currentPage.value = 1
}

// Filtered posts based on category and search query
const filteredPosts = computed(() => {
  let list = allPosts.value

  if (selectedCategory.value !== 'all') {
    list = list.filter(p => p.category_id === Number(selectedCategory.value) || p.post_catid === Number(selectedCategory.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => {
      const matchTitle = (p.title || '').toLowerCase().includes(q)
      const matchExcerpt = (p.excerpt || '').toLowerCase().includes(q)
      const matchAuthor = (p.author || '').toLowerCase().includes(q)
      const matchCat = (p.category_name || '').toLowerCase().includes(q)
      return matchTitle || matchExcerpt || matchAuthor || matchCat
    })
  }

  return list
})

// Reset to page 1 when search or category changes
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

// Featured post (latest post on clean "all" view)
const featuredPost = computed(() => {
  if (allPosts.value.length > 0) {
    return allPosts.value[0]
  }
  return null
})

// Grid posts source: when featured post is shown at the top, omit it from the grid below
const gridPostsSource = computed(() => {
  if (featuredPost.value && currentPage.value === 1 && selectedCategory.value === 'all' && !searchQuery.value.trim()) {
    return filteredPosts.value.slice(1)
  }
  return filteredPosts.value
})

const totalPages = computed(() => {
  return Math.ceil(gridPostsSource.value.length / pageSize.value) || 1
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return gridPostsSource.value.slice(start, start + pageSize.value)
})

const paginationRange = computed(() => {
  const total = gridPostsSource.value.length
  if (total === 0) return { start: 0, end: 0 }
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(start + pageSize.value - 1, total)
  return { start, end }
})

// Image URL helper
const getImageUrl = (img) => {
  if (!img) return '/assets/img/blog/blog-1.jpg'
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
    return img
  }
  return `/assets/img/blog/${img}`
}
</script>
