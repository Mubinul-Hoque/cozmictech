<template>
  <div class="bg-white min-h-screen text-[#090402] pb-24 font-sans selection:bg-[#feb900]/20 selection:text-slate-900">
    <!-- ======= Editorial Hero Header ======= -->
    <section class="pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        <span class="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#feb900] uppercase mb-3">
          {{ data?.pageContent?.hero_eyebrow || 'Consultation • Inquiries • Reach Out' }}
        </span>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#090402] leading-[1.12] tracking-tight mb-4">
          {{ data?.pageContent?.hero_heading || 'Let’s Discuss Your Engineering Vision' }}
        </h1>
        <p class="text-neutral-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl font-normal">
          {{ data?.pageContent?.hero_body || 'Whether commencing comprehensive geotechnical ground investigations, commissioning structural designs, or seeking project management consultancy, our engineering directors in Dhaka are ready to assist.' }}
        </p>
      </div>
    </section>

    <!-- ======= Contact Details & Location Strip ======= -->
    <section class="pt-10 sm:pt-14">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12" data-aos="fade-up">
        
        <!-- 3 Modern Minimalist Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-16">
          
          <!-- Box 1: Address -->
          <div class="bg-neutral-50/60 border border-neutral-200/90 hover:border-neutral-400 rounded-2xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{{ data?.pageContent?.card_address_label || 'Office Location' }}</h2>
              <h3 class="font-display text-xl text-slate-900 font-normal mb-3">{{ data?.pageContent?.card_address_heading || 'Dhaka Headquarters' }}</h3>
              <p class="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                {{ data?.contact?.address || '3rd Floor, 1/1-A, 1/1-B, Adabor Bazar Road, Dhaka-1207, Bangladesh' }}
              </p>
            </div>
            <div class="pt-4 border-t border-neutral-200/60 text-[11px] text-neutral-400 font-medium">
              <span>{{ data?.pageContent?.card_address_footer || 'Open Sun – Thu • 9:00 AM – 6:00 PM' }}</span>
            </div>
          </div>

          <!-- Box 2: Email -->
          <div class="bg-neutral-50/60 border border-neutral-200/90 hover:border-neutral-400 rounded-2xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{{ data?.pageContent?.card_email_label || 'Electronic Mail' }}</h2>
              <h3 class="font-display text-xl text-slate-900 font-normal mb-3">{{ data?.pageContent?.card_email_heading || 'Direct Inquiries' }}</h3>
              <div class="space-y-1.5 text-xs sm:text-sm">
                <p>
                  <a :href="'mailto:' + (data?.contact?.email || 'info@cozmictech.com')" class="text-slate-900 font-medium hover:text-[#feb900] transition-colors">
                    {{ data?.contact?.email || 'info@cozmictech.com' }}
                  </a>
                </p>
                <p v-if="data?.contact?.email2">
                  <a :href="'mailto:' + data.contact.email2" class="text-neutral-500 hover:text-slate-900 transition-colors">
                    {{ data.contact.email2 }}
                  </a>
                </p>
              </div>
            </div>
            <div class="pt-4 border-t border-neutral-200/60 text-[11px] text-neutral-400 font-medium">
              <span>{{ data?.pageContent?.card_email_footer || 'Average response within 24 business hours' }}</span>
            </div>
          </div>

          <!-- Box 3: Phone -->
          <div class="bg-neutral-50/60 border border-neutral-200/90 hover:border-neutral-400 rounded-2xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{{ data?.pageContent?.card_phone_label || 'Telephone & Cellular' }}</h2>
              <h3 class="font-display text-xl text-slate-900 font-normal mb-3">{{ data?.pageContent?.card_phone_heading || 'Direct Hotline' }}</h3>
              <div class="space-y-1.5 text-xs sm:text-sm">
                <p>
                  <a :href="'tel:' + (data?.contact?.phone || '+8801894932401')" class="text-slate-900 font-medium hover:text-[#feb900] transition-colors">
                    {{ data?.contact?.phone || '+88 01894932401' }}
                  </a>
                </p>
                <p v-if="data?.contact?.cell">
                  <a :href="'tel:' + data.contact.cell" class="text-neutral-500 hover:text-slate-900 transition-colors">
                    Tel: {{ data.contact.cell }}
                  </a>
                </p>
              </div>
            </div>
            <div class="pt-4 border-t border-neutral-200/60 text-[11px] text-neutral-400 font-medium">
              <span>{{ data?.pageContent?.card_phone_footer || 'Urgent project consultations accommodated' }}</span>
            </div>
          </div>

        </div>

        <!-- ======= Main Form & Map Grid ======= -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          <!-- Left 7 Columns: Modern Interactive Form -->
          <div class="lg:col-span-7 bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
            <div class="mb-8">
              <h3 class="font-display text-2xl sm:text-3xl font-normal text-slate-900">Send a Message</h3>
              <p class="text-xs sm:text-sm text-neutral-500 mt-1.5 font-normal">
                Fill in the details regarding your project scope, site location, or business inquiry.
              </p>
            </div>

            <form @submit.prevent="submitForm" class="space-y-5">
              
              <!-- Name & Email Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label for="contact-name" class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Your Full Name <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    id="contact-name"
                    type="text" 
                    v-model="form.name" 
                    placeholder="e.g. Engr. Tanvir Ahmed" 
                    required 
                    class="w-full px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm text-slate-900 placeholder-neutral-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors"
                  />
                </div>

                <div class="space-y-1.5">
                  <label for="contact-email" class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Email Address <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    id="contact-email"
                    type="email" 
                    v-model="form.email" 
                    placeholder="e.g. tanvir@domain.com" 
                    required 
                    class="w-full px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm text-slate-900 placeholder-neutral-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors"
                  />
                </div>
              </div>

              <!-- Searchable Category Dropdown -->
              <div class="space-y-1.5 relative">
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Message Category <span class="text-rose-500">*</span>
                </label>
                
                <!-- Backdrop Trigger (Close on click outside) -->
                <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-20 bg-transparent"></div>
                
                <button 
                  type="button" 
                  @click="isDropdownOpen = !isDropdownOpen"
                  class="w-full px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm text-left flex justify-between items-center cursor-pointer transition-colors relative z-21"
                  :class="{ 'border-[#feb900] ring-1 ring-[#feb900] bg-white': isDropdownOpen || selectedCategoryName }"
                >
                  <span :class="selectedCategoryName ? 'text-slate-900 font-medium' : 'text-neutral-400'">
                    {{ selectedCategoryName || 'Select nature of inquiry...' }}
                  </span>
                  <Icon 
                    :name="isDropdownOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                    class="text-neutral-400 text-sm"
                  />
                </button>

                <!-- Dropdown Menu Box -->
                <div 
                  v-if="isDropdownOpen" 
                  class="absolute z-30 w-full mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden max-h-64 flex flex-col"
                >
                  <!-- Search Filter Input -->
                  <div class="p-3 border-b border-neutral-100 bg-neutral-50/80 flex items-center gap-2">
                    <Icon name="lucide:search" class="text-neutral-400 text-sm" />
                    <input 
                      type="text" 
                      v-model="catSearch" 
                      placeholder="Type to filter categories..." 
                      class="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-800 placeholder-neutral-400"
                      @click.stop
                    />
                  </div>
                  <!-- Category Options List -->
                  <div class="overflow-y-auto flex-1 max-h-48 divide-y divide-neutral-50">
                    <button 
                      v-for="cat in filteredCategories" 
                      :key="cat.id"
                      type="button"
                      @click="selectCategory(cat)"
                      class="w-full text-left px-4 py-2.5 hover:bg-amber-500/10 text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span :class="{ 'font-semibold text-slate-900': form.message_cat_id === cat.id }">{{ cat.name }}</span>
                      <Icon v-if="form.message_cat_id === cat.id" name="lucide:check" class="text-[#feb900] text-sm" />
                    </button>
                    <div v-if="filteredCategories.length === 0" class="p-4 text-center text-xs text-neutral-400">
                      No matching categories found
                    </div>
                  </div>
                </div>
              </div>

              <!-- Company & Subject Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label for="contact-company" class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Company / Organization
                  </label>
                  <input 
                    id="contact-company"
                    type="text" 
                    v-model="form.company" 
                    placeholder="e.g. Summit Power / Developer" 
                    class="w-full px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm text-slate-900 placeholder-neutral-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors"
                  />
                </div>

                <div class="space-y-1.5">
                  <label for="contact-subject" class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Subject Line <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    id="contact-subject"
                    type="text" 
                    v-model="form.subject" 
                    placeholder="e.g. Geotechnical soil testing proposal" 
                    required 
                    class="w-full px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm text-slate-900 placeholder-neutral-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors"
                  />
                </div>
              </div>

              <!-- Message Textarea -->
              <div class="space-y-1.5">
                <label for="contact-message" class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Project Narrative / Message <span class="text-rose-500">*</span>
                </label>
                <textarea 
                  id="contact-message"
                  v-model="form.message" 
                  rows="5" 
                  placeholder="Provide preliminary project scope details, plot dimensions, expected deliverables, or preferred timeline..." 
                  required 
                  class="w-full px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm text-slate-900 placeholder-neutral-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-colors leading-relaxed"
                ></textarea>
              </div>

              <!-- Feedback / State Messages -->
              <div v-if="successMsg" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <Icon name="lucide:check-circle" class="text-emerald-500 text-base shrink-0" />
                <span>{{ successMsg }}</span>
              </div>

              <div v-if="errorMsg" class="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <Icon name="lucide:alert-circle" class="text-rose-500 text-base shrink-0" />
                <span>{{ errorMsg }}</span>
              </div>

              <!-- Submit Action Button -->
              <div class="pt-2">
                <button 
                  type="submit" 
                  :disabled="loading"
                  class="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-[0.99]"
                >
                  <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  <span>{{ loading ? 'Sending...' : 'Send' }}</span>
                  <Icon v-if="!loading" name="lucide:arrow-right" class="text-sm text-[#feb900]" />
                </button>
              </div>
            </form>
          </div>

          <!-- Right 5 Columns: Interactive Map & Studio Guidelines -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- Google Maps Card Container -->
            <div class="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
              <div class="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-xs font-semibold text-slate-800">{{ data?.pageContent?.map_card_label || 'Head Office Location' }}</span>
                </div>
                <span class="text-[10px] font-mono text-neutral-400">{{ data?.pageContent?.map_card_badge || 'Dhaka-1207' }}</span>
              </div>
              <div class="relative w-full h-[320px] sm:h-[360px] bg-neutral-100">
                <iframe 
                  :src="mapUrl" 
                  class="w-full h-full border-0"
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Cozmic Technology Dhaka Office Map"
                ></iframe>
              </div>
            </div>

            <!-- Consultation SLA Card -->
            <div class="bg-neutral-50/60 border border-neutral-200/90 rounded-2xl p-6 sm:p-7 space-y-3">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#feb900]">{{ data?.pageContent?.guarantee_eyebrow || 'Response Guarantee' }}</span>
              <h4 class="font-display text-lg text-slate-900 font-normal">{{ data?.pageContent?.guarantee_heading || 'Fast-Track Technical Review' }}</h4>
              <p class="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                {{ data?.pageContent?.guarantee_body || 'Every project submission is routed directly to our designated discipline leads. For urgent soil testing or architectural tender proposals, please mention your target project milestones in the narrative.' }}
              </p>
              <div class="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-900">
                <Icon name="lucide:shield-check" class="text-base text-emerald-600" />
                <span>{{ data?.pageContent?.guarantee_assurance || 'Confidentiality & NDA Assured on Inquiries' }}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

