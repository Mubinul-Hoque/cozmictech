<template>
  <div class="space-y-6 font-sans">
    <!-- Header Grid -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Messages</h2>
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Manage and read customer contact submissions</p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/messages/categories" 
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
        >
          <Icon name="lucide:tags-fill" />
          Manage Categories
        </NuxtLink>
      </div>
    </div>

    <!-- Search and Filters Panel -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <!-- Search Input -->
      <div class="relative w-full md:max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Icon name="lucide:search" /></span>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search sender, subject, or message content..." 
          class="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm transition-colors"
        />
      </div>
      <!-- Category Filter -->
      <div class="relative w-full md:max-w-xs">
        <select 
          v-model="filterCategory" 
          class="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#feb900] text-sm transition-colors cursor-pointer appearance-none"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 pointer-events-none"><Icon name="lucide:chevron-down" class="text-xs" /></span>
      </div>
    </div>

    <!-- Messages List Container -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#feb900]"></div>
      </div>
      
      <table v-else class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50/50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Sender</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-100">
          <tr v-for="msg in messages" :key="msg.id" class="hover:bg-slate-50/50 transition-colors" :class="{ 'font-semibold bg-amber-50/20': msg.status === 0 }">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-[#364d59]">{{ msg.name }}</div>
              <div class="text-xs text-slate-400 font-medium mt-0.5">{{ msg.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                v-if="msg.category"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                :class="msg.category.active ? 'bg-amber-500/10 text-amber-800 border-amber-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'"
              >
                {{ msg.category.name }}
              </span>
              <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-400 border border-slate-200 italic">
                Uncategorized
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
              {{ msg.subject }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="msg.status === 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">New</span>
              <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-650 border border-slate-250">Read</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {{ new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-xs font-bold">
              <NuxtLink :to="`/admin/messages/${msg.id}`" class="inline-flex items-center px-3 py-1.5 bg-[#feb900] hover:bg-[#e5a600] rounded-full transition-all duration-150 mr-2 shadow-sm" style="color: #1e293b;">View</NuxtLink>
              <button @click="deleteMessage(msg.id)" class="inline-flex items-center px-3 py-1.5 border border-slate-350 hover:border-red-500 text-slate-600 hover:text-red-650 hover:bg-red-50 rounded-full transition-all duration-150">Delete</button>
            </td>
          </tr>
          <tr v-if="messages?.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-slate-400">
                <Icon name="lucide:inbox" class="text-5xl mb-4 text-slate-350" />
                <p class="text-base font-bold text-slate-700">No messages found</p>
                <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">No messages match search or category criteria.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Inbox Messages'
})

const searchTerm = ref('')
const filterCategory = ref('')

// Load categories for drop-down filter
const { data: catRes } = await useFetch('/api/admin/messages/categories')
const categories = computed(() => catRes.value?.data || [])

// Watch search & category changes to fetch filtered messages
const { data: messages, pending, refresh } = await useFetch('/api/admin/messages', {
  query: computed(() => {
    return {
      search: searchTerm.value,
      catId: filterCategory.value
    }
  }),
  key: 'admin-messages-list'
})

const deleteMessage = async (id) => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      refresh()
    } catch (error) {
      useToast().error('Failed to delete message.')
    }
  }
}
</script>
