<template>
  <div class="bg-white min-h-screen text-[#090402] pb-24 font-sans">
    <!-- Back to Journal Navigation Bar -->
    <div class="pt-32 sm:pt-36 pb-6 border-b border-neutral-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#090402] transition-colors cursor-pointer"
        >
          <Icon name="lucide:arrow-left" class="text-sm" />
          Back to Journal &amp; News
        </NuxtLink>
      </div>
    </div>

    <!-- Article Content Section -->
    <section class="pt-10 sm:pt-14 pb-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        
        <!-- Article Header -->
        <div class="max-w-4xl mb-10 sm:mb-12">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-3">
            <span>{{ data?.category?.name || 'Engineering Perspective' }}</span>
            <span class="text-neutral-300">&bull;</span>
            <time class="text-neutral-400">{{ data?.post?.sdate || 'Recent' }}</time>
          </div>

          <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#090402] leading-tight tracking-tight mb-6">
            {{ data?.post?.title }}
          </h1>

          <div class="flex items-center gap-3 text-xs text-neutral-500 pt-2">
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs uppercase">
              {{ (data?.post?.author || 'A').charAt(0) }}
            </div>
            <div>
              <span class="font-bold text-slate-800 block">{{ data?.post?.author || 'Editorial Team' }}</span>
              <span class="text-[11px] text-neutral-400">Cozmic Technology</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <!-- Main Content Body (8 cols) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Featured Image -->
            <div class="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[16/9] border border-neutral-200/80">
              <img 
                :src="getImageUrl(data?.post?.image)"
                :alt="data?.post?.title" 
                class="w-full h-full object-cover"
                @error="$event.target.src = '/assets/img/blog/blog-1.jpg'"
              />
            </div>

            <!-- HTML Content Article -->
            <div 
              class="prose prose-neutral max-w-none text-slate-700 leading-relaxed text-base sm:text-lg formatted-content"
              v-html="data?.post?.content"
            ></div>

            <!-- Article Footer Navigation -->
            <div class="pt-10 border-t border-neutral-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <NuxtLink
                to="/blog"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-slate-800 hover:bg-neutral-50 transition-colors"
              >
                <Icon name="lucide:arrow-left" class="text-xs" />
                All Articles
              </NuxtLink>

              <NuxtLink
                to="/contact"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#feb900] text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 transition-colors shadow-xs"
              >
                <span>Discuss a Project</span>
                <Icon name="lucide:arrow-right" class="text-xs" />
              </NuxtLink>
            </div>
          </div>

          <!-- Sidebar Column (4 cols) -->
          <aside class="lg:col-span-4 space-y-10 lg:pl-4">
            <!-- Recent Articles Minimal List -->
            <div v-if="data?.recentPosts?.length" class="space-y-4">
              <h3 class="font-display text-lg font-normal text-slate-900 pb-3 border-b border-neutral-200">
                Recent Perspectives
              </h3>
              <div class="space-y-4">
                <NuxtLink 
                  v-for="rp in data.recentPosts" 
                  :key="rp.id" 
                  :to="'/blog/' + rp.id"
                  class="group flex gap-3.5 sm:gap-4 items-start cursor-pointer"
                >
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/60 aspect-square">
                    <img 
                      :src="getImageUrl(rp.image)" 
                      :alt="rp.title" 
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      @error="$event.target.src = '/assets/img/blog/blog-1.jpg'"
                    />
                  </div>
                  <div class="space-y-1 min-w-0 flex-1">
                    <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                      {{ rp.sdate }}
                    </span>
                    <h4 class="text-sm font-medium text-slate-800 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                      {{ rp.title }}
                    </h4>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Categories Minimal Pill List -->
            <div v-if="data?.allCategories?.length" class="space-y-4">
              <h3 class="font-display text-lg font-normal text-slate-900 pb-3 border-b border-neutral-200">
                Explore Topics
              </h3>
              <div class="flex flex-wrap gap-2">
                <NuxtLink 
                  v-for="cat in data.allCategories" 
                  :key="cat.id"
                  to="/blog"
                  class="px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors"
                >
                  {{ cat.name }}
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const route = useRoute()
const postId = computed(() => parseInt(route.params.id))
const { data } = await useFetch(() => `/api/blog/${postId.value}`)

useHead(() => ({
  title: data.value?.post?.title ? `${data.value.post.title.trim()} | Cozmic Technology Blog` : 'Blog Details | Cozmic Technology',
  meta: [
    { name: 'description', content: data.value?.post?.title || 'Cozmic Technology Engineering Blog & Insights' }
  ]
}))

const getImageUrl = (img) => {
  if (!img) return '/assets/img/blog/blog-1.jpg'
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
    return img
  }
  return `/assets/img/blog/${img}`
}
</script>

<style scoped>
:deep(.formatted-content p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}
:deep(.formatted-content h2),
:deep(.formatted-content h3),
:deep(.formatted-content h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #090402;
  font-weight: 500;
}
</style>
