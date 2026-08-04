<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">{{ data?.post?.title || 'Blog Details' }}</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li><NuxtLink to="/blog" class="text-white/80 hover:text-white">Blog</NuxtLink></li>
          <li>Blog Details</li>
        </ol>
      </div>
    </div>

    <!-- ======= Blog Details Section ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <!-- Left Main Content Column -->
          <div class="lg:col-span-8 space-y-6">
            <div class="relative overflow-hidden rounded-lg shadow-sm max-h-[450px] bg-gray-100">
              <img 
                :src="data?.post?.image ? (data.post.image.includes('/') ? data.post.image : '/assets/img/blog/' + data.post.image) : '/assets/img/blog/blog-inside-post.jpg'" 
                :alt="data?.post?.title" 
                class="w-full h-full object-cover"
              />
            </div>

            <h2 class="text-3xl font-bold text-[#2e3135] mt-6">{{ data?.post?.title }}</h2>

            <div class="flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-4">
              <span class="flex items-center gap-1"><Icon name="lucide:person" class="text-[#feb900]" /> {{ data?.post?.author || 'Admin' }}</span>
              <span>/</span>
              <span class="flex items-center gap-1"><Icon name="lucide:calendar-event" class="text-[#feb900]" /> {{ data?.post?.sdate || 'Recent' }}</span>
              <span>/</span>
              <span class="flex items-center gap-1"><Icon name="lucide:folder2" class="text-[#feb900]" /> {{ data?.category?.name || 'Engineering' }}</span>
            </div>

            <div 
              class="formatted-content text-gray-600 text-justify leading-relaxed"
              v-html="data?.post?.content"
            ></div>
          </div>

          <!-- Right Sidebar Column -->
          <div class="lg:col-span-4 space-y-8">
            <!-- Categories List Card -->
            <div class="bg-gray-50 border border-gray-100 p-6 rounded-lg">
              <h4 class="font-bold text-lg text-[#2e3135] mb-4 border-b border-gray-200 pb-2">Categories</h4>
              <ul class="space-y-3 text-sm text-gray-600 font-semibold">
                <li v-for="cat in data?.allCategories || []" :key="cat.id" class="flex justify-between items-center hover:text-[#feb900] transition-colors">
                  <span>{{ cat.name }}</span>
                </li>
              </ul>
            </div>

            <!-- Recent Posts Card -->
            <div class="bg-gray-50 border border-gray-100 p-6 rounded-lg">
              <h4 class="font-bold text-lg text-[#2e3135] mb-4 border-b border-gray-200 pb-2">Recent Posts</h4>
              <div class="space-y-4">
                <div v-for="rp in data?.recentPosts || []" :key="rp.id" class="flex gap-4">
                  <img 
                    :src="rp.image ? (rp.image.includes('/') ? rp.image : '/assets/img/blog/' + rp.image) : '/assets/img/blog/blog-recent-1.jpg'" 
                    :alt="rp.title" 
                    class="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div>
                    <h5 class="text-sm font-bold text-[#2e3135] line-clamp-2 hover:text-[#feb900]">
                      <NuxtLink :to="'/blog/' + rp.id">{{ rp.title }}</NuxtLink>
                    </h5>
                    <span class="text-xs text-gray-400 mt-1 block">{{ rp.sdate || 'Recent' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
</script>
