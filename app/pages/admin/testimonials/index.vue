<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Testimonials Management</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Configure client comments & reviews</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/testimonials/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95"
        >
          <Icon name="lucide:plus" class="text-sm" /> Add Testimonial
        </NuxtLink>
      </div>
    </div>

    <!-- Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <div v-else-if="!testimonials.length" class="text-center py-20 text-slate-400">
        <Icon name="lucide:chat-left-quote" class="text-4xl mb-4 block" />
        <p class="font-semibold">No testimonials found. Add a review to get started.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Info</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comment Snippet</th>
              <th scope="col" class="px-6 py-4 class text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="t in testimonials" :key="t.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img 
                      :src="t.image ? (t.image.includes('/') ? t.image : '/assets/img/testimonials/' + t.image) : '/assets/img/testimonials/testimonials-1.jpg'" 
                      class="w-full h-full object-cover" 
                      @error="$event.target.src='/assets/img/testimonials/testimonials-1.jpg'"
                    />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-800">{{ t.name }}</div>
                    <div class="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">{{ t.designation }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">{{ t.company || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-amber-400 gap-0.5">
                  <Icon v-for="n in t.stars" :key="n" name="lucide:star" class="text-xs text-amber-400" />
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{{ t.story }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="inline-flex gap-2">
                  <NuxtLink 
                    :to="'/admin/testimonials/' + t.id" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <Icon name="lucide:pencil" />
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(t.id)" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <Icon name="lucide:trash-2" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
