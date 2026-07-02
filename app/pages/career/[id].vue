<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Job Description</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li><NuxtLink to="/career" class="text-white/80 hover:text-white">Careers</NuxtLink></li>
          <li>Details</li>
        </ol>
      </div>
    </div>

    <!-- ======= Job Detail Section ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        
        <div v-if="pending" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
        </div>

        <div v-else-if="!job?.data" class="text-center py-20 text-gray-400">
          <i class="bi bi-exclamation-octagon text-5xl mb-4 block text-rose-500"></i>
          <p class="font-bold text-lg text-gray-700">Job Posting Not Found</p>
          <NuxtLink to="/career" class="mt-4 px-5 py-2.5 bg-[#feb900] text-slate-950 rounded-full text-xs font-bold transition-all">
            Back to Careers
          </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- Left 2 Cols: Details -->
          <div class="lg:col-span-2 space-y-8">
            <div>
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-amber-50 text-[#feb900] text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-100">
                  {{ job.data.emp_status }}
                </span>
                <span class="text-xs text-gray-400 font-semibold">Published: {{ new Date(job.data.published).toLocaleDateString() }}</span>
              </div>
              <h2 class="text-3xl font-extrabold text-slate-800 leading-tight mb-2">{{ job.data.post }}</h2>
              <p class="text-gray-500 text-sm font-semibold flex items-center gap-1.5"><i class="bi bi-geo-alt text-[#feb900]"></i> {{ job.data.location }}</p>
            </div>

            <div class="border-t border-gray-100 pt-8 space-y-4">
              <h3 class="text-lg font-bold text-slate-700">Job Description</h3>
              <div class="formatted-content text-gray-600 leading-relaxed text-justify" v-html="job.data.description"></div>
            </div>

            <div class="border-t border-gray-100 pt-8 space-y-4">
              <h3 class="text-lg font-bold text-slate-700">Key Responsibilities</h3>
              <div class="formatted-content text-gray-600 leading-relaxed text-justify" v-html="job.data.responsibilities"></div>
            </div>

            <div class="border-t border-gray-100 pt-8 space-y-4">
              <h3 class="text-lg font-bold text-slate-700">Educational Requirements</h3>
              <p class="text-gray-600 leading-relaxed text-justify whitespace-pre-line">{{ job.data.Edu_Qlty }}</p>
            </div>

            <div class="border-t border-gray-100 pt-8 space-y-4" v-if="job.data.other_beninifs">
              <h3 class="text-lg font-bold text-slate-700">Other Benefits</h3>
              <div class="formatted-content text-gray-600 leading-relaxed text-justify" v-html="job.data.other_beninifs"></div>
            </div>

            <!-- How to apply block -->
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h3 class="text-base font-bold text-slate-800">How to Apply</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                If you are a passionate engineer/architect who meets these qualifications, please send your updated CV, portfolio (if applicable), and cover letter to <a href="mailto:career@cozmictech.com" class="text-[#feb900] font-bold hover:underline">career@cozmictech.com</a>. Mention the job position title in your email subject line.
              </p>
            </div>
          </div>

          <!-- Right 1 Col: Summary Card -->
          <div class="space-y-6">
            <div class="bg-gray-50 border border-gray-100 p-8 rounded-2xl shadow-sm space-y-6 sticky top-28">
              <h3 class="text-lg font-bold text-slate-800 border-b border-gray-200 pb-3">Job Summary</h3>
              
              <div class="space-y-4 text-sm">
                <div class="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span class="text-gray-400 font-semibold">Vacancies</span>
                  <span class="text-slate-700 font-bold">{{ job.data.vacancy }} position(s)</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span class="text-gray-400 font-semibold">Location</span>
                  <span class="text-slate-700 font-bold">{{ job.data.location }}</span>
                </div>
                <div class="flex justify-between items-start py-2 border-b border-gray-100/50">
                  <span class="text-gray-400 font-semibold shrink-0">Experience</span>
                  <span class="text-slate-700 font-bold text-right pl-[10px]">{{ job.data.experience || 'Not specified' }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span class="text-gray-400 font-semibold">Salary Range</span>
                  <span class="text-slate-700 font-bold">{{ job.data.salary }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span class="text-gray-400 font-semibold">Gender</span>
                  <span class="text-slate-700 font-bold">{{ job.data.gender || 'Any' }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span class="text-gray-400 font-semibold">Deadline</span>
                  <span class="text-rose-600 font-bold">{{ job.data.deadline ? new Date(job.data.deadline).toLocaleDateString() : 'Open' }}</span>
                </div>
              </div>

              <NuxtLink to="/career" class="w-full text-center py-3 border border-slate-350 hover:bg-slate-100 font-bold text-slate-700 rounded-xl text-xs uppercase tracking-wider block transition-colors">
                Back to Openings
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: job, pending } = await useFetch(`/api/career/${route.params.id}`)
</script>
