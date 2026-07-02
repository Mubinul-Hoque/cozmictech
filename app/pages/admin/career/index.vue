<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Career Openings</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Manage active job vacancies and recruitment posts</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/career/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <i class="bi bi-plus-lg text-sm"></i> Add Job Opening
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm mb-6">
      <div class="flex items-center gap-3">
        <i class="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!careersData?.data?.length" class="text-center py-20 text-slate-400">
        <i class="bi bi-briefcase text-4xl mb-4 block text-slate-350"></i>
        <p class="font-semibold text-slate-700">No career openings found</p>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Get started by creating your first job opening.</p>
        <NuxtLink to="/admin/career/new" class="mt-4 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold transition-all duration-150 inline-block">
          Add Job Opening
        </NuxtLink>
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden">
        <table class="min-w-full divide-y divide-slate-200 table-fixed">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider" style="width: 45%; min-width: 300px; max-width: 500px;">Job Title</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vacancy</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deadline</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="job in careersData.data" :key="job.id" class="hover:bg-slate-55 transition-colors">
              <td class="px-6 py-4" style="min-width: 300px; max-width: 500px; white-space: normal; overflow-wrap: break-word;">
                <div class="text-sm font-bold text-slate-800">{{ job.post }}</div>
                <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Exp: {{ job.experience || 'Not specified' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">{{ job.vacancy }} post(s)</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{{ job.location }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-bold uppercase tracking-wider">{{ job.emp_status }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-semibold">
                {{ job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border" 
                  :class="job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'">
                  {{ job.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="inline-flex gap-2">
                  <NuxtLink 
                    :to="'/admin/career/' + job.id" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors"
                    title="Edit Job"
                  >
                    <i class="bi bi-pencil"></i>
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(job.id)" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors"
                    title="Delete Job"
                  >
                    <i class="bi bi-trash"></i>
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
import { ref } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Career Openings'
})

const successMsg = ref('')

const { data: careersData, pending, refresh } = await useFetch('/api/admin/career')

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this job opening?')) {
    try {
      await $fetch(`/api/admin/career/${id}`, { method: 'DELETE' })
      successMsg.value = 'Job opening successfully deleted.'
      setTimeout(() => successMsg.value = '', 4000)
      refresh()
    } catch (err) {
      console.error(err)
      alert('Delete operation failed.')
    }
  }
}
</script>
