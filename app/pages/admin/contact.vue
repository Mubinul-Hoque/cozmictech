<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Contact Page Settings</h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Configure office location, communication channels, and map embed</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink 
          to="/contact" 
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Icon name="lucide:external-link" class="text-sm" />
          View Live Page
        </NuxtLink>
        <button 
          @click="saveSettings" 
          :disabled="saving"
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
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

    <!-- Loader -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left 2 Cols: Form Inputs -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Page Copy & Headlines -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:text" class="text-[#feb900]" /> Hero Section
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Eyebrow Label</label>
              <input type="text" v-model="form.hero_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Heading</label>
              <input type="text" v-model="form.hero_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Intro Paragraph</label>
            <textarea rows="3" v-model="form.hero_body" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"></textarea>
          </div>
        </div>

        <!-- Info Card Copy -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:layout-grid" class="text-[#feb900]" /> Info Card Labels &amp; Footers
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <p class="text-xs font-bold text-slate-600">Address Card</p>
              <input type="text" v-model="form.card_address_label" placeholder="Label (e.g. Office Location)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              <input type="text" v-model="form.card_address_heading" placeholder="Heading (e.g. Dhaka Headquarters)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              <input type="text" v-model="form.card_address_footer" placeholder="Footer text" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div class="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <p class="text-xs font-bold text-slate-600">Email Card</p>
              <input type="text" v-model="form.card_email_label" placeholder="Label (e.g. Electronic Mail)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              <input type="text" v-model="form.card_email_heading" placeholder="Heading (e.g. Direct Inquiries)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              <input type="text" v-model="form.card_email_footer" placeholder="Footer text" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div class="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <p class="text-xs font-bold text-slate-600">Phone Card</p>
              <input type="text" v-model="form.card_phone_label" placeholder="Label (e.g. Telephone & Cellular)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              <input type="text" v-model="form.card_phone_heading" placeholder="Heading (e.g. Direct Hotline)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
              <input type="text" v-model="form.card_phone_footer" placeholder="Footer text" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>
        </div>

        <!-- Map Card & Guarantee Box Copy -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:shield-check" class="text-[#feb900]" /> Map Card &amp; Response Guarantee Box
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Map Card Label</label>
              <input type="text" v-model="form.map_card_label" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Map Card Badge Text</label>
              <input type="text" v-model="form.map_card_badge" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Guarantee Eyebrow</label>
              <input type="text" v-model="form.guarantee_eyebrow" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Guarantee Heading</label>
              <input type="text" v-model="form.guarantee_heading" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Guarantee Body Text</label>
            <textarea rows="3" v-model="form.guarantee_body" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"></textarea>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Assurance Line</label>
            <input type="text" v-model="form.guarantee_assurance" class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm" />
          </div>
        </div>

        <!-- Physical Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:map-pin" class="text-[#feb900]" /> Physical Address
          </h3>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Office Address</label>
            <textarea 
              v-model="form.address" 
              rows="3" 
              placeholder="e.g. 8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm resize-none"
            ></textarea>
            <p class="text-xs text-slate-400">Displayed in the contact box, footer, and company info widgets.</p>
          </div>
        </div>

        <!-- Phone Numbers & Email Addresses -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:phone-call" class="text-[#feb900]" /> Communication Channels
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Telephone</label>
              <div class="relative">
                <Icon name="lucide:phone" class="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  v-model="form.phone" 
                  placeholder="+88 01894932401"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile / Hotline Cell</label>
              <div class="relative">
                <Icon name="lucide:smartphone" class="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  v-model="form.cell" 
                  placeholder="+88 01894932401"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Email</label>
              <div class="relative">
                <Icon name="lucide:mail" class="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input 
                  type="email" 
                  v-model="form.email" 
                  placeholder="info@cozmictech.com"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Secondary / Support Email</label>
              <div class="relative">
                <Icon name="lucide:mail-check" class="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input 
                  type="email" 
                  v-model="form.email2" 
                  placeholder="support@cozmictech.com"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Google Maps Embed -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 class="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Icon name="lucide:map" class="text-[#feb900]" /> Google Maps Embed
          </h3>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Map Embed URL</label>
            <textarea 
              v-model="form.map" 
              rows="3" 
              placeholder="https://www.google.com/maps/embed?pb=..."
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] font-mono text-xs"
            ></textarea>
            <p class="text-xs text-slate-400">
              Paste the embed link URL (from Google Maps Share &rarr; Embed a map &rarr; copy the <code class="bg-slate-100 px-1 py-0.5 rounded">src="..."</code> URL).
            </p>
          </div>

          <!-- Live Map Preview -->
          <div v-if="form.map" class="mt-4 pt-4 border-t border-slate-100">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Map Preview</p>
            <div class="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] w-full max-h-64 shadow-inner">
              <iframe 
                :src="form.map" 
                class="w-full h-full border-0" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Quick Card Preview -->
      <div class="space-y-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#feb900] text-slate-900 flex items-center justify-center font-bold">
              <Icon name="lucide:eye" class="text-xl" />
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm">Contact Info Preview</h4>
              <p class="text-xs text-slate-400">How it appears to visitors</p>
            </div>
          </div>

          <div class="space-y-4 pt-2 text-xs text-slate-600">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Office</span>
              <p class="leading-relaxed text-slate-800">{{ form.address || 'Address not specified' }}</p>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Phones</span>
              <p class="text-slate-800">{{ form.phone || 'Phone not set' }}</p>
              <p v-if="form.cell" class="text-slate-500">Cell: {{ form.cell }}</p>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Emails</span>
              <p class="text-slate-800">{{ form.email || 'Email not set' }}</p>
              <p v-if="form.email2" class="text-slate-500">{{ form.email2 }}</p>
            </div>
          </div>
        </div>


        <div class="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 text-amber-900 text-xs space-y-2">
          <div class="flex items-center gap-2 font-bold text-amber-950">
            <Icon name="lucide:info" class="text-[#feb900] text-base" />
            <span>Synced Across Website</span>
          </div>
          <p class="leading-relaxed text-slate-700">
            Changes saved here automatically update the main website footer, contact widgets, and the public Contact Us page.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const toast = useToast()
const saving = ref(false)
const pending = ref(true)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
  address: '',
  phone: '',
  cell: '',
  email: '',
  email2: '',
  map: '',
  hero_eyebrow: '',
  hero_heading: '',
  hero_body: '',
  card_address_label: '',
  card_address_heading: '',
  card_address_footer: '',
  card_email_label: '',
  card_email_heading: '',
  card_email_footer: '',
  card_phone_label: '',
  card_phone_heading: '',
  card_phone_footer: '',
  map_card_label: '',
  map_card_badge: '',
  guarantee_eyebrow: '',
  guarantee_heading: '',
  guarantee_body: '',
  guarantee_assurance: ''
})

const loadSettings = async () => {
  try {
    pending.value = true
    const res = await $fetch('/api/admin/contact')
    if (res?.success && res.contact) {
      form.address = res.contact.address || ''
      form.phone = res.contact.phone || ''
      form.cell = res.contact.cell || ''
      form.email = res.contact.email || ''
      form.email2 = res.contact.email2 || ''
      form.map = res.contact.map || ''
    }
    if (res?.success && res.content) {
      Object.assign(form, res.content)
    }
  } catch (err) {
    console.error('Failed to load contact settings:', err)
    errorMsg.value = 'Failed to load contact settings'
  } finally {
    pending.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const res = await $fetch('/api/admin/contact', {
      method: 'POST',
      body: { ...form }
    })
    if (res?.success) {
      successMsg.value = 'Contact details updated successfully!'
      toast?.show?.('Contact details updated successfully!', 'success')
      setTimeout(() => {
        successMsg.value = ''
      }, 4000)
    }
  } catch (err) {
    console.error('Error saving contact settings:', err)
    errorMsg.value = err?.data?.statusMessage || 'Failed to save contact settings'
    toast?.show?.(errorMsg.value, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
