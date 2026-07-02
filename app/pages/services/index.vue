<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Sectors & Services</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li>Services</li>
        </ol>
      </div>
    </div>

    <!-- ======= Services Section ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-[#2e3135] mb-4">Our Services</h2>
          <div class="w-16 h-1 bg-[#feb900] mx-auto mb-4"></div>
          <p class="text-gray-600">
            We provide reliable, efficient, and cost-effective geotechnical investigation and engineering consultancy services to firms nationwide.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(sector, index) in data?.sectors || []" :key="sector.id" class="service-item bg-white p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all group" data-aos="fade-up" :data-aos-delay="100 * (index % 3 + 1)">
            <div class="w-14 h-14 bg-gray-50 text-[#0f172a] rounded flex items-center justify-center text-2xl mb-6 transition-colors duration-300 group-hover:bg-[#feb900] group-hover:text-white">
              <i :class="sector.icon || 'bi bi-building'"></i>
            </div>
            <h3 class="text-xl font-bold mb-4 text-[#2e3135] group-hover:text-[#feb900] transition-colors">
              {{ sector.name }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
              {{ sector.short_description }}
            </p>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
const { data } = await useFetch('/api/services')
</script>
