<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Career Openings</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li>Careers</li>
        </ol>
      </div>
    </div>

    <!-- ======= Careers Section ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold text-[#2e3135] mb-4">Join Our Team</h2>
          <div class="w-16 h-1 bg-[#feb900] mx-auto mb-4"></div>
          <p class="text-gray-600">Explore career opportunities and build a fulfilling future with us. We are always looking for passionate engineers and design experts to contribute to Bangladesh's premium consultancy projects.</p>
        </div>

        <div v-if="pending" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
        </div>

        <div v-else-if="!careers?.data?.length" class="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
          <i class="bi bi-briefcase text-5xl mb-4 block text-gray-300"></i>
          <p class="font-bold text-lg text-gray-700">No Job Openings Currently</p>
          <p class="text-sm mt-1 text-gray-500">Please check back later or send your resume directly to our email.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="job in careers.data" :key="job.id" class="bg-gray-50 border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start gap-4 mb-4">
                <h3 class="font-bold text-xl text-slate-800 hover:text-[#feb900] transition-colors">
                  <NuxtLink :to="'/career/' + job.id">{{ job.post }}</NuxtLink>
                </h3>
                <span class="px-3 py-1 bg-amber-50 text-[#feb900] text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-100">
                  {{ job.emp_status }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-gray-500 mb-6">
                <span class="flex items-center gap-1.5"><i class="bi bi-geo-alt"></i> {{ job.location }}</span>
                <span class="flex items-center gap-1.5"><i class="bi bi-people"></i> {{ job.vacancy }} opening(s)</span>
                <span class="flex items-center gap-1.5"><i class="bi bi-cash"></i> {{ job.salary }}</span>
                <span class="flex items-center gap-1.5"><i class="bi bi-mortarboard"></i> {{ job.experience || 'Any experience' }}</span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                {{ job.description }}
              </p>
            </div>
            <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <span class="text-[11px] text-gray-400 font-bold uppercase">Deadline: {{ job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open' }}</span>
              <NuxtLink :to="'/career/' + job.id" class="text-xs font-bold uppercase tracking-wider text-[#feb900] hover:text-amber-600 flex items-center gap-1">
                View Details <i class="bi bi-arrow-right"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: careers, pending } = await useFetch('/api/career')
</script>
