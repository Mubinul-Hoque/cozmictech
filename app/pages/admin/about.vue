<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">About Us Settings</h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Configure company description, team headers, story blocks & counters</p>
      </div>
      <div>
        <button 
          @click="saveSettings" 
          :disabled="saving"
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <span v-if="saving" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
          <i v-else class="bi bi-check-lg text-sm"></i>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <i class="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <i class="bi bi-exclamation-triangle-fill text-rose-500 text-lg"></i>
        <span class="font-bold text-slate-700">{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <!-- Panel Forms -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left 2 Cols: Main Fields -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <i class="bi bi-card-text text-[#feb900]"></i> Core Story Blocks
          </h3>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tagline</label>
            <input 
              type="text" 
              v-model="form.tagline" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Story Title</label>
              <input 
                type="text" 
                v-model="form.story_title" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Establishment Year</label>
              <input 
                type="text" 
                v-model="form.est" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Story Body Description</label>
            <textarea 
              rows="6"
              v-model="form.story_body" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Title</label>
              <input 
                type="text" 
                v-model="form.mission_title" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vision Title</label>
              <input 
                type="text" 
                v-model="form.vision_title" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Body Description</label>
              <textarea 
                rows="6"
                v-model="form.mission_body" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vision Body Description</label>
              <textarea 
                rows="6"
                v-model="form.vision_body" 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Team section configs -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <i class="bi bi-people text-[#feb900]"></i> Team Section Settings
          </h3>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Team Title</label>
            <input 
              type="text" 
              v-model="form.team_title" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Team Section Description</label>
            <textarea 
              rows="3"
              v-model="form.team_description" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Metrics / Stats Icons -->
      <div class="space-y-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <i class="bi bi-bar-chart-line text-[#feb900]"></i> Metrics Counters
          </h3>

          <!-- Stat 1 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Happy Clients</label>
              <i class="bi bi-emoji-smile text-slate-400"></i>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.happy_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.happy_client" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Projects</label>
              <i class="bi bi-journal-richtext text-slate-400"></i>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.projects_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.project_nos" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours Of Support</label>
              <i class="bi bi-headset text-slate-400"></i>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.support_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.hrs_support" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

          <!-- Stat 4 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Employees</label>
              <i class="bi bi-people text-slate-400"></i>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.emp_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.emp_nos" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'About Us Settings'
})

const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
  tagline: '',
  est: '',
  happy_icon: 'bi bi-emoji-smile',
  happy_client: 0,
  projects_icon: 'bi bi-journal-richtext',
  project_nos: 0,
  support_icon: 'bi bi-headset',
  hrs_support: 0,
  emp_icon: 'bi bi-people',
  emp_nos: 0,
  story_title: '',
  story_body: '',
  story_body2: '',
  mission_title: '',
  mission_body: '',
  vision_title: '',
  vision_body: '',
  values_title: '',
  values_body: 0,
  team_title: '',
  team_description: ''
})

// Fetch settings from API
const { data: adminAboutRes, pending, refresh } = await useFetch('/api/admin/about')

const loadSettings = () => {
  if (adminAboutRes.value && adminAboutRes.value.success && adminAboutRes.value.about) {
    Object.assign(form, adminAboutRes.value.about)
  }
}

onMounted(() => {
  loadSettings()
})

watch(adminAboutRes, () => {
  loadSettings()
})

const saveSettings = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const res = await $fetch('/api/admin/about', {
      method: 'POST',
      body: form
    })

    if (res.success) {
      successMsg.value = 'About Us configuration successfully saved.'
      refresh()
      setTimeout(() => successMsg.value = '', 4000)
    } else {
      errorMsg.value = res.message || 'Failed to save configuration.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'An unexpected error occurred while saving configs.'
  } finally {
    saving.value = false
  }
}
</script>
