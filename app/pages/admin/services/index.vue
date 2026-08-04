<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Services</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Configure company operations & services</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/services/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95"
        >
          <Icon name="lucide:plus" class="text-sm" /> Add Service
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

    <!-- Table -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <div v-else-if="!sectors || !sectors.length" class="text-center py-20 text-slate-400">
        <Icon name="lucide:server" class="text-4xl mb-4 block" />
        <p class="font-semibold">No services defined. Add a service to get started.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Image & Name</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Icon Badge</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Description</th>
              <th scope="col" class="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="s in sectors || []" :key="s.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-8 rounded overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img 
                      :src="s.image ? (s.image.includes('/') ? s.image : '/assets/img/sectors/' + s.image) : '/assets/img/services.jpg'" 
                      class="w-full h-full object-cover" 
                      @error="$event.target.src='/assets/img/services.jpg'"
                    />
                  </div>
                  <div class="text-sm font-bold text-slate-800">{{ s.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl">
                  <Icon :name="s.icon || 'lucide:activity'" mode="svg" class="text-slate-500" />
                  {{ s.icon }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{{ s.short_description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="inline-flex gap-2">
                  <NuxtLink 
                    :to="'/admin/services/' + s.id" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors"
                  >
                    <Icon name="lucide:pencil" />
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(s.id)" 
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
  title: 'Services'
});

const successMsg = ref('');
const headers = useRequestHeaders(['cookie']);
const { data: sectors, pending, refresh } = useFetch('/api/admin/services', { headers, key: 'admin-services-list' });

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      successMsg.value = 'Service deleted successfully.';
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
