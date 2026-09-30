<template>
  <div class="space-y-8 font-sans pb-16">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          <NuxtLink to="/admin" class="hover:text-slate-600 transition-colors">Admin</NuxtLink>
          <Icon name="lucide:chevron-right" class="text-xs" />
          <span class="text-[#feb900]">Clients</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <span>Client Logos &amp; Partners</span>
        </h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          Manage brand logos and client names displayed across the website
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          v-if="clientForm.id" 
          type="button" 
          @click="resetClientForm"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
        >
          <Icon name="lucide:plus" class="text-sm" />
          Add New Client
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:alert-circle" class="text-rose-500 text-lg" />
        <span class="font-bold text-slate-700">{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column (2 Cols): Clients Grid -->
      <div class="lg:col-span-2 space-y-5">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Active Client Brands</h3>
              <p class="text-xs text-slate-400 mt-0.5">Total {{ clientsList.length }} partner logo{{ clientsList.length === 1 ? '' : 's' }} configured</p>
            </div>
            
            <!-- Quick Search Filter -->
            <div class="relative w-full sm:w-64">
              <Icon name="lucide:search" class="absolute left-3.5 top-3 text-slate-400 text-sm" />
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search clients..." 
                class="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-full bg-slate-50 focus:bg-white focus:outline-none focus:border-[#feb900] transition-colors"
              />
            </div>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div 
              v-for="client in filteredClients" 
              :key="client.id"
              class="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 relative group hover:-translate-y-1 hover:shadow-md hover:border-amber-300 transition-all duration-300"
              :class="clientForm.id === client.id ? 'ring-2 ring-[#feb900] bg-amber-50/40 border-amber-300' : ''"
            >
              <!-- Logo Image Box -->
              <div class="w-full aspect-[3/2] flex items-center justify-center bg-white rounded-xl border border-slate-100 p-3 overflow-hidden shadow-xs">
                <img 
                  :src="client.logo ? `/assets/img/${client.logo}` : '/assets/img/favicon.png'" 
                  :alt="client.client_name" 
                  class="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                />
              </div>
              
              <!-- Client Name -->
              <div class="text-center w-full px-1">
                <span class="text-xs font-bold text-slate-800 block truncate" :title="client.client_name">
                  {{ client.client_name }}
                </span>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center gap-2 justify-center w-full border-t border-slate-200/80 pt-2.5 mt-1">
                <button 
                  type="button" 
                  @click="editClient(client)" 
                  class="inline-flex items-center justify-center p-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-[#feb900] bg-white rounded-lg border border-slate-200 transition-all shadow-xs cursor-pointer"
                  title="Edit Client"
                >
                  <Icon name="lucide:pencil" class="text-xs" />
                </button>
                <button 
                  type="button" 
                  @click="deleteClient(client.id)" 
                  class="inline-flex items-center justify-center p-2 text-xs text-slate-600 hover:text-white hover:bg-rose-500 bg-white rounded-lg border border-slate-200 transition-all shadow-xs cursor-pointer"
                  title="Delete Client"
                >
                  <Icon name="lucide:trash-2" class="text-xs" />
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div 
              v-if="filteredClients.length === 0" 
              class="col-span-2 sm:col-span-3 py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 p-6 space-y-2"
            >
              <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Icon name="lucide:building-2" class="text-2xl" />
              </div>
              <p class="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {{ searchQuery ? 'No matching clients found' : 'No client logos added yet' }}
              </p>
              <p class="text-xs text-slate-400 max-w-sm mx-auto">
                {{ searchQuery ? 'Try adjusting your search query.' : 'Use the form on the right to upload brand logos.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (1 Col): Add / Edit Form Card -->
      <div class="space-y-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6 sticky top-6">
          <div class="border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2 text-[#feb900] text-xs font-extrabold uppercase tracking-wider mb-1">
              <Icon :name="clientForm.id ? 'lucide:pencil' : 'lucide:plus-circle'" />
              <span>{{ clientForm.id ? 'Edit Mode' : 'New Entry' }}</span>
            </div>
            <h4 class="text-base font-extrabold text-slate-800 tracking-tight">
              {{ clientForm.id ? 'Edit Client Details' : 'Add Brand Partner' }}
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ clientForm.id ? 'Update client name or replace logo image below.' : 'Enter company name and upload client logo.' }}
            </p>
          </div>

          <form @submit.prevent="saveClient" class="space-y-5">
            <!-- Name Input -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Client / Partner Name <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                v-model="clientForm.client_name"
                placeholder="e.g. Chevron, ExxonMobil, Shell"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm transition-colors"
                required
              />
            </div>

            <!-- Logo Upload Slot -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Brand Logo Image
              </label>
              
              <div class="flex items-center gap-4 mt-1">
                <!-- Preview Box -->
                <div v-if="clientForm.logo" class="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-2 shadow-xs flex-shrink-0">
                  <img :src="`/assets/img/${clientForm.logo}`" class="max-w-full max-h-full object-contain" />
                  <button 
                    type="button" 
                    @click="clientForm.logo = ''" 
                    class="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 leading-none shadow transition-all cursor-pointer"
                    title="Remove Logo"
                  >
                    <Icon name="lucide:x" class="text-xs" />
                  </button>
                </div>

                <!-- Upload Drag/Drop Box -->
                <label class="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-slate-50 hover:bg-amber-50/40 text-slate-600 rounded-xl border-2 border-slate-200 border-dashed hover:border-[#feb900] cursor-pointer transition-all">
                  <span v-if="clientUploading" class="animate-spin rounded-full h-5 w-5 border-2 border-[#feb900] border-t-transparent"></span>
                  <span v-else class="text-xs font-bold flex items-center gap-2 uppercase tracking-wide text-slate-700">
                    <Icon name="lucide:upload" class="text-sm text-[#feb900]" />
                    {{ clientForm.logo ? 'Change Image' : 'Upload Logo' }}
                  </span>
                  <span class="text-[10px] text-slate-400 mt-0.5">PNG, SVG or WEBP (Max 5MB)</span>
                  <input type="file" @change="onClientLogoUpload" class="hidden" accept="image/*" />
                </label>
              </div>
              <p class="text-[10px] text-slate-400">
                Transparent PNG or vector SVG logos display best across all theme presets.
              </p>
            </div>

            <!-- Submit Buttons -->
            <div class="flex items-center gap-3 pt-3">
              <button 
                type="submit" 
                :disabled="clientSaving || clientUploading"
                class="flex-1 inline-flex items-center justify-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer"
              >
                <span v-if="clientSaving" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent"></span>
                <Icon v-else name="lucide:check" class="text-sm" />
                {{ clientForm.id ? 'Save Changes' : 'Add Client' }}
              </button>
              
              <button 
                v-if="clientForm.id"
                type="button" 
                @click="resetClientForm"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Client Logos Directory | Admin Panel'
})

