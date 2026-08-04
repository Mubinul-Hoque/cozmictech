import fs from 'fs';

let content = fs.readFileSync('app/pages/admin/settings.vue', 'utf8');

// 1. Add strengths to tabs
if (!content.includes('id: \'strengths\'')) {
  content = content.replace(
    /\{ id: 'clients', name: 'Client Logos', icon: 'bi bi-briefcase' \}/,
    `{ id: 'clients', name: 'Client Logos', icon: 'bi bi-briefcase' },\n    { id: 'strengths', name: 'Our Strengths', icon: 'lucide:lightning-charge' }`
  );
}

// 2. Add strengths variables and methods
if (!content.includes('const strengthsList = ref')) {
  const strengthLogic = `
  // --- Strengths Logic ---
  const strengthsList = ref([])
  const strengthSaving = ref(false)
  const strengthForm = reactive({ id: null, title: '', content: '', icon: 'lucide:activity' })
  
  const popularIcons = [
    'check-circle-2', 'users', 'user-cog', 'wrench', 'building-2', 'hard-hat', 'compass', 'droplets', 
    'leaf', 'globe', 'zap', 'shield-check', 'lightbulb', 'bar-chart-3', 'trending-up', 'network'
  ]

  const fetchStrengths = async () => {
    try {
      const res = await useNuxtApp().$fetch('/api/admin/strengths')
      if (res.success) {
        strengthsList.value = res.data
      }
    } catch (err) {
      console.error(err)
    }
  }

  const resetStrengthForm = () => {
    strengthForm.id = null
    strengthForm.title = ''
    strengthForm.content = ''
    strengthForm.icon = 'lucide:activity'
  }

  const editStrength = (strength) => {
    strengthForm.id = strength.id
    strengthForm.title = strength.title
    strengthForm.content = strength.content || ''
    strengthForm.icon = strength.icon || 'lucide:activity'
    activeTab.value = 'strengths'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveStrength = async () => {
    if (!strengthForm.title) {
      useToast().error('Strength title is required')
      return
    }
    strengthSaving.value = true
    try {
      const url = '/api/admin/strengths'
      const method = strengthForm.id ? 'PUT' : 'POST'
      const res = await useNuxtApp().$fetch(url, { method, body: strengthForm })
      if (res.success) {
        useToast().success(res.message)
        await fetchStrengths()
        resetStrengthForm()
      }
    } catch (err) {
      useToast().error('Failed to save strength')
      console.error(err)
    } finally {
      strengthSaving.value = false
    }
  }

  const deleteStrength = async (id) => {
    if (!confirm('Are you sure you want to delete this strength?')) return
    try {
      const res = await useNuxtApp().$fetch('/api/admin/strengths?id=' + id, { method: 'DELETE' })
      if (res.success) {
        useToast().success(res.message)
        await fetchStrengths()
      }
    } catch (err) {
      useToast().error('Failed to delete strength')
      console.error(err)
    }
  }
`;

  content = content.replace('const fetchClients = async () => {', strengthLogic + '\n  const fetchClients = async () => {');
}

// 3. Add fetchStrengths to onMounted
if (!content.includes('fetchStrengths()')) {
  content = content.replace('fetchClients()', 'fetchClients()\n    fetchStrengths()');
}

