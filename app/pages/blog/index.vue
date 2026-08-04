<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li>Blog</li>
        </ol>
      </div>
    </div>

    <!-- ======= Blog Section ======= -->
    <section id="blog" class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(post, index) in data?.posts || []" :key="post.id" v-memo="[post.id]" class="group border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all" data-aos="fade-up" :data-aos-delay="100 * (index % 3 + 1)">
            
            <div class="relative overflow-hidden h-52 bg-gray-100">
              <img 
                :src="post.image ? (post.image.includes('/') ? post.image : '/assets/img/blog/' + post.image) : '/assets/img/blog/blog-1.jpg'" 
                :alt="post.title" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span class="absolute top-4 left-4 bg-[#feb900] text-[#0f172a] text-xs font-bold px-3 py-1 rounded shadow">
                {{ post.sdate || 'Recent' }}
              </span>
            </div>

            <div class="p-6 space-y-4">
              <h3 class="font-bold text-lg text-[#2e3135] line-clamp-2 group-hover:text-[#feb900] transition-colors">
                <NuxtLink :to="'/blog/' + post.id">{{ post.title }}</NuxtLink>
              </h3>

              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1"><Icon name="lucide:person" class="text-[#feb900]" /> {{ post.author || 'Admin' }}</span>
                <span>/</span>
                <span class="flex items-center gap-1"><Icon name="lucide:folder2" class="text-[#feb900]" /> {{ getCategoryName(post.post_catid) }}</span>
              </div>

              <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {{ post.content ? post.content.replace(/<[^>]*>/g, '') : 'Click to read the full article...' }}
              </p>

              <div class="border-t border-gray-100 pt-4 flex items-center justify-between text-xs font-bold text-[#feb900] uppercase tracking-wider">
                <NuxtLink :to="'/blog/' + post.id" class="hover:text-[#ffc732] flex items-center gap-1">
                  Read More <Icon name="lucide:arrow-right" />
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
// P15 — Page-specific SEO meta
useHead({
  title: 'Blog | Cozmic Technology - News & Engineering Insights',
  meta: [
    { name: 'description', content: 'Stay updated with the latest news, engineering insights, project milestones, and company announcements from Cozmic Technology.' },
    { property: 'og:title', content: 'Cozmic Technology Blog' },
  ]
})

const { data } = await useFetch('/api/blog', { deep: false })

const getCategoryName = (catId) => {
  const cat = data.value?.categories?.find(c => c.id === catId)
  return cat ? cat.name : 'Engineering'
}
</script>
