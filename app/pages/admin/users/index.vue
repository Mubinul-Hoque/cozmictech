<template>
  <div class="space-y-6 font-sans">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Admin Users</h2>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Manage administrators and permissions</p>
      </div>
      <NuxtLink to="/admin/users/new" class="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold transition-all duration-200 bg-[#feb900] hover:bg-[#e5a600] border border-transparent rounded-full shadow-sm hover:shadow-md focus:outline-none" style="color: #1e293b;">
        <i class="bi bi-plus-lg mr-2 group-hover:rotate-90 transition-transform duration-200" style="color: #1e293b;"></i>
        Add User
      </NuxtLink>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#feb900]"></div>
      </div>
      
      <table v-else class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50/50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-[#364d59]/10 text-[#364d59] rounded-full flex items-center justify-center font-bold text-sm border border-[#364d59]/20 shadow-sm uppercase">
                  {{ user.username.charAt(0) }}
                </div>
                <div class="ml-3.5">
                  <div class="text-sm font-bold text-slate-800">{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {{ new Date(user.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-xs font-bold">
              <NuxtLink :to="`/admin/users/${user.id}`" class="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all duration-150 mr-2 border border-slate-250">Edit</NuxtLink>
              <button @click="deleteUser(user.id)" class="inline-flex items-center px-3 py-1.5 border border-slate-350 hover:border-red-500 text-slate-650 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-150">Delete</button>
            </td>
          </tr>
          <tr v-if="users?.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-slate-400">
                <i class="bi bi-inbox text-5xl mb-4 text-slate-350"></i>
                <p class="text-base font-bold text-slate-700">No users found</p>
                <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Get started by creating your first administrator.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const { data: users, pending, refresh } = useFetch('/api/admin/users');

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      refresh();
    } catch (error) {
      alert('Failed to delete user.');
    }
  }
};
</script>