// 4. Add template for strengths
if (!content.includes('activeTab === \'strengths\'')) {
  const templateHtml = `

          <!-- TAB 9: OUR STRENGTHS -->
          <div v-if="activeTab === 'strengths'" class="space-y-6 animate-fade-in-up">
            <div class="border-b border-slate-100 pb-4">
              <h3 class="text-lg font-bold text-slate-700">Our Strengths CRUD</h3>
              <p class="text-xs text-slate-400 mt-1">Manage the core strengths items displayed on the homepage under "Our Strengths".</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              <!-- Left Column: Existing Strengths List -->
              <div class="lg:col-span-2 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    v-for="strength in strengthsList" 
                    :key="strength.id"
                    class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow transition-all group"
                  >
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-lg bg-amber-50 text-[#feb900] flex items-center justify-center flex-shrink-0">
                        <Icon :name="strength.icon || 'lucide:check-circle-2'" class="text-xl" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-slate-800 truncate">{{ strength.title }}</h4>
                        <p class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ strength.content || 'No content provided.' }}</p>
                      </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-auto">
                      <button 
                        type="button" 
                        @click="editStrength(strength)" 
                        class="inline-flex items-center justify-center p-1.5 text-xs text-slate-500 hover:text-[#feb900] bg-white rounded-lg border border-slate-200 transition-colors shadow-sm cursor-pointer"
                        title="Edit Strength"
                      >
                        <Icon name="lucide:pencil" />
                      </button>
                      <button 
                        type="button" 
                        @click="deleteStrength(strength.id)" 
                        class="inline-flex items-center justify-center p-1.5 text-xs text-slate-500 hover:text-rose-600 bg-white rounded-lg border border-slate-200 transition-colors shadow-sm cursor-pointer"
                        title="Delete Strength"
                      >
                        <Icon name="lucide:trash-2" />
                      </button>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div 
                    v-if="strengthsList.length === 0" 
                    class="col-span-1 sm:col-span-2 py-16 text-center border border-dashed border-slate-350 rounded-3xl text-slate-400 font-bold uppercase tracking-wider text-xs bg-slate-50/50"
                  >
                    No strengths found. Use the form to add one.
                  </div>
                </div>
              </div>

              <!-- Right Column: Add/Edit Form Card -->
              <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 h-fit space-y-6 shadow-sm">
                <div>
                  <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                    {{ strengthForm.id ? 'Edit Strength Details' : 'Add New Strength' }}
                  </h4>
                  <p class="text-[10px] text-slate-400 font-semibold mt-1">
                    {{ strengthForm.id ? 'Modify strength details below and submit to save.' : 'Enter strength details and select an icon.' }}
                  </p>
                </div>

                <div class="space-y-4">
                  <!-- Title Input -->
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strength Title</label>
                    <input 
                      type="text" 
                      v-model="strengthForm.title"
                      placeholder="e.g. Expert Technical Team"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-xs transition-colors"
                    />
                  </div>

                  <!-- Content Input -->
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Description</label>
                    <textarea 
                      v-model="strengthForm.content"
                      rows="3"
                      placeholder="Brief description of the strength..."
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-xs transition-colors leading-relaxed"
                    ></textarea>
                  </div>

                  <!-- Icon Picker Input -->
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strength Icon</label>
                    
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#feb900]">
                        <Icon :name="strengthForm.icon || 'lucide:activity'" class="text-base" />
                      </div>
                      <input 
                        type="text" 
                        v-model="strengthForm.icon" 
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-xs transition-colors"
                        placeholder="e.g. lucide:users" 
                      />
                    </div>
                    
                    <!-- Icon Grid mini -->
                    <div class="bg-white border border-slate-200 rounded-xl p-2 max-h-32 overflow-y-auto">
                      <div class="grid grid-cols-6 gap-1">
                        <button 
                          v-for="icon in popularIcons" 
                          :key="icon"
                          type="button"
                          @click="strengthForm.icon = 'lucide:' + icon"
                          class="p-1.5 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          :class="strengthForm.icon === 'lucide:' + icon ? 'bg-[#feb900] text-slate-900 shadow-sm' : 'text-slate-400 hover:bg-slate-50'"
                          :title="'lucide:' + icon"
                        >
                          <Icon :name="'lucide:' + icon" class="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Actions -->
                  <div class="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      @click="saveStrength"
                      :disabled="strengthSaving"
                      class="flex-1 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer text-center"
                    >
                      <span v-if="strengthSaving" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
                      {{ strengthForm.id ? 'Save Changes' : 'Add Strength' }}
                    </button>
                    <button 
                      v-if="strengthForm.id"
                      type="button" 
                      @click="resetStrengthForm"
                      class="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-4 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
`;
  content = content.replace('          </form>', templateHtml + '\n          </form>');
}

fs.writeFileSync('app/pages/admin/settings.vue', content, 'utf8');
console.log('Successfully injected Strengths UI into settings.vue');
