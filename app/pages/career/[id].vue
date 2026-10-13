<template>
  <div class="bg-white min-h-screen text-[#090402] pb-24 font-sans selection:bg-[#feb900]/20 selection:text-slate-900">
    <!-- Loading State -->
    <div v-if="pending" class="pt-40 pb-32 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-[#feb900]"></div>
    </div>

    <!-- Error / Not Found State -->
    <div v-else-if="!job?.data" class="pt-36 sm:pt-44 pb-32">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 text-center max-w-lg">
        <div class="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <Icon name="lucide:alert-circle" class="text-2xl" />
        </div>
        <h1 class="font-display text-3xl font-normal text-slate-900 mb-2">Job Opening Not Found</h1>
        <p class="text-xs sm:text-sm text-neutral-500 mb-8 leading-relaxed">
          The position you are looking for may have been filled, archived, or is no longer accepting applications.
        </p>
        <NuxtLink 
          to="/career" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
        >
          <Icon name="lucide:arrow-left" class="text-sm" />
          <span>View All Open Positions</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Job Details Content -->
    <div v-else>
      <!-- ======= Editorial Hero Header ======= -->
      <section class="pt-32 sm:pt-36 lg:pt-40 pb-10 sm:pb-14">
        <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
          
          <!-- Breadcrumb navigation -->
          <nav class="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-4">
            <NuxtLink to="/" class="hover:text-slate-900 transition-colors">Home</NuxtLink>
            <span>/</span>
            <NuxtLink to="/career" class="hover:text-slate-900 transition-colors">Careers</NuxtLink>
            <span>/</span>
            <span class="text-slate-700 truncate max-w-xs sm:max-w-md">{{ job.data.post }}</span>
          </nav>

          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="inline-block text-[11px] font-semibold tracking-[0.25em] text-[#feb900] uppercase">
              Position Details &bull; Ref #{{ job.data.id }}
            </span>
          </div>

          <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#090402] leading-[1.15] tracking-tight mb-5">
            {{ job.data.post }}
          </h1>

          <!-- Meta Pill Tags -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span class="px-3.5 py-1.5 bg-amber-500/10 text-slate-900 font-bold uppercase tracking-wider rounded-full border border-[#feb900]/30 text-[10px]">
              {{ job.data.emp_status || job.data.employment_status || 'Full-Time' }}
            </span>
            <span class="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-slate-700 font-medium rounded-full">
              <Icon name="lucide:map-pin" class="text-[#feb900]" />
              {{ job.data.location || 'Dhaka, Bangladesh' }}
            </span>
            <span class="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-slate-700 font-medium rounded-full">
              <Icon name="lucide:users" class="text-neutral-400" />
              {{ job.data.vacancy }} {{ job.data.vacancy > 1 ? 'Openings' : 'Opening' }}
            </span>
            <span v-if="job.data.published || job.data.created_at" class="text-neutral-400 text-xs py-1.5">
              Published: {{ formatDate(job.data.published || job.data.created_at) }}
            </span>
          </div>

        </div>
      </section>

      <!-- ======= Main Content Area ======= -->
      <section class="pt-10 sm:pt-14">
        <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            <!-- Left 8 Columns: Job Description, Responsibilities, Qualifications -->
            <div class="lg:col-span-8 space-y-12">
              
              <!-- Role Overview -->
              <div v-if="job.data.description" class="space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Role Overview
                </h2>
                <div 
                  class="prose prose-neutral max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed font-normal" 
                  v-html="cleanContent(job.data.description)"
                ></div>
              </div>

              <!-- Key Responsibilities -->
              <div v-if="job.data.responsibilities" class="space-y-4 pt-6 border-t border-neutral-100">
                <h2 class="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Key Responsibilities
                </h2>
                <div v-if="isHtml(job.data.responsibilities)" class="prose prose-neutral max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed font-normal" v-html="cleanContent(job.data.responsibilities)"></div>
                <ul v-else class="space-y-3">
                  <li 
                    v-for="(resp, idx) in parseListItems(job.data.responsibilities)" 
                    :key="idx"
                    class="flex items-start gap-3 text-neutral-700 text-sm sm:text-base leading-relaxed"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-[#feb900] mt-2.5 shrink-0"></span>
                    <span>{{ resp }}</span>
                  </li>
                </ul>
              </div>

              <!-- Educational & Professional Requirements -->
              <div v-if="job.data.Edu_Qlty || job.data.education_quality" class="space-y-4 pt-6 border-t border-neutral-100">
                <h2 class="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Qualifications &amp; Experience
                </h2>
                <div class="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-800">
                    <Icon name="lucide:graduation-cap" class="text-base text-[#feb900]" />
                    <span>Educational Criteria</span>
                  </div>
                  <p class="text-neutral-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                    {{ cleanContent(job.data.Edu_Qlty || job.data.education_quality) }}
                  </p>
                </div>
              </div>

              <!-- Other Benefits & Compensation -->
              <div v-if="job.data.other_beninifs || job.data.other_benefits" class="space-y-4 pt-6 border-t border-neutral-100">
                <h2 class="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Benefits &amp; What We Offer
                </h2>
                <div 
                  class="prose prose-neutral max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed font-normal" 
                  v-html="cleanContent(job.data.other_beninifs || job.data.other_benefits)"
                ></div>
              </div>

              <!-- How to Apply Card -->
              <div class="border border-neutral-200/90 rounded-2xl p-6 sm:p-8 bg-neutral-50/60 space-y-4">
                <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                  <Icon name="lucide:send" class="text-base text-[#feb900]" />
                  <span>How to Apply</span>
                </div>
                <p class="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                  If your background aligns with this profile, please email your comprehensive CV, academic certificates, and engineering portfolio (if applicable) to our recruitment desk at 
                  <a :href="'mailto:' + applyEmail + '?subject=' + encodeURIComponent('Application: ' + job.data.post)" class="text-slate-900 font-semibold underline decoration-[#feb900] decoration-2 underline-offset-4 hover:text-[#feb900] transition-colors">
                    {{ applyEmail }}
                  </a>.
                </p>
                <div class="flex flex-wrap items-center gap-3 pt-2">
                  <a 
                    :href="'mailto:' + applyEmail + '?subject=' + encodeURIComponent('Application: ' + job.data.post + ' - Ref #' + job.data.id)"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-[#feb900] hover:bg-amber-500 text-slate-950 rounded-full text-xs font-bold tracking-wider uppercase transition-colors shadow-xs"
                  >
                    <Icon name="lucide:mail" class="text-sm" />
                    <span>Apply via Email</span>
                  </a>
                  <NuxtLink 
                    to="/career" 
                    class="inline-flex items-center gap-2 px-5 py-3 border border-neutral-200 hover:border-neutral-300 bg-white text-slate-700 rounded-full text-xs font-semibold tracking-wide transition-colors"
                  >
                    <span>View Other Openings</span>
                  </NuxtLink>
                </div>
              </div>

            </div>

            <!-- Right 4 Columns: Sticky Summary Sidebar -->
            <div class="lg:col-span-4">
              <div class="sticky top-28 space-y-6">
                
                <!-- Position Specification Card (Matching Projects Sidebar) -->
                <div class="bg-neutral-50/60 border border-neutral-200/90 rounded-2xl p-6 sm:p-7 space-y-5">
                  <div class="border-b border-neutral-200/80 pb-4">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-[#feb900]">Position Overview</span>
                    <h3 class="font-display text-xl font-normal text-slate-900 mt-1">Summary &amp; Criteria</h3>
                  </div>

                  <dl class="divide-y divide-neutral-200/60 text-xs">
                    <div class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Job Reference</dt>
                      <dd class="font-semibold text-slate-900 font-mono">#{{ job.data.id }}</dd>
                    </div>

                    <div class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Employment Type</dt>
                      <dd class="font-semibold text-slate-900">{{ job.data.emp_status || job.data.employment_status || 'Full-Time' }}</dd>
                    </div>

                    <div class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Vacancies</dt>
                      <dd class="font-semibold text-slate-900">{{ job.data.vacancy }} Position(s)</dd>
                    </div>

                    <div class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Location</dt>
                      <dd class="font-semibold text-slate-900">{{ job.data.location || 'Dhaka' }}</dd>
                    </div>

                    <div v-if="job.data.experience" class="py-2.5 flex justify-between items-start gap-2">
                      <dt class="text-neutral-500 font-medium shrink-0">Experience</dt>
                      <dd class="font-semibold text-slate-900 text-right">{{ job.data.experience }}</dd>
                    </div>

                    <div v-if="job.data.salary" class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Remuneration</dt>
                      <dd class="font-semibold text-slate-900">{{ job.data.salary }}</dd>
                    </div>

                    <div v-if="job.data.gender && job.data.gender !== 'Any'" class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Gender</dt>
                      <dd class="font-semibold text-slate-900">{{ job.data.gender }}</dd>
                    </div>

                    <div class="py-2.5 flex justify-between items-center gap-2">
                      <dt class="text-neutral-500 font-medium">Application Deadline</dt>
                      <dd class="font-semibold text-slate-900">{{ formatDeadline(job.data.deadline) }}</dd>
                    </div>
                  </dl>

                  <!-- Direct Action CTA -->
                  <div class="pt-2">
                    <a 
                      :href="'mailto:' + applyEmail + '?subject=' + encodeURIComponent('Application: ' + job.data.post)"
                      class="w-full text-center py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl block transition-colors shadow-xs"
                    >
                      Apply For This Position
                    </a>
                  </div>

                  <div class="pt-1 text-center">
                    <NuxtLink 
                      to="/career" 
                      class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-slate-900 transition-colors"
                    >
                      <Icon name="lucide:arrow-left" class="text-xs" />
                      <span>Back to All Openings</span>
                    </NuxtLink>
                  </div>
                </div>

                <!-- Office Contact Callout -->
                <div class="border border-neutral-200/80 rounded-2xl p-6 text-xs text-neutral-600 space-y-2 bg-white">
                  <p class="font-semibold text-slate-900 text-sm">Need Clarification?</p>
                  <p class="leading-relaxed">
                    For recruitment inquiries regarding this specific opening, contact HR directly at 
                    <a :href="'mailto:' + applyEmail" class="text-slate-900 font-medium underline">{{ applyEmail }}</a>.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: job, pending } = await useFetch(`/api/career/${route.params.id}`, { key: `career-detail-${route.params.id}` })

const applyEmail = computed(() => {
  return job.value?.contactEmail || 'career@cozmictech.com'
})

useHead({
  title: computed(() => job.value?.data?.post ? `${job.value.data.post} | Careers at Cozmic Technology` : 'Job Opening Details | Cozmic Technology'),
  meta: [
    { name: 'description', content: computed(() => job.value?.data?.post ? `Apply for ${job.value.data.post} in ${job.value.data.location || 'Dhaka'} at Cozmic Technology.` : 'Career opportunity at Cozmic Technology.') },
    { property: 'og:title', content: computed(() => job.value?.data?.post ? `${job.value.data.post} - Cozmic Technology` : 'Careers at Cozmic Technology') }
  ]
})

const cleanContent = (str) => {
  if (!str) return ''
  return str.replace(/\uFFFD|\?\?/g, "'").trim()
}

const isHtml = (str) => {
  return /<[a-z][\s\S]*>/i.test(str || '')
}

const parseListItems = (text) => {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

const formatDeadline = (deadline) => {
  if (!deadline) return 'Open Until Filled'
  try {
    const d = new Date(deadline)
    if (isNaN(d.getTime())) return 'Open'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return 'Open'
  }
}
</script>
