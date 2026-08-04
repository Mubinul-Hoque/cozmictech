<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Global Settings</h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Configure Site Identity, Hero section, Footer copy, Social Links, & Contact page details</p>
      </div>
      <div>
        <button 
          @click="saveSettings" 
          :disabled="saving"
          class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <span v-if="saving" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
          <Icon v-else name="lucide:check" class="text-sm" />
          {{ saving ? 'Saving...' : 'Save Settings' }}
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

    <!-- Main Content Tabs -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Tabs Navigation -->
      <div class="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto whitespace-nowrap scrollbar-thin">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 focus:outline-none cursor-pointer inline-flex items-center"
          :class="activeTab === tab.id ? 'border-[#feb900] text-slate-800 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          <i :class="[tab.icon, 'mr-2 text-sm']"></i> {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content Panel -->
      <div class="p-8">
        <form @submit.prevent="saveSettings" class="space-y-8">
          
          <!-- TAB 1: SITE IDENTITY -->
          <div v-if="activeTab === 'identity'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Site Branding & Meta Identity</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Company display Name</label>
                <input 
                  type="text" 
                  v-model="form.homepage.company_title" 
                  placeholder="e.g. Cozmic Technology" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Slogan / Subtitle Tagline</label>
                <input 
                  type="text" 
                  v-model="form.homepage.slogan" 
                  placeholder="e.g. Let's work together to make great things possible." 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <!-- Logo Upload Slot -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Website Logo Image</label>
                <div class="flex items-center gap-4 mt-2">
                  <div v-if="form.homepage.logo" class="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                    <img :src="`/assets/img/${form.homepage.logo}`" class="max-w-full max-h-full object-contain" />
                    <button @click.prevent="removeField('logo')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 leading-none shadow transition-all active:scale-90">
                      <Icon name="lucide:x" class="text-xs" />
                    </button>
                  </div>
                  <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] hover:text-[#feb900] cursor-pointer transition-all">
                    <span v-if="uploading.logo" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                    <span v-else class="text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Logo</span>
                    <input type="file" @change="onFileUpload($event, 'logo')" class="hidden" accept="image/*" />
                  </label>
                </div>
                <p class="text-[10px] text-slate-400 font-medium">Replaces the top navigation header brand text with this image when set.</p>
              </div>

              <!-- Favicon Upload Slot -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Browser Favicon Icon</label>
                <div class="flex items-center gap-4 mt-2">
                  <div v-if="form.homepage.favicon" class="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                    <img :src="`/assets/img/${form.homepage.favicon}`" class="max-w-full max-h-full object-contain" />
                    <button @click.prevent="removeField('favicon')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 leading-none shadow transition-all active:scale-90">
                      <Icon name="lucide:x" class="text-xs" />
                    </button>
                  </div>
                  <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] hover:text-[#feb900] cursor-pointer transition-all">
                    <span v-if="uploading.favicon" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                    <span v-else class="text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Favicon</span>
                    <input type="file" @change="onFileUpload($event, 'favicon')" class="hidden" accept="image/*" />
                  </label>
                </div>
                <p class="text-[10px] text-slate-400 font-medium">Updates browser tab favicon. Ideal formats: .ico, png, or .svg.</p>
              </div>
            </div>
          </div>

          <!-- TAB: THEME PRESETS -->
          <div v-if="activeTab === 'theme'" class="space-y-8 max-w-4xl">
            <div>
              <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Global Website Theme Presets</h3>
              <p class="text-xs text-slate-400 mt-1">Select one of our professionally curated global theme presets to completely change the color palette, fonts, buttons, forms, links, and overall visual style of the website with a single click.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Preset 1: Amber Construction -->
              <div 
                @click="form.homepage.theme = 'theme-default'"
                class="relative p-6 bg-white border rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                :class="form.homepage.theme === 'theme-default' ? 'border-[#feb900] ring-4 ring-[#feb900]/10 bg-amber-50/5' : 'border-slate-200'"
              >
                <!-- Selection Indicator -->
                <div class="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border" :class="form.homepage.theme === 'theme-default' ? 'bg-[#feb900] text-slate-900 border-[#feb900]' : 'bg-slate-50 text-slate-350 border-slate-200'">
                  <Icon :name="form.homepage.theme === 'theme-default' ? 'lucide:check' : 'lucide:circle'" />
                </div>

                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🚧</span>
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-700">Amber Construction</h4>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Default Theme</p>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">Classic industrial preset featuring warm amber yellow accents, slate gray bodies, and robust rounded buttons. Ideal for building and construction firms.</p>
                  
                  <!-- Color Swatches & Typo -->
                  <div class="flex gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#feb900] border border-black/10 inline-block" title="Primary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#52565e] border border-black/10 inline-block" title="Secondary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#364d59] border border-black/10 inline-block" title="Body Text"></span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 font-bold uppercase">
                  <span>Fonts: Roboto & Work Sans</span>
                </div>
              </div>

              <!-- Preset 2: Ocean Tech -->
              <div 
                @click="form.homepage.theme = 'theme-ocean'"
                class="relative p-6 bg-white border rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                :class="form.homepage.theme === 'theme-ocean' ? 'border-[#0284c7] ring-4 ring-[#0284c7]/10 bg-sky-50/5' : 'border-slate-200'"
              >
                <div class="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border" :class="form.homepage.theme === 'theme-ocean' ? 'bg-[#0284c7] text-white border-[#0284c7]' : 'bg-slate-50 text-slate-350 border-slate-200'">
                  <Icon :name="form.homepage.theme === 'theme-ocean' ? 'lucide:check' : 'lucide:circle'" />
                </div>

                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🌊</span>
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-700">Ocean Blue</h4>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Modern / Technology</p>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">Sleek tech look with a gorgeous sky-blue accent, dark slate tones, clean Inter fonts, and moderately rounded layout corners.</p>
                  
                  <div class="flex gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#0284c7] border border-black/10 inline-block" title="Primary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#475569] border border-black/10 inline-block" title="Secondary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#0f172a] border border-black/10 inline-block" title="Body Text"></span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 font-bold uppercase">
                  <span>Fonts: Inter & Outfit</span>
                </div>
              </div>

              <!-- Preset 3: Forest Emerald -->
              <div 
                @click="form.homepage.theme = 'theme-forest'"
                class="relative p-6 bg-white border rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                :class="form.homepage.theme === 'theme-forest' ? 'border-[#059669] ring-4 ring-[#059669]/10 bg-emerald-50/5' : 'border-slate-200'"
              >
                <div class="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border" :class="form.homepage.theme === 'theme-forest' ? 'bg-[#059669] text-white border-[#059669]' : 'bg-slate-50 text-slate-350 border-slate-200'">
                  <Icon :name="form.homepage.theme === 'theme-forest' ? 'lucide:check' : 'lucide:circle'" />
                </div>

                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🌱</span>
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-700">Forest Emerald</h4>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sustainable / Organic</p>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">Nature-focused aesthetic presenting clean emerald green accents, slate-grey bodies, and larger, soft curved corners for panels and buttons.</p>
                  
                  <div class="flex gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#059669] border border-black/10 inline-block" title="Primary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#4b5563] border border-black/10 inline-block" title="Secondary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#1f2937] border border-black/10 inline-block" title="Body Text"></span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 font-bold uppercase">
                  <span>Fonts: Fira Sans & Cabin</span>
                </div>
              </div>

              <!-- Preset 4: Crimson Steel -->
              <div 
                @click="form.homepage.theme = 'theme-crimson'"
                class="relative p-6 bg-white border rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                :class="form.homepage.theme === 'theme-crimson' ? 'border-[#dc2626] ring-4 ring-[#dc2626]/10 bg-red-50/5' : 'border-slate-200'"
              >
                <div class="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border" :class="form.homepage.theme === 'theme-crimson' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-slate-50 text-slate-350 border-slate-200'">
                  <Icon :name="form.homepage.theme === 'theme-crimson' ? 'lucide:check' : 'lucide:circle'" />
                </div>

                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🏭</span>
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-700">Crimson Steel</h4>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Heavy Industry / Engineering</p>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">Bold, raw industrial design showcasing stark crimson accents, solid slate backgrounds, sharp rectangular buttons, and uppercase Barlow fonts.</p>
                  
                  <div class="flex gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#dc2626] border border-black/10 inline-block" title="Primary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#475569] border border-black/10 inline-block" title="Secondary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#1e293b] border border-black/10 inline-block" title="Body Text"></span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 font-bold uppercase">
                  <span>Fonts: Barlow & Montserrat</span>
                </div>
              </div>

              <!-- Preset 5: Luxury Obsidian -->
              <div 
                @click="form.homepage.theme = 'theme-luxury'"
                class="relative p-6 bg-white border rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                :class="form.homepage.theme === 'theme-luxury' ? 'border-[#c5a880] ring-4 ring-[#c5a880]/10 bg-amber-50/5' : 'border-slate-200'"
              >
                <div class="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border" :class="form.homepage.theme === 'theme-luxury' ? 'bg-[#c5a880] text-slate-900 border-[#c5a880]' : 'bg-slate-50 text-slate-350 border-slate-200'">
                  <Icon :name="form.homepage.theme === 'theme-luxury' ? 'lucide:check' : 'lucide:circle'" />
                </div>

                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">✨</span>
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-700">Luxury Obsidian</h4>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Architecture</p>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">Elegant, high-end architectural layout using luxurious gold accents, charcoal gray, body obsidian blacks, serif Playfair headings, and minimal borders.</p>
                  
                  <div class="flex gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#c5a880] border border-black/10 inline-block" title="Primary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#5a5a5a] border border-black/10 inline-block" title="Secondary Color"></span>
                    <span class="w-6 h-6 rounded-full bg-[#1a1a1a] border border-black/10 inline-block" title="Body Text"></span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 font-bold uppercase">
                  <span>Fonts: Playfair Display & Cormorant</span>
                </div>
              </div>

            </div>
          </div>

          <!-- TAB 2: HERO BANNER SLIDESHOW -->
          <div v-if="activeTab === 'hero'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Hero Carousel & Background Slides</h3>
            
            <div class="space-y-6">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Background Slides</label>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6" @dragover.prevent>
                
                <!-- Existing Slides -->
                <div 
                  v-for="(slide, index) in slides" 
                  :key="'slide-' + index"
                  draggable="true"
                  @dragstart="onDragStart(index)"
                  @dragover.prevent
                  @drop="onDrop(index)"
                  class="space-y-2 cursor-move"
                >
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Slide {{ index + 1 }}</span>
                    <Icon name="lucide:grip-horizontal" class="text-slate-400 hover:text-slate-600 transition-colors" title="Drag to reorder" />
                  </span>
                  <div class="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center animate-fade-in-up group">
                    <img :src="slide.includes('/') ? slide : `/assets/img/${slide}`" class="w-full h-full object-cover" />
                    <button @click.prevent="removeSlide(index)" class="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 leading-none shadow transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100">
                      <Icon name="lucide:trash-2" class="text-xs" />
                    </button>
                  </div>
                </div>

                <!-- Add New Slide -->
                <div class="space-y-2 order-last">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add New Slide</span>
                  <div class="relative aspect-video rounded-2xl overflow-hidden border border-dashed border-slate-300 shadow-sm bg-slate-50 flex items-center justify-center">
                    <label class="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-amber-500/5 transition-all">
                      <span v-if="uploading.slide" class="animate-spin rounded-full h-5 w-5 border-2 border-[#feb900] border-t-transparent"></span>
                      <template v-else>
                        <Icon name="lucide:plus-circle" class="text-xl text-slate-400" />
                        <span class="text-[10px] font-bold text-slate-400 mt-1 uppercase">Upload Image</span>
                      </template>
                      <input type="file" @change="onSlideUpload" class="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- TAB 3: AT A GLANCE -->
          <div v-if="activeTab === 'glance'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">At a Glance Section</h3>
            
            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Section Header Title</label>
                <input 
                  type="text" 
                  v-model="form.homepage.glance_title" 
                  placeholder="At a Glance" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Section Description Content</label>
                <textarea 
                  rows="5"
                  v-model="form.homepage.glance_description" 
                  placeholder="Introduce your company..." 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors leading-relaxed"
                ></textarea>
              </div>

              <div class="space-y-2 col-span-1">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Glance Section Cover Image</label>
                <div class="flex items-center gap-4 mt-2">
                  <div v-if="form.homepage.glance_img" class="relative w-32 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img :src="form.homepage.glance_img.includes('/') ? form.homepage.glance_img : `/assets/img/${form.homepage.glance_img}`" class="w-full h-full object-cover" />
                    <button @click.prevent="removeField('glance_img')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 leading-none shadow transition-all active:scale-90">
                      <Icon name="lucide:trash-2" class="text-xs" />
                    </button>
                  </div>
                  <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-4 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] hover:text-[#feb900] cursor-pointer transition-all">
                    <span v-if="uploading.glance_img" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                    <span v-else class="text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Image</span>
                    <input type="file" @change="onFileUpload($event, 'glance_img')" class="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <!-- Counters section -->
              <div class="border-t border-slate-100 pt-6 space-y-4">
                <h4 class="text-sm font-bold text-slate-700">Homepage Counters (At a Glance Metrics)</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Counter 1: Experience -->
                  <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <h5 class="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:award" class="text-[#feb900]" /> Counter 1 (Experience)</h5>
                    <div class="space-y-3">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Number / Value</label>
                        <input type="text" v-model="form.homepage.exp_year" placeholder="e.g. 15+" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Title / Label</label>
                        <input type="text" v-model="form.homepage.Exp_title" placeholder="e.g. Years of Experience" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <!-- Counter 2: Projects -->
                  <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <h5 class="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:card-checklist" class="text-[#feb900]" /> Counter 2 (Projects)</h5>
                    <div class="space-y-3">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Number / Value</label>
                        <input type="text" v-model="form.homepage.pro_nos" placeholder="e.g. 250+" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Title / Label</label>
                        <input type="text" v-model="form.homepage.pro_title" placeholder="e.g. Successful Projects" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- TAB 4: PAGE SECTIONS HEADERS -->
          <div v-if="activeTab === 'sections'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Landing Page Section Headers</h3>
            
            <div class="space-y-6">
              <!-- Services Header -->
              <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                <h4 class="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:server" class="text-amber-500" /> Our Services Section</h4>
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <input type="text" v-model="form.homepage.title3" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Short description</label>
                    <input type="text" v-model="form.homepage.tag3" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                </div>
              </div>

              <!-- Strengths Header -->
              <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                <h4 class="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:lightning-charge" class="text-amber-500" /> Our Strengths Section</h4>
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <input type="text" v-model="form.homepage.title4" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Short description</label>
                    <input type="text" v-model="form.homepage.tag4" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                </div>
              </div>

              <!-- Testimonials Header -->
              <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                <h4 class="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:message-square-quote" class="text-amber-500" /> Testimonials Section</h4>
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <input type="text" v-model="form.homepage.title5" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Short description</label>
                    <input type="text" v-model="form.homepage.tag5" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                </div>
              </div>

              <!-- Blog Header -->
              <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                <h4 class="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:book-open-text" class="text-amber-500" /> News & Insights Section</h4>
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <input type="text" v-model="form.homepage.title6" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Short description</label>
                    <input type="text" v-model="form.homepage.tag6" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 5: CUSTOM CMS BLOCKS -->
          <div v-if="activeTab === 'custom'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Custom Content Sections (7, 8, & 9)</h3>
            <p class="text-xs text-slate-400 leading-relaxed">Define up to three additional content sections that will display dynamically on your home page with alternating image/text layouts.</p>
            
            <div class="space-y-8">
              <!-- Custom Section 7 -->
              <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2"><span class="bg-[#feb900] text-slate-900 px-2 py-0.5 rounded text-xs font-mono">Sec 7</span> Custom Section (Left Text / Right Image)</h4>
                
                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Title</label>
                    <input type="text" v-model="form.homepage.title7" placeholder="Leave empty to hide this section" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Content Body</label>
                    <textarea rows="3" v-model="form.homepage.content7" placeholder="Section body text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <div v-if="form.homepage.image7" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img :src="form.homepage.image7.includes('/') ? form.homepage.image7 : `/assets/img/${form.homepage.image7}`" class="w-full h-full object-cover" />
                        <button @click.prevent="removeField('image7')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 leading-none shadow transition-all">
                          <Icon name="lucide:x" class="text-xs" />
                        </button>
                      </div>
                      <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] cursor-pointer transition-all">
                        <span v-if="uploading.image7" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                        <span v-else class="text-xs font-semibold uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Image</span>
                        <input type="file" @change="onFileUpload($event, 'image7')" class="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Section 8 -->
              <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2"><span class="bg-[#feb900] text-slate-900 px-2 py-0.5 rounded text-xs font-mono">Sec 8</span> Custom Section (Right Text / Left Image)</h4>
                
                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Title</label>
                    <input type="text" v-model="form.homepage.title8" placeholder="Leave empty to hide this section" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Content Body</label>
                    <textarea rows="3" v-model="form.homepage.content8" placeholder="Section body text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <div v-if="form.homepage.image8" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img :src="form.homepage.image8.includes('/') ? form.homepage.image8 : `/assets/img/${form.homepage.image8}`" class="w-full h-full object-cover" />
                        <button @click.prevent="removeField('image8')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 leading-none shadow transition-all">
                          <Icon name="lucide:x" class="text-xs" />
                        </button>
                      </div>
                      <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] cursor-pointer transition-all">
                        <span v-if="uploading.image8" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                        <span v-else class="text-xs font-semibold uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Image</span>
                        <input type="file" @change="onFileUpload($event, 'image8')" class="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Section 9 -->
              <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2"><span class="bg-[#feb900] text-slate-900 px-2 py-0.5 rounded text-xs font-mono">Sec 9</span> Custom Section (Left Text / Right Image)</h4>
                
                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Title</label>
                    <input type="text" v-model="form.homepage.title9" placeholder="Leave empty to hide this section" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Content Body</label>
                    <textarea rows="3" v-model="form.homepage.content9" placeholder="Section body text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <div v-if="form.homepage.image9" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img :src="form.homepage.image9.includes('/') ? form.homepage.image9 : `/assets/img/${form.homepage.image9}`" class="w-full h-full object-cover" />
                        <button @click.prevent="removeField('image9')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 leading-none shadow transition-all">
                          <Icon name="lucide:x" class="text-xs" />
                        </button>
                      </div>
                      <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] cursor-pointer transition-all">
                        <span v-if="uploading.image9" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                        <span v-else class="text-xs font-semibold uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Image</span>
                        <input type="file" @change="onFileUpload($event, 'image9')" class="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 6: FOOTER & SOCIAL LINKS -->
          <div v-if="activeTab === 'footer'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Footer & Social Network URLs</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Facebook Page URL</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Icon name="lucide:facebook" /></span>
                  <input 
                    type="text" 
                    v-model="form.social.fb" 
                    placeholder="https://facebook.com/page" 
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Instagram URL</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Icon name="lucide:instagram" /></span>
                  <input 
                    type="text" 
                    v-model="form.social.insta" 
                    placeholder="https://instagram.com/profile" 
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn Company URL</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Icon name="lucide:linkedin" /></span>
                  <input 
                    type="text" 
                    v-model="form.social.linkedin" 
                    placeholder="https://linkedin.com/company/name" 
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Twitter URL</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Icon name="lucide:twitter" /></span>
                  <input 
                    type="text" 
                    v-model="form.social.twitter" 
                    placeholder="https://twitter.com/username" 
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 7: CONTACT INFORMATION -->
          <div v-if="activeTab === 'contact'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Contact Details & Map Embed Configuration</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2 md:col-span-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Company Registered Address</label>
                <textarea 
                  rows="3"
                  v-model="form.contact.address" 
                  placeholder="Company Address details..." 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Phone</label>
                <input 
                  type="text" 
                  v-model="form.contact.phone" 
                  placeholder="e.g. +88 01894932401" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Alternative Cell / Mobile</label>
                <input 
                  type="text" 
                  v-model="form.contact.cell" 
                  placeholder="e.g. +88 01894932401" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Contact Email</label>
                <input 
                  type="email" 
                  v-model="form.contact.email" 
                  placeholder="info@cozmictech.com" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Secondary Contact Email</label>
                <input 
                  type="email" 
                  v-model="form.contact.email2" 
                  placeholder="info@cozmictech.com" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Section Header Title</label>
                <input 
                  type="text" 
                  v-model="form.contact.sec_title" 
                  placeholder="e.g. Contact" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Company Display Name</label>
                <input 
                  type="text" 
                  v-model="form.contact.company_title" 
                  placeholder="e.g. Cozmic Technology" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Google Map Embed Link (src attribute)</label>
                <textarea 
                  rows="3"
                  v-model="form.contact.map" 
                  placeholder="https://www.google.com/maps/embed?pb=..." 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors font-mono"
                ></textarea>
                <p class="text-[10px] text-slate-400 font-medium">Extract the source URL from the Google Map iframe code (the `src` attribute) and paste it here.</p>
              </div>
            </div>
          </div>

          <!-- TAB 8: CLIENT LOGOS -->
          <div v-if="activeTab === 'clients'" class="space-y-6 animate-fade-in-up">
            <div class="border-b border-slate-100 pb-4">
              <h3 class="text-lg font-bold text-slate-700">Client Logos Directory</h3>
              <p class="text-xs text-slate-400 mt-1">Manage brand logos and client names that display in the client banner at the bottom of the home page.</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left Column: Clients List Grid -->
              <div class="lg:col-span-2 space-y-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div 
                    v-for="client in clientsList" 
                    :key="client.id"
                    class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 relative group hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300"
                  >
                    <!-- Client Logo Image -->
                    <div class="w-full aspect-[3/2] flex items-center justify-center bg-white rounded-xl border border-slate-100 p-3 overflow-hidden shadow-sm">
                      <img 
                        :src="client.logo ? `/assets/img/${client.logo}` : '/assets/img/favicon.png'" 
                        :alt="client.client_name" 
                        class="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                      />
                    </div>
                    
                    <!-- Client Name -->
                    <div class="text-center w-full px-1">
                      <span class="text-xs font-bold text-slate-700 block truncate" :title="client.client_name">{{ client.client_name }}</span>
                    </div>

                    <!-- Client Action Bar -->
                    <div class="flex gap-2 justify-center w-full border-t border-slate-200/60 pt-2.5 mt-1">
                      <button 
                        type="button" 
                        @click="editClient(client)" 
                        class="inline-flex items-center justify-center p-1.5 text-xs text-slate-500 hover:text-[#feb900] bg-white rounded-lg border border-slate-200 transition-colors shadow-sm cursor-pointer"
                        title="Edit Client"
                      >
                        <Icon name="lucide:pencil" />
                      </button>
                      <button 
                        type="button" 
                        @click="deleteClient(client.id)" 
                        class="inline-flex items-center justify-center p-1.5 text-xs text-slate-500 hover:text-rose-600 bg-white rounded-lg border border-slate-200 transition-colors shadow-sm cursor-pointer"
                        title="Delete Client"
                      >
                        <Icon name="lucide:trash-2" />
                      </button>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div 
                    v-if="clientsList.length === 0" 
                    class="col-span-2 sm:col-span-3 py-16 text-center border border-dashed border-slate-350 rounded-3xl text-slate-400 font-bold uppercase tracking-wider text-xs bg-slate-50/50"
                  >
                    No client logos found. Use the form to add one.
                  </div>
                </div>
              </div>

              <!-- Right Column: Add/Edit Form Card -->
              <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 h-fit space-y-6 shadow-sm">
                <div>
                  <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                    {{ clientForm.id ? 'Edit Client Details' : 'Add Client Brand' }}
                  </h4>
                  <p class="text-[10px] text-slate-400 font-semibold mt-1">
                    {{ clientForm.id ? 'Modify client details below and submit to save.' : 'Enter client details and upload a brand logo image.' }}
                  </p>
                </div>

                <div class="space-y-4">
                  <!-- Name Input -->
                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client / Partner Name</label>
                    <input 
                      type="text" 
                      v-model="clientForm.client_name"
                      placeholder="e.g. Google Cloud"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-xs transition-colors"
                    />
                  </div>

                  <!-- Logo Upload Slot -->
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand Logo Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <!-- Image preview -->
                      <div v-if="clientForm.logo" class="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center p-1 shadow-sm">
                        <img :src="`/assets/img/${clientForm.logo}`" class="max-w-full max-h-full object-contain" />
                        <button 
                          type="button" 
                          @click="clientForm.logo = ''" 
                          class="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 leading-none shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <Icon name="lucide:x" class="text-xs" />
                        </button>
                      </div>
                      <!-- Upload label button -->
                      <label class="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] hover:text-[#feb900] cursor-pointer transition-all">
                        <span v-if="clientUploading" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                        <span v-else class="text-[10px] font-bold flex items-center gap-2 uppercase tracking-wide">
                          <Icon name="lucide:upload" /> {{ clientForm.logo ? 'Change Image' : 'Upload Logo' }}
                        </span>
                        <input type="file" @change="onClientLogoUpload" class="hidden" accept="image/*" />
                      </label>
                    </div>
                    <p class="text-[9px] text-slate-400 font-semibold leading-relaxed">Required: transparent PNG or SVG logo looks best against the slate background.</p>
                  </div>

                  <!-- Submit Actions -->
                  <div class="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      @click="saveClient"
                      :disabled="clientSaving || clientUploading"
                      class="flex-1 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer text-center"
                    >
                      <span v-if="clientSaving" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent mr-1"></span>
                      {{ clientForm.id ? 'Save Changes' : 'Add Client' }}
                    </button>
                    <button 
                      v-if="clientForm.id"
                      type="button" 
                      @click="resetClientForm"
                      class="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-4 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Global Settings'
})