useHead({
  title: 'Contact Us | Cozmic Technology - Engineering Consultancy',
  meta: [
    { name: 'description', content: 'Connect with Cozmic Technology in Dhaka, Bangladesh for geotechnical investigations, engineering consulting, architecture, and construction management.' },
    { property: 'og:title', content: 'Contact Cozmic Technology' },
    { property: 'og:description', content: 'Reach out to our expert engineering consultancy team in Dhaka, Bangladesh.' },
  ]
})

const { data: commonData } = useNuxtData('site-common-data')
const { data: contactPageData } = await useFetch('/api/contact', { key: 'contact-page' })
const data = computed(() => ({
  contact: contactPageData.value?.contact ?? commonData.value?.contact ?? null,
  pageContent: contactPageData.value?.pageContent ?? null
}))

const { data: categoriesRes } = await useFetch('/api/messages/categories', { key: 'contact-categories' })
const categories = computed(() => categoriesRes.value?.data || [])

const mapUrl = computed(() => {
  const mapPath = data.value?.contact?.map || ''
  if (mapPath) return mapPath
  return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.2790070836804!2d90.3599366!3d23.773077000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfc90524ddbf%3A0xc085273d03463ccc!2sCozmic%20Technology!5e0!3m2!1sen!2sbd!4v1782976193960!5m2!1sen!2sbd'
})

const form = reactive({
  name: '', 
  email: '', 
  company: '',
  subject: '', 
  message: '', 
  message_cat_id: null
})

const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const isDropdownOpen = ref(false)
const catSearch = ref('')
const selectedCategoryName = ref('')

const filteredCategories = computed(() => {
  const q = catSearch.value.toLowerCase().trim()
  if (!q) return categories.value
  return categories.value.filter(c => c.name?.toLowerCase().includes(q))
})

const selectCategory = (cat) => {
  form.message_cat_id = cat.id
  selectedCategoryName.value = cat.name
  isDropdownOpen.value = false
  catSearch.value = ''
}

const submitForm = async () => {
  if (!form.message_cat_id) {
    errorMsg.value = 'Please select a message category.'
    return
  }
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const res = await $fetch('/api/contact', { method: 'POST', body: form })
    if (res?.success) {
      successMsg.value = res.message || 'Your inquiry has been successfully transmitted. Our engineering directors will review and respond shortly.'
      form.name = form.email = form.company = form.subject = form.message = ''
      form.message_cat_id = null
      selectedCategoryName.value = ''
    } else {
      errorMsg.value = res?.message || 'Failed to send message. Please try again.'
    }
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || err?.message || 'An unexpected transmission error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
