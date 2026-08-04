<template>
  <div class="space-y-8 font-sans max-w-4xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {{ isNew ? 'Add Job Opening' : 'Edit Job Opening' }}
        </h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          {{ isNew ? 'Create a new job posting for recruitment' : 'Modify job posting operational parameters' }}
        </p>
      </div>
      <div>
        <NuxtLink 
          to="/admin/career" 
          class="inline-flex items-center gap-2 border border-slate-350 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-150 shadow-sm"
        >
          Cancel
        </NuxtLink>
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

    <!-- Form card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <form @submit.prevent="submitForm" class="space-y-6">
        
        <!-- Job core inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Job Position Title *</label>
            <input 
              type="text" 
              v-model="form.post" 
              placeholder="e.g. Senior Geotechnical Engineer" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Location *</label>
            <input 
              type="text" 
              v-model="form.location" 
              placeholder="e.g. Mohammadpur, Dhaka" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vacancies count *</label>
            <input 
              type="number" 
              v-model="form.vacancy" 
              min="1"
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Employment Status *</label>
            <select 
              v-model="form.emp_status" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Needed</label>
            <input 
              type="text" 
              v-model="form.experience" 
              placeholder="e.g. 3 to 5 years" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Range</label>
            <input 
              type="text" 
              v-model="form.salary" 
              placeholder="e.g. Negotiable or BDT 50,000 - 70,000" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Gender Requirement</label>
            <input 
              type="text" 
              v-model="form.gender" 
              placeholder="e.g. Any or Male/Female" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Application Deadline</label>
            <input 
              type="date" 
              v-model="form.deadline" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Recruitment Status</label>
            <select 
              v-model="form.status" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Description Areas -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Job Description *</label>
          <LazyRichTextEditor 
            v-model="form.description" 
            placeholder="Describe the job vacancy role..." 
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Job Responsibilities *</label>
          <LazyRichTextEditor 
            v-model="form.responsibilities" 
            placeholder="List primary duties and responsibilities..." 
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Educational Requirements *</label>
          <textarea 
            rows="3"
            v-model="form.Edu_Qlty" 
            placeholder="e.g. B.Sc. in Civil/Geotechnical Engineering from a recognized university." 
            required
            class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Other Benefits</label>
          <LazyRichTextEditor 
            v-model="form.other_beninifs" 
            placeholder="e.g. Two festival bonuses, mobile allowance, friendly workspace." 
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="submit" 
            :disabled="saving"
            class="px-6 py-3 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
          >
            {{ saving ? 'Saving...' : 'Save Job Posting' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Edit Career Opening'
})

const route = useRoute()
const router = useRouter()
const isNew = route.params.id === 'new'
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
  post: '',
  location: 'Dhaka',
  vacancy: 1,
  emp_status: 'Full-Time',
  experience: '',
  salary: 'Negotiable',
  gender: 'Any',
  deadline: '',
  description: '',
  responsibilities: '',
  Edu_Qlty: '',
  other_beninifs: '',
  status: 'Active'
})

onMounted(async () => {
  if (!isNew) {
    try {
      const res = await useNuxtApp().$fetch(`/api/admin/career/${route.params.id}`)
      if (res.success && res.data) {
        Object.assign(form, res.data)
        // Format deadline date for date input (YYYY-MM-DD)
        if (form.deadline) {
          form.deadline = new Date(form.deadline).toISOString().split('T')[0]
        }
      }
    } catch (err) {
      console.error(err)
      errorMsg.value = 'Failed to load job details.'
    }
  }
})

const submitForm = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  const url = isNew ? '/api/admin/career' : `/api/admin/career/${route.params.id}`
  const method = isNew ? 'POST' : 'PUT'

  try {
    const res = await useNuxtApp().$fetch(url, {
      method,
      body: form
    })

    if (res.success) {
      successMsg.value = isNew ? 'Job opening successfully created.' : 'Job details successfully saved.'
      router.push('/admin/career');
    } else {
      errorMsg.value = res.message || 'Operation failed.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'An unexpected error occurred while saving.'
  } finally {
    saving.value = false
  }
}
</script>
