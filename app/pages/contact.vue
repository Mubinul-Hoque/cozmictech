<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Contact</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li>Contact</li>
        </ol>
      </div>
    </div>

    <!-- ======= Contact Section ======= -->
    <section id="contact" class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">

        <!-- Info Boxes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Box 1 -->
          <div class="bg-gray-50 border border-gray-100 p-8 rounded-lg flex flex-col justify-center items-center text-center shadow-sm" data-aos="fade-up" data-aos-delay="100">
            <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#feb900] text-2xl mb-4">
              <i class="bi bi-map"></i>
            </div>
            <h3 class="font-bold text-lg text-[#2e3135] mb-2">Our Address</h3>
            <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
              {{ data?.contact?.address || '8/19, Sir Sayed Ahmed Road, Block-A, Mohammadpur, Dhaka-1207, Bangladesh' }}
            </p>
          </div>

          <!-- Box 2 -->
          <div class="bg-gray-50 border border-gray-100 p-8 rounded-lg flex flex-col justify-center items-center text-center shadow-sm" data-aos="fade-up" data-aos-delay="200">
            <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#feb900] text-2xl mb-4">
              <i class="bi bi-envelope"></i>
            </div>
            <h3 class="font-bold text-lg text-[#2e3135] mb-2">Email Us</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ data?.contact?.email || 'info@cozmictech.com' }}
            </p>
            <p class="text-gray-600 text-sm leading-relaxed" v-if="data?.contact?.email2">
              {{ data.contact.email2 }}
            </p>
          </div>

          <!-- Box 3 -->
          <div class="bg-gray-50 border border-gray-100 p-8 rounded-lg flex flex-col justify-center items-center text-center shadow-sm" data-aos="fade-up" data-aos-delay="300">
            <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#feb900] text-2xl mb-4">
              <i class="bi bi-telephone"></i>
            </div>
            <h3 class="font-bold text-lg text-[#2e3135] mb-2">Call Us</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ data?.contact?.phone || '+88 01894932401' }}
            </p>
            <p class="text-gray-600 text-sm leading-relaxed" v-if="data?.contact?.cell">
              Cell: {{ data.contact.cell }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <!-- Google Maps Iframe -->
          <div class="relative w-full h-[400px] overflow-hidden rounded-lg shadow-sm border border-gray-100" data-aos="fade-right">
            <iframe 
              :src="mapUrl" 
              class="w-full h-full border-0"
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <!-- Contact Form -->
          <div class="bg-gray-50 border border-gray-100 p-8 rounded-lg shadow-sm" data-aos="fade-left">
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    placeholder="Your Name" 
                    required 
                    class="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] outline-none text-sm text-gray-700 transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    v-model="form.email" 
                    placeholder="Your Email" 
                    required 
                    class="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] outline-none text-sm text-gray-700 transition-colors"
                  />
                </div>
              </div>

              <!-- Searchable Category Dropdown -->
              <div class="relative">
                <!-- Dropdown Backdrop Trigger (Close on click outside) -->
                <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-10 bg-transparent"></div>
                
                <button 
                  type="button" 
                  @click="isDropdownOpen = !isDropdownOpen"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-[#feb900] outline-none text-sm text-gray-400 hover:text-gray-700 transition-colors text-left flex justify-between items-center cursor-pointer relative z-10"
                  :class="{ 'border-[#feb900] ring-1 ring-[#feb900] text-gray-800': selectedCategoryName }"
                >
                  <span>{{ selectedCategoryName || 'Select Message Category *' }}</span>
                  <i class="bi" :class="isDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </button>

                <!-- Dropdown Card -->
                <div 
                  v-if="isDropdownOpen" 
                  class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 flex flex-col"
                >
                  <!-- Search Bar -->
                  <div class="p-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                    <i class="bi bi-search text-gray-400 text-sm"></i>
                    <input 
                      type="text" 
                      v-model="catSearch" 
                      placeholder="Search category..." 
                      class="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                      @click.stop
                    />
                  </div>
                  <!-- Dropdown Options list -->
                  <div class="overflow-y-auto flex-1 max-h-40 divide-y divide-gray-50">
                    <button 
                      v-for="cat in filteredCategories" 
                      :key="cat.id"
                      type="button"
                      @click="selectCategory(cat)"
                      class="w-full text-left px-4 py-2.5 hover:bg-amber-500/10 text-sm text-gray-700 hover:text-slate-900 transition-colors flex items-center justify-between"
                    >
                      <span>{{ cat.name }}</span>
                      <i v-if="form.message_cat_id === cat.id" class="bi bi-check-lg text-[#feb900]"></i>
                    </button>
                    <div v-if="filteredCategories.length === 0" class="p-4 text-center text-xs text-gray-450 font-bold uppercase tracking-wider">
                      No categories found
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  v-model="form.company" 
                  placeholder="Company Name" 
                  required 
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] outline-none text-sm text-gray-700 transition-colors"
                />
              </div>

              <div>
                <input 
                  type="text" 
                  v-model="form.subject" 
                  placeholder="Subject" 
                  required 
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] outline-none text-sm text-gray-700 transition-colors"
                />
              </div>

              <div>
                <textarea 
                  v-model="form.message" 
                  rows="5" 
                  placeholder="Message" 
                  required 
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] outline-none text-sm text-gray-700 transition-colors"
                ></textarea>
              </div>

              <!-- Form State Handlers -->
              <div v-if="loading" class="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></div>
                Sending message...
              </div>

              <div v-if="successMsg" class="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded">
                {{ successMsg }}
              </div>

              <div v-if="errorMsg" class="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-4 py-3 rounded">
                {{ errorMsg }}
              </div>

              <div class="text-center">
                <button 
                  type="submit" 
                  :disabled="loading"
                  class="bg-[#feb900] hover:bg-[#ffc732] disabled:opacity-50 text-[#0f172a] font-bold uppercase tracking-wider px-8 py-3.5 rounded transition-all duration-300 shadow-md hover:shadow-lg w-full"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const { data } = await useFetch('/api/contact')
const { data: categoriesRes } = await useFetch('/api/messages/categories')
const categories = computed(() => categoriesRes.value?.data || [])

const mapUrl = computed(() => {
  const mapPath = data.value?.contact?.map || '';
  if (mapPath) {
    return mapPath;
  }
  // Final fallback to default pin
  return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d912.8900124888902!2d90.36874588803688!3d23.76306319903172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0a9e3d1b953%3A0x25258dde0e7de0ff!2sMRDI%20Bangladesh!5e0!3m2!1sen!2sbd!4v1674397548469!5m2!1sen!2sbd';
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
    const { data: res, error } = await useFetch('/api/contact', {
      method: 'POST',
      body: form
    })

    if (error.value || !res.value?.success) {
      errorMsg.value = res.value?.message || error.value?.message || 'Failed to send message. Please try again.'
    } else {
      successMsg.value = res.value.message
      form.name = ''
      form.email = ''
      form.company = ''
      form.subject = ''
      form.message = ''
      form.message_cat_id = null
      selectedCategoryName.value = ''
    }
  } catch (err) {
    errorMsg.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
