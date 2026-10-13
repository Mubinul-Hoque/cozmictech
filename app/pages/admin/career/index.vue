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
          <Icon name="lucide:plus" class="text-sm" /> Add Job Opening
        </NuxtLink>
      </div>
    </div>

    <!-- Success Feedback Banner -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm mb-6">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="pageContentError" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm mb-6">
      <div class="flex items-center gap-3">
        <Icon name="lucide:exclamation-triangle-fill" class="text-rose-500 text-lg" />
        <span class="font-bold text-slate-700">{{ pageContentError }}</span>
      </div>
    </div>

    <!-- Career Page Content (Hero Highlights / Speculative CTA) -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm">
      <button
        type="button"
        @click="contentOpen = !contentOpen"
        class="w-full flex items-center justify-between p-6 cursor-pointer select-none"
      >
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <Icon name="lucide:layout-template" class="text-[#feb900]" /> Career Page Content
          </h3>
          <p class="text-xs text-slate-400 mt-1">Hero highlights strip &amp; speculative application call-to-action for the public /career page</p>
        </div>
        <Icon name="lucide:chevron-down" class="text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': contentOpen }" />
      </button>

      <div v-show="contentOpen" class="px-6 pb-8 space-y-8 border-t border-slate-100 pt-6">
        <div v-if="contentPending" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-[#feb900]"></div>
        </div>

        <template v-else>
          <!-- Hero eyebrow -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Eyebrow Label</label>
            <input type="text" v-model="pageContent.hero_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
          </div>

          <!-- Highlights Repeater -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Highlights Strip Tiles</label>
              <button type="button" @click="addHighlight" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#feb900] hover:text-amber-600">
                <Icon name="lucide:plus-circle" /> Add Tile
              </button>
            </div>

            <div
              v-for="(item, idx) in pageContent.highlights"
              :key="idx"
              class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <input type="text" v-model="item.label" placeholder="Label (e.g. Headquarters)" class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              <input type="text" v-model="item.value" placeholder="Value (e.g. Dhaka, Bangladesh)" class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              <div class="flex items-center gap-1 justify-end">
                <button type="button" @click="moveHighlight(idx, -1)" :disabled="idx === 0" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center justify-center">
                  <Icon name="lucide:chevron-up" class="text-xs" />
                </button>
                <button type="button" @click="moveHighlight(idx, 1)" :disabled="idx === pageContent.highlights.length - 1" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center justify-center">
                  <Icon name="lucide:chevron-down" class="text-xs" />
                </button>
                <button type="button" @click="removeHighlight(idx)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center">
                  <Icon name="lucide:trash-2" class="text-xs" />
                </button>
              </div>
            </div>

            <p v-if="!pageContent.highlights.length" class="text-xs text-slate-400 text-center py-4">No highlight tiles yet. Click "Add Tile" to populate the hero strip shown on the public Careers page.</p>
          </div>

          <!-- Speculative Application Box -->
          <div class="space-y-4 border-t border-slate-100 pt-6">
            <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Speculative Application Box</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
                <input type="text" v-model="pageContent.speculative_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Button Label</label>
                <input type="text" v-model="pageContent.speculative_button_label" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Heading</label>
              <input type="text" v-model="pageContent.speculative_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Body Text</label>
              <textarea rows="3" v-model="pageContent.speculative_body" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"></textarea>
            </div>

            <p class="text-[11px] text-slate-400">
              Applications are sent to the recruitment email configured in Global Settings &rarr; Contact Information ({{ pageContent.contact_email }}).
            </p>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="button"
              @click="savePageContent"
              :disabled="savingContent"
              class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <span v-if="savingContent" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
              <Icon v-else name="lucide:check" class="text-sm" />
              {{ savingContent ? 'Saving...' : 'Save Page Content' }}
            </button>
          </div>
        </template>
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
        <Icon name="lucide:briefcase" class="text-4xl mb-4 block text-slate-350" />
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
                    <Icon name="lucide:pencil" />
                  </NuxtLink>
                  <button 
                    @click="confirmDelete(job.id)" 
                    class="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200 transition-colors"
                    title="Delete Job"
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
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Career Openings'
})

const successMsg = ref('')

const { data: careersData, pending, refresh } = await useFetch('/api/admin/career', { key: 'admin-career-list' })

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this job opening?')) {
    try {
      await useNuxtApp().$fetch(`/api/admin/career/${id}`, { method: 'DELETE' })
      successMsg.value = 'Job opening successfully deleted.'
      setTimeout(() => successMsg.value = '', 4000)
      refresh()
    } catch (err) {
      console.error(err)
      useToast().error('Delete operation failed.')
    }
  }
}

// ─── Career Page Content (Hero Highlights / Speculative CTA) ────────────
const contentOpen = ref(false)
const contentPending = ref(true)
const savingContent = ref(false)
const pageContentError = ref('')

const pageContent = reactive({
  hero_eyebrow: '',
  highlights: [],
  speculative_eyebrow: '',
  speculative_heading: '',
  speculative_body: '',
  speculative_button_label: '',
  contact_email: ''
})

const loadPageContent = async () => {
  contentPending.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/career/page-content')
    if (res.success && res.content) {
      Object.assign(pageContent, res.content)
    }
  } catch (err) {
    console.error(err)
    pageContentError.value = 'Failed to load career page content.'
  } finally {
    contentPending.value = false
  }
}

onMounted(loadPageContent)

const addHighlight = () => {
  pageContent.highlights.push({ label: '', value: '' })
}

const removeHighlight = (idx) => {
  pageContent.highlights.splice(idx, 1)
}

const moveHighlight = (idx, dir) => {
  const target = idx + dir
  if (target < 0 || target >= pageContent.highlights.length) return
  const items = pageContent.highlights
  ;[items[idx], items[target]] = [items[target], items[idx]]
}

const savePageContent = async () => {
  savingContent.value = true
  pageContentError.value = ''
  successMsg.value = ''

  try {
    const res = await useNuxtApp().$fetch('/api/admin/career/page-content', {
      method: 'POST',
      body: pageContent
    })
    if (res.success) {
      successMsg.value = 'Career page content saved successfully.'
      setTimeout(() => { successMsg.value = '' }, 4000)
    }
  } catch (err) {
    console.error(err)
    pageContentError.value = err?.data?.statusMessage || 'Failed to save career page content.'
  } finally {
    savingContent.value = false
  }
}
</script>