const activeTab = ref('identity')
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const tabs = [
  { id: 'identity', name: 'Site Identity', icon: 'bi bi-info-circle' },
  { id: 'theme', name: 'Theme Presets', icon: 'bi bi-palette' },
  { id: 'hero', name: 'Hero Slideshow', icon: 'bi bi-image' },
  { id: 'glance', name: 'At a Glance', icon: 'bi bi-eye' },
  { id: 'sections', name: 'Page Sections', icon: 'bi bi-layout-three-columns' },
  { id: 'custom', name: 'Custom Blocks', icon: 'bi bi-grid-3x3-gap' },
  { id: 'footer', name: 'Footer & Socials', icon: 'bi bi-share' },
  { id: 'contact', name: 'Contact Details', icon: 'bi bi-telephone' },
  { id: 'clients', name: 'Client Logos', icon: 'bi bi-briefcase' },
    { id: 'strengths', name: 'Our Strengths', icon: 'lucide:lightning-charge' }
]

const form = reactive({
  homepage: {
    company_title: '',
    slogan: '',
    hero_images: [],
    logo: '',
    favicon: '',
    theme: 'theme-default',
    glance_title: '',
    glance_description: '',
    glance_img: '',
    Exp_title: '',
    exp_year: '',
    pro_title: '',
    pro_nos: '',
    title1: '', tag1: '',
    title2: '', tag2: '',
    title3: '', tag3: '',
    title4: '', tag4: '',
    title5: '', tag5: '',
    title6: '', tag6: '',
    title7: '', content7: '', image7: '',
    title8: '', content8: '', image8: '',
    title9: '', content9: '', image9: ''
  },
  contact: {
    sec_title: '',
    company_title: '',
    address: '',
    phone: '',
    cell: '',
    email: '',
    email2: '',
    map: ''
  },
  social: {
    twitter: '',
    fb: '',
    insta: '',
    linkedin: ''
  }
})

