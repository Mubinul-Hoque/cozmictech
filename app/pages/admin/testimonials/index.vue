<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Testimonials Management</h2>
          <span 
            v-if="testimonials && testimonials.length" 
            class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200"
          >
            {{ testimonials.length }} Reviews
          </span>
        </div>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
          Configure client reviews, feedback, and star ratings
        </p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/testimonials/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <Icon name="lucide:plus" class="text-sm" /> Add Testimonial
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!testimonials || !testimonials.length" class="text-center py-20 text-slate-400 bg-white border border-slate-200 rounded-3xl">
      <Icon name="lucide:message-square-quote" class="text-4xl mb-4 block mx-auto text-slate-300" />
      <p class="font-semibold text-slate-600">No testimonials found</p>
      <p class="text-xs text-slate-400 mt-1">Add client feedback to showcase reviews on the public site.</p>
    </div>

    <!-- Cards Grid (Matching Team Members Visual Style) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="t in testimonials" 
        :key="t.id" 
        class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
      >
        <div class="p-6 space-y-4">
          <!-- Author Avatar, Name & Designation -->
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-xs">
              <img 
                :src="t.image ? (t.image.includes('/') ? t.image : '/assets/img/testimonials/' + t.image) : '/assets/img/testimonials/testimonials-1.jpg'" 
                class="w-full h-full object-cover" 
                :alt="t.name"
                @error="$event.target.src='/assets/img/testimonials/testimonials-1.jpg'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-base text-slate-800 leading-tight truncate" :title="t.name">
                {{ t.name }}
              </h4>
              <div class="text-[11px] text-slate-400 font-semibold tracking-wide uppercase truncate mt-0.5" :title="t.designation">
                {{ t.designation || 'Client' }}
              </div>
              <div v-if="t.company" class="text-[11px] text-slate-600 font-bold truncate mt-0.5" :title="t.company">
                {{ t.company }}
              </div>
            </div>
          </div>

          <!-- Star Rating -->
          <div class="flex items-center justify-between pt-1 border-t border-slate-100">
            <div class="flex items-center text-amber-400 gap-0.5">
              <Icon 
                v-for="n in 5" 
                :key="n" 
                name="lucide:star" 
                class="text-xs transition-colors"
                :class="n <= (t.stars || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'"
              />
            </div>
            <span class="text-[11px] font-bold text-slate-500">
              {{ t.stars || 5 }}.0 / 5
            </span>
          </div>

          <!-- Testimonial Text / Story -->
          <div class="relative bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
            <Icon name="lucide:quote" class="text-amber-300/40 text-xl absolute top-3 left-3 pointer-events-none" />
            <p class="text-xs text-slate-600 leading-relaxed italic line-clamp-4 pl-4 border-l-2 border-[#feb900]">
              "{{ t.story || 'No statement provided.' }}"
            </p>
          </div>
        </div>

        <!-- Card Footer Actions (Identical to Team Members) -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            ID: #{{ t.id }}
          </span>
          <div class="flex gap-2">
            <NuxtLink 
              :to="'/admin/testimonials/' + t.id" 
              class="w-8 h-8 rounded-lg bg-white text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors shadow-2xs"
              title="Edit Testimonial"
            >
              <Icon name="lucide:pencil" class="text-sm" />
            </NuxtLink>
            <button 
              @click="confirmDelete(t.id)" 
              class="w-8 h-8 rounded-lg bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              title="Delete Testimonial"
            >
              <Icon name="lucide:trash-2" class="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Testimonials'
});

const successMsg = ref('');
const { data: testimonials, pending, refresh } = useFetch('/api/admin/testimonials', { key: 'admin-testimonials-list' });

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this testimonial?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      successMsg.value = 'Testimonial deleted successfully.';
      setTimeout(() => successMsg.value = '', 4000);
      clearNuxtData();
      refresh();
    } catch (err) {
      console.error(err);
      useToast().error('Delete operation failed.');
    }
  }
};
</script>
