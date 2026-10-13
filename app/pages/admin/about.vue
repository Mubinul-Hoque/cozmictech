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
          <Icon v-else name="lucide:check" class="text-sm" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="successMsg" class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:check-circle-fill" class="text-emerald-500 text-lg" />
        <span class="font-bold text-slate-700">{{ successMsg }}</span>
      </div>
    </div>
    <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-800 text-sm">
      <div class="flex items-center gap-3">
        <Icon name="lucide:exclamation-triangle-fill" class="text-rose-500 text-lg" />
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
            <Icon name="lucide:card-text" class="text-[#feb900]" /> Hero / Story Section
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Eyebrow Label</label>
              <input type="text" v-model="form.hero_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tagline</label>
              <input type="text" v-model="form.tagline" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
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
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Location Text</label>
            <input type="text" v-model="form.location_text" placeholder="Dhaka, Bangladesh" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Story Body Description</label>
            <textarea
              rows="6"
              v-model="form.story_body"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Editorial Statement Quote</label>
            <textarea
              rows="3"
              v-model="form.story_body2"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Photograph</label>
            <div class="flex items-center gap-4">
              <img v-if="form.story_image" :src="form.story_image" class="w-24 h-16 object-cover rounded-lg border border-slate-200" />
              <input type="file" accept="image/*" @change="handleImageUpload($event, 'story_image')" class="text-xs" />
              <span v-if="uploadingField === 'story_image'" class="text-xs text-slate-400">Uploading...</span>
            </div>
          </div>
        </div>

        <!-- Mission & Vision section configs -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <Icon name="lucide:bullseye" class="text-[#feb900]" /> Mission & Capabilities Section
            </h3>
            <SectionVisibilityToggle v-model="form.mission_is_active" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
              <input type="text" v-model="form.mission_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Title</label>
              <input
                type="text"
                v-model="form.mission_title"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Body Description</label>
            <textarea
              rows="6"
              v-model="form.mission_body"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">"Mission" Sub-label</label>
              <input type="text" v-model="form.mission_label" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">"Guarantee" Sub-label</label>
              <input type="text" v-model="form.guarantee_label" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">"Disciplines" Sub-label</label>
              <input type="text" v-model="form.disciplines_label" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Section Image</label>
            <div class="flex items-center gap-4">
              <img v-if="form.mission_image" :src="form.mission_image" class="w-24 h-16 object-cover rounded-lg border border-slate-200" />
              <input type="file" accept="image/*" @change="handleImageUpload($event, 'mission_image')" class="text-xs" />
              <span v-if="uploadingField === 'mission_image'" class="text-xs text-slate-400">Uploading...</span>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-6 flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Icon name="lucide:eye" class="text-[#feb900]" /> Vision Section
            </h4>
            <SectionVisibilityToggle v-model="form.vision_is_active" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vision Eyebrow Label</label>
              <input type="text" v-model="form.vision_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
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

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vision Body Description</label>
            <textarea
              rows="6"
              v-model="form.vision_body"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vision Banner Image</label>
            <div class="flex items-center gap-4">
              <img v-if="form.vision_image" :src="form.vision_image" class="w-24 h-16 object-cover rounded-lg border border-slate-200" />
              <input type="file" accept="image/*" @change="handleImageUpload($event, 'vision_image')" class="text-xs" />
              <span v-if="uploadingField === 'vision_image'" class="text-xs text-slate-400">Uploading...</span>
            </div>
          </div>
        </div>

        <!-- Team section configs -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:users" class="text-[#feb900]" /> Team Section Settings
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
              <input type="text" v-model="form.team_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Team Title</label>
              <input
                type="text"
                v-model="form.team_title"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Team Section Description</label>
            <p class="text-xs text-slate-400">Separate paragraphs with a blank line. All paragraphs shown below the team title come from this field.</p>
            <textarea
              rows="6"
              v-model="form.team_description"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>
        </div>

        <!-- CTA Banner configs -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:megaphone" class="text-[#feb900]" /> Closing Call-To-Action Banner
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
              <input type="text" v-model="form.cta_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Heading</label>
              <input type="text" v-model="form.cta_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Body Text</label>
            <textarea
              rows="3"
              v-model="form.cta_body"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Metrics / Stats Icons -->
      <div class="space-y-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:bar-chart-line" class="text-[#feb900]" /> Metrics Counters
          </h3>

          <!-- Stat 1 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <input type="text" v-model="form.happy_label" placeholder="Stat Label" class="text-xs font-bold text-slate-500 uppercase tracking-wider bg-transparent border-none focus:outline-none w-2/3" />
              <Icon name="lucide:emoji-smile" class="text-slate-400" />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.happy_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.happy_client" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <input type="text" v-model="form.project_label" placeholder="Stat Label" class="text-xs font-bold text-slate-500 uppercase tracking-wider bg-transparent border-none focus:outline-none w-2/3" />
              <Icon name="lucide:journal-richtext" class="text-slate-400" />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.projects_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.project_nos" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <input type="text" v-model="form.support_label" placeholder="Stat Label" class="text-xs font-bold text-slate-500 uppercase tracking-wider bg-transparent border-none focus:outline-none w-2/3" />
              <Icon name="lucide:headset" class="text-slate-400" />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="form.support_icon" placeholder="Icon class" class="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              <input type="number" v-model="form.hrs_support" class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right" />
            </div>
          </div>

          <!-- Stat 4 -->
          <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
            <div class="flex justify-between items-center">
              <input type="text" v-model="form.emp_label" placeholder="Stat Label" class="text-xs font-bold text-slate-500 uppercase tracking-wider bg-transparent border-none focus:outline-none w-2/3" />
              <Icon name="lucide:users" class="text-slate-400" />
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
const errorMsg = ref('')
const successMsg = ref('')
const uploadingField = ref('')

const form = reactive({
  tagline: '',
  est: '',
  location_text: '',
  happy_icon: 'lucide:smile',
  happy_client: 0,
  happy_label: '',
  projects_icon: 'lucide:briefcase',
  project_nos: 0,
  project_label: '',
  support_icon: 'lucide:headset',
  hrs_support: 0,
  support_label: '',
  emp_icon: 'lucide:hard-hat',
  emp_nos: 0,
  emp_label: '',
  hero_eyebrow: '',
  mission_eyebrow: '',
  mission_label: '',
  guarantee_label: '',
  disciplines_label: '',
  vision_eyebrow: '',
  team_eyebrow: '',
  story_title: '',
  story_body: '',
  story_body2: '',
  story_image: '',
  mission_title: '',
  mission_body: '',
  mission_image: '',
  mission_is_active: true,
  vision_title: '',
  vision_body: '',
  vision_image: '',
  vision_is_active: true,
  team_title: '',
  team_description: '',
  cta_eyebrow: '',
  cta_heading: '',
  cta_body: ''
})

const handleImageUpload = async (event, field) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'page_sections')

  uploadingField.value = field
  errorMsg.value = ''

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })
    form[field] = data.url
  } catch (err) {
    console.error(err)
    errorMsg.value = err?.data?.statusMessage || err?.message || 'Image upload failed. Make sure it is an image and is under 500KB.'
  } finally {
    uploadingField.value = ''
  }
}

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
    const res = await useNuxtApp().$fetch('/api/admin/about', {
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