const uploading = reactive({
  logo: false,
  favicon: false,
  glance_img: false,
  image7: false,
  image8: false,
  image9: false,
  slide: false
})

// Slides list reactive storage
const slides = ref([])

// Fetch current configurations
const { data: settingsRes, pending, refresh } = await useFetch('/api/admin/settings')

const loadSettings = () => {
  if (settingsRes.value && settingsRes.value.success) {
    if (settingsRes.value.homepage) {
      Object.assign(form.homepage, settingsRes.value.homepage)
      if (Array.isArray(form.homepage.hero_images)) {
        slides.value = [...form.homepage.hero_images]
      } else {
        slides.value = []
      }
    }
    if (settingsRes.value.contact) {
      Object.assign(form.contact, settingsRes.value.contact)
    }
    if (settingsRes.value.social) {
      Object.assign(form.social, settingsRes.value.social)
    }
  }
}

onMounted(() => {
  loadSettings()
})

watch(settingsRes, () => {
  loadSettings()
})

const removeField = (fieldName) => {
  form.homepage[fieldName] = ''
}

const removeSlide = (index) => {
  slides.value.splice(index, 1)
}

const draggedIndex = ref(null)

const onDragStart = (index) => {
  draggedIndex.value = index
}

const onDrop = (dropIndex) => {
  if (draggedIndex.value !== null && draggedIndex.value !== dropIndex) {
    const movedSlide = slides.value.splice(draggedIndex.value, 1)[0]
    slides.value.splice(dropIndex, 0, movedSlide)
  }
  draggedIndex.value = null
}

const onSlideUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'hero-carousel')

  uploading.slide = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })
    slides.value.push(data.url)
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to upload slide image. Ensure it is a valid image under 2MB.'
  } finally {
    uploading.slide = false
  }
}

const onFileUpload = async (event, fieldName) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  uploading[fieldName] = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const data = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })
    
    form.homepage[fieldName] = data.filename
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to upload image. Ensure it is a valid image under 2MB.'
  } finally {
    uploading[fieldName] = false
  }
}

const saveSettings = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  // Serialize slide images back to database column
  form.homepage.hero_images = [...slides.value]

  try {
    const res = await useNuxtApp().$fetch('/api/admin/settings', {
      method: 'POST',
      body: form
    })

    if (res.success) {
      successMsg.value = 'Configuration settings saved successfully. Refreshing site theme...'
      refresh()
      setTimeout(() => {
        successMsg.value = ''
      }, 3000)
    } else {
      errorMsg.value = res.message || 'Failed to save settings configurations.'
    }
  } catch (err) {
    console.error(err)
    const serverMessage = err.data?.message || err.data?.statusMessage || err.statusMessage;
    errorMsg.value = serverMessage ? `Error: ${serverMessage}` : 'An unexpected error occurred while saving the configuration settings.'
  } finally {
    saving.value = false
  }
}