const toast = useToast()
const searchQuery = ref('')
const successMsg = ref('')
const errorMsg = ref('')

// Client Logos CRUD State & Fetch
const { data: clientsRes, pending, refresh: refreshClients } = await useFetch('/api/admin/clients')
const clientsList = computed(() => clientsRes.value?.data || [])

const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) return clientsList.value
  const q = searchQuery.value.toLowerCase().trim()
  return clientsList.value.filter(c => c.client_name?.toLowerCase().includes(q))
})

const clientForm = reactive({
  id: null,
  client_name: '',
  logo: ''
})

const clientSaving = ref(false)
const clientUploading = ref(false)

const onClientLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'clients')

  clientUploading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })
    clientForm.logo = data.filename
    toast?.success?.('Logo uploaded successfully!')
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to upload logo image. Ensure it is a valid image under 5MB.'
    toast?.error?.(errorMsg.value)
  } finally {
    clientUploading.value = false
  }
}

const saveClient = async () => {
  if (!clientForm.client_name.trim()) {
    errorMsg.value = 'Client name is required.'
    toast?.error?.(errorMsg.value)
    return
  }

  clientSaving.value = true
  errorMsg.value = ''
  successMsg.value = ''

  const isEdit = !!clientForm.id
  const method = isEdit ? 'PUT' : 'POST'

  try {
    const res = await useNuxtApp().$fetch('/api/admin/clients', {
      method,
      body: clientForm
    })

    if (res?.success) {
      const msg = res.message || (isEdit ? 'Client updated successfully.' : 'Client added successfully.')
      successMsg.value = msg
      toast?.success?.(msg)
      resetClientForm()
      await refreshClients()
      setTimeout(() => { successMsg.value = '' }, 4000)
    } else {
      errorMsg.value = res?.message || 'Failed to save client.'
      toast?.error?.(errorMsg.value)
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = err?.data?.statusMessage || err?.data?.message || 'An error occurred while saving client.'
    toast?.error?.(errorMsg.value)
  } finally {
    clientSaving.value = false
  }
}

const editClient = (client) => {
  clientForm.id = client.id
  clientForm.client_name = client.client_name
  clientForm.logo = client.logo || ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetClientForm = () => {
  clientForm.id = null
  clientForm.client_name = ''
  clientForm.logo = ''
}

const deleteClient = async (id) => {
  if (!confirm('Are you sure you want to delete this client?')) return

  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await useNuxtApp().$fetch(`/api/admin/clients?id=${id}`, {
      method: 'DELETE'
    })

    if (res?.success) {
      const msg = res.message || 'Client deleted successfully.'
      successMsg.value = msg
      toast?.success?.(msg)
      if (clientForm.id === id) resetClientForm()
      await refreshClients()
      setTimeout(() => { successMsg.value = '' }, 4000)
    } else {
      errorMsg.value = res?.message || 'Failed to delete client.'
      toast?.error?.(errorMsg.value)
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = err?.data?.statusMessage || err?.data?.message || 'An error occurred while deleting client.'
    toast?.error?.(errorMsg.value)
  }
}
</script>
