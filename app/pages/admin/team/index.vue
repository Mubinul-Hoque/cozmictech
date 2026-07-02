<template>
  <div class="space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Team Directory</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Configure staff, executives, & engineers</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/team/new" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95"
        >
          <i class="bi bi-plus-lg text-sm"></i> Add Member
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <i class="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>

    <!-- Loader / Empty Grid -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
    </div>

    <div v-else-if="!team.length" class="text-center py-20 text-slate-400 bg-white border border-slate-200 rounded-3xl">
      <i class="bi bi-people text-4xl mb-4 block"></i>
      <p class="font-semibold">No team members defined. Add a profile to get started.</p>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="member in team" 
        :key="member.id" 
        class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
      >
        <div class="p-6 space-y-4">
          <!-- Avatar & Info -->
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              <img 
                :src="member.image ? (member.image.includes('/') ? member.image : '/assets/img/team/' + member.image) : '/assets/img/team/team-1.jpg'" 
                class="w-full h-full object-cover"
                @error="$event.target.src='/assets/img/team/team-1.jpg'"
              />
            </div>
            <div>
              <h4 class="font-bold text-base text-slate-800 leading-tight">{{ member.name }}</h4>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">{{ member.designation }}</span>
            </div>
          </div>
          
          <!-- Message quote -->
          <p class="text-xs text-slate-500 leading-relaxed text-justify line-clamp-3 italic">
            "{{ member.message || 'No statement provided.' }}"
          </p>
        </div>

        <!-- Footer Actions -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            ID: #{{ member.id }}
          </span>
          <div class="flex gap-2">
            <NuxtLink 
              :to="'/admin/team/' + member.id" 
              class="w-8 h-8 rounded-lg bg-white text-slate-600 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-200 transition-colors"
            >
              <i class="bi bi-pencil"></i>
            </NuxtLink>
            <button 
              @click="confirmDelete(member.id)" 
              class="w-8 h-8 rounded-lg bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors"
            >
              <i class="bi bi-trash"></i>
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
  title: 'Team Directory'
});

const successMsg = ref('');
const { data: team, pending, refresh } = useFetch('/api/admin/team');

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this team member?')) {
    try {
      await $fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      successMsg.value = 'Team member deleted successfully.';
      setTimeout(() => successMsg.value = '', 4000);
      refresh();
    } catch (err) {
      console.error(err);
      alert('Delete operation failed.');
    }
  }
};
</script>