// Client Logos CRUD State & Logic
const { data: clientsRes, refresh: refreshClients } = await useFetch('/api/admin/clients')
const clientsList = computed(() => clientsRes.value?.data || [])

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
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to upload logo image. Ensure it is a valid image under 5MB.'
  } finally {
    clientUploading.value = false
  }
}

const saveClient = async () => {
  if (!clientForm.client_name) {
    errorMsg.value = 'Client name is required.'
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

    if (res.success) {
      successMsg.value = res.message || 'Client saved successfully.'
      resetClientForm()
      refreshClients()
      setTimeout(() => successMsg.value = '', 4000)
    } else {
      errorMsg.value = res.message || 'Failed to save client.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = err.data?.message || err.message || 'An error occurred while saving client.'
  } finally {
    clientSaving.value = false
  }
}

const editClient = (client) => {
  clientForm.id = client.id
  clientForm.client_name = client.client_name
  clientForm.logo = client.logo || ''
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

    if (res.success) {
      successMsg.value = res.message || 'Client deleted successfully.'
      refreshClients()
      setTimeout(() => successMsg.value = '', 4000)
    } else {
      errorMsg.value = res.message || 'Failed to delete client.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = err.data?.message || err.message || 'An error occurred while deleting client.'
  }
}
</script>

<style scoped>
/* custom thin scrollbar for tabs navigation */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
