<template>
  <div class="space-y-6 font-sans">
    <!-- Header & Back Button -->
    <div>
      <NuxtLink 
        to="/admin/messages" 
        class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 mb-3"
      >
        <Icon name="lucide:arrow-left" /> Back to Inbox
      </NuxtLink>
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Message Categories</h2>
      <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Configure message categories used in the contact form</p>
    </div>

    <!-- Alert Messages -->
    <div v-if="successMsg" class="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-2">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500" />
        <span class="font-semibold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="errorMsg" class="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-2">
        <Icon name="lucide:exclamation-triangle-fill" class="text-rose-500" />
        <span class="font-semibold text-slate-700">{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Main Grid: Left Side (Add/Edit Form), Right Side (Categories List) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Form Card -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h3 class="text-base font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4">
          {{ editingId ? 'Edit Category' : 'Create Category' }}
        </h3>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name *</label>
            <input 
              type="text" 
              v-model="form.name" 
              placeholder="e.g. Sales, Support, Careers" 
              required
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
            />
          </div>

          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="active-check"
              v-model="form.active" 
              class="w-4 h-4 rounded text-[#feb900] border-slate-300 focus:ring-[#feb900]"
            />
            <label for="active-check" class="text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer">Active / Visible in dropdown</label>
          </div>

          <div class="flex gap-2 pt-2">
            <button 
              type="submit" 
              :disabled="saving"
              class="flex-1 bg-[#feb900] hover:bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-[11px] py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer text-center"
            >
              {{ editingId ? 'Update' : 'Create' }}
            </button>
            <button 
              v-if="editingId" 
              type="button" 
              @click="cancelEdit"
              class="px-4 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Categories List Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
        <div v-if="pending" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-8 w-8 border-3 border-slate-200 border-t-[#feb900]"></div>
        </div>

        <table v-else class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-16">ID</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category Name</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="cat in categories" :key="cat.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 text-sm font-semibold text-slate-400 font-mono">{{ cat.id }}</td>
              <td class="px-6 py-4 text-sm font-bold text-slate-700">{{ cat.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="toggleStatus(cat)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer"
                  :class="cat.active ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/25 hover:bg-rose-500/20'"
                >
                  {{ cat.active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                <button 
                  @click="startEdit(cat)"
                  class="inline-flex items-center px-3 py-1.5 border border-slate-200 hover:border-[#feb900] text-slate-600 hover:text-slate-900 rounded-full transition-all duration-150"
                >
                  Edit
                </button>
                <button 
                  @click="deleteCategory(cat.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-slate-200 hover:border-red-500 text-slate-600 hover:text-red-650 hover:bg-red-50 rounded-full transition-all duration-150"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="categories.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                <Icon name="lucide:tags" class="text-4xl mb-2 text-slate-350" />
                <p class="text-sm font-bold">No categories defined</p>
                <p class="text-xs mt-0.5">Use the form on the left to create one.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Message Categories'
})

const editingId = ref(null)
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
  name: '',
  active: true
})

// Fetch all categories (active & inactive)
const { data: catRes, pending, refresh } = await useFetch('/api/admin/messages/categories')
const categories = computed(() => catRes.value?.data || [])

const startEdit = (cat) => {
  editingId.value = cat.id
  form.name = cat.name
  form.active = cat.active
}

const cancelEdit = () => {
  editingId.value = null
  form.name = ''
  form.active = true
}

const submitForm = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    let res
    if (editingId.value) {
      // Update
      res = await useNuxtApp().$fetch(`/api/admin/messages/categories/${editingId.value}`, {
        method: 'PUT',
        body: form
      })
    } else {
      // Create
      res = await useNuxtApp().$fetch('/api/admin/messages/categories', {
        method: 'POST',
        body: form
      })
    }

    if (res.success) {
      successMsg.value = editingId.value 
        ? 'Message category updated successfully.'
        : 'Message category created successfully.'
      cancelEdit()
      refresh()
      setTimeout(() => successMsg.value = '', 4500)
    } else {
      errorMsg.value = 'Operation failed. Please try again.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'An unexpected error occurred.'
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (cat) => {
  try {
    const res = await useNuxtApp().$fetch(`/api/admin/messages/categories/${cat.id}`, {
      method: 'PUT',
      body: { active: !cat.active }
    })
    if (res.success) {
      refresh()
    }
  } catch (err) {
    console.error(err)
    useToast().error('Failed to toggle active status.')
  }
}

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category? Linked messages will be marked as Uncategorized.')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/messages/categories/${id}`, {
        method: 'DELETE'
      })
      successMsg.value = 'Category deleted successfully.'
      refresh()
      setTimeout(() => successMsg.value = '', 4500)
    } catch (err) {
      console.error(err)
      useToast().error('Failed to delete category.')
    }
  }
}
</script>
