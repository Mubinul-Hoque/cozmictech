<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">System Overview</h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Operational parameters & metrics</p>
      </div>
      <div>
        <span class="px-4 py-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-2 hover:shadow-md hover:border-slate-300 transition-all duration-200">
          <Icon name="lucide:calendar3" class="text-[#feb900]" />
          {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </span>
      </div>
    </div>
    
    <!-- Loader -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Grid of Stats Counters -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Card 1: Blog Articles -->
        <NuxtLink to="/admin/blog" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-300"></div>
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Blog Articles</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.postsCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-indigo-100 shadow-sm">
              <Icon name="lucide:book-open-text" class="text-xl" />
            </div>
          </div>
          <div class="mt-6 flex items-center text-xs font-semibold text-indigo-600">
            <span>Manage publication <Icon name="lucide:arrow-right" class="ml-1" /></span>
          </div>
        </NuxtLink>

        <!-- Card 2: Portfolio Projects -->
        <NuxtLink to="/admin/projects" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors duration-300"></div>
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Portfolio Projects</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.projectsCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-amber-100 shadow-sm">
              <Icon name="lucide:briefcase" class="text-xl" />
            </div>
          </div>
          <div class="mt-6 flex items-center text-xs font-semibold text-amber-600">
            <span>Manage cases <Icon name="lucide:arrow-right" class="ml-1" /></span>
          </div>
        </NuxtLink>

        <!-- Card 3: Testimonials -->
        <NuxtLink to="/admin/testimonials" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Client Reviews</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.testimonialsCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-emerald-100 shadow-sm">
              <Icon name="lucide:message-square-quote" class="text-xl" />
            </div>
          </div>
          <div class="mt-6 flex items-center text-xs font-semibold text-emerald-600">
            <span>Manage feedback <Icon name="lucide:arrow-right" class="ml-1" /></span>
          </div>
        </NuxtLink>

        <!-- Card 4: Team Members -->
        <NuxtLink to="/admin/team" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-300"></div>
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Staff & Board</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.teamCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-purple-100 shadow-sm">
              <Icon name="lucide:users" class="text-xl" />
            </div>
          </div>
          <div class="mt-6 flex items-center text-xs font-semibold text-purple-600">
            <span>Manage profiles <Icon name="lucide:arrow-right" class="ml-1" /></span>
          </div>
        </NuxtLink>

      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Card 5: Services -->
        <NuxtLink to="/admin/services" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Services</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.servicesCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-sky-100 shadow-sm">
              <Icon name="lucide:server" class="text-xl" />
            </div>
          </div>
        </NuxtLink>

        <!-- Card 6: Inbox Messages -->
        <NuxtLink to="/admin/messages" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Inbox Messages</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.messagesCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-slate-100 shadow-sm">
              <Icon name="lucide:mail" class="text-xl" />
            </div>
          </div>
        </NuxtLink>

        <!-- Card 7: Administrators -->
        <NuxtLink to="/admin/users" class="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200 group relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Administrators</p>
              <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats?.usersCount || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-rose-100 shadow-sm">
              <Icon name="lucide:user-cog" class="text-xl" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const headers = useRequestHeaders(['cookie']);
const { data: stats, pending } = useFetch('/api/admin/dashboard/stats', {
  lazy: true,
  headers,
  key: 'admin-stats'
});
</script>
