<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Home Page</h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Configure hero slideshow, at-a-glance stats, section content &amp; strengths</p>
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
          <Icon :name="tab.icon" class="mr-2 text-sm" /> {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content Panel -->
      <div class="p-8">
        <form @submit.prevent="saveSettings" class="space-y-8">

          <!-- TAB 1: HERO BANNER SLIDESHOW -->
          <div v-if="activeTab === 'hero'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Hero Carousel &amp; Background Slides</h3>

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
                  <div class="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center group">
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

          <!-- TAB 2: AT A GLANCE -->
          <div v-if="activeTab === 'glance'" class="space-y-6 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">At a Glance Section</h3>

            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Section Header Title</label>
                <input
                  type="text"
                  v-model="form.glance_title"
                  placeholder="At a Glance"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Section Description Content</label>
                <textarea
                  rows="5"
                  v-model="form.glance_description"
                  placeholder="Introduce your company..."
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors leading-relaxed"
                ></textarea>
              </div>

              <div class="space-y-2 col-span-1">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Glance Section Cover Image</label>
                <div class="flex items-center gap-4 mt-2">
                  <div v-if="form.glance_img" class="relative w-32 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img :src="form.glance_img.includes('/') ? form.glance_img : `/assets/img/${form.glance_img}`" class="w-full h-full object-cover" />
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
                        <input type="text" v-model="form.exp_year" placeholder="e.g. 15+" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Title / Label</label>
                        <input type="text" v-model="form.Exp_title" placeholder="e.g. Years of Experience" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <!-- Counter 2: Projects -->
                  <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <h5 class="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:card-checklist" class="text-[#feb900]" /> Counter 2 (Projects)</h5>
                    <div class="space-y-3">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Number / Value</label>
                        <input type="text" v-model="form.pro_nos" placeholder="e.g. 250+" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Title / Label</label>
                        <input type="text" v-model="form.pro_title" placeholder="e.g. Successful Projects" class="w-full px-4 py-2.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] bg-white text-slate-800 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- TAB 3: OTHER SECTIONS (headers, custom blocks, CTA) -->
          <div v-if="activeTab === 'custom'" class="space-y-10 max-w-3xl">

            <!-- Clients / Trusted By Section Header -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Clients Section Header</h3>
              <p class="text-xs text-slate-400">
                The header shown above the client logo strip on the home page. Manage the individual client logos themselves under <NuxtLink to="/admin/clients" class="text-amber-600 underline hover:text-amber-700">Clients</NuxtLink>.
              </p>
              <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                  <input type="text" v-model="form.title10" placeholder="Trusted By" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Short description <span class="text-slate-400 font-normal">(optional)</span></label>
                  <input type="text" v-model="form.tag10" placeholder="Leave empty to hide the tagline" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                </div>
              </div>
            </div>

            <!-- Consultation CTA -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Consultation Call-to-Action</h3>
              <p class="text-xs text-slate-400">The closing banner shown at the bottom of the home page, before the footer.</p>
              <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heading</label>
                  <input type="text" v-model="form.cta_title" placeholder="Ready to Build Bangladesh's Next Infrastructure Milestone?" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paragraph</label>
                  <textarea rows="3" v-model="form.cta_content" placeholder="Supporting paragraph text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                </div>
              </div>
            </div>

            <!-- Custom Content Blocks -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Custom Content Sections (7, 8, & 9)</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Define up to three additional content sections that will display dynamically on your home page with alternating image/text layouts.
                Section 9 is also reused as the intro teaser on the public <NuxtLink to="/career" target="_blank" class="text-amber-600 underline hover:text-amber-700">/career</NuxtLink> page.
              </p>

            <div class="space-y-8">
              <!-- Custom Section 7 -->
              <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h4 class="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2"><span class="bg-[#feb900] text-slate-900 px-2 py-0.5 rounded text-xs font-mono">Sec 7</span> Custom Section (Left Text / Right Image)</h4>

                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Title</label>
                    <input type="text" v-model="form.title7" placeholder="Leave empty to hide this section" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Content Body</label>
                    <textarea rows="3" v-model="form.content7" placeholder="Section body text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <div v-if="form.image7" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img :src="form.image7.includes('/') ? form.image7 : `/assets/img/${form.image7}`" class="w-full h-full object-cover" />
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
                    <input type="text" v-model="form.title8" placeholder="Leave empty to hide this section" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Content Body</label>
                    <textarea rows="3" v-model="form.content8" placeholder="Section body text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <div v-if="form.image8" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img :src="form.image8.includes('/') ? form.image8 : `/assets/img/${form.image8}`" class="w-full h-full object-cover" />
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
                    <input type="text" v-model="form.title9" placeholder="Leave empty to hide this section" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Content Body</label>
                    <textarea rows="3" v-model="form.content9" placeholder="Section body text..." class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Image</label>
                    <div class="flex items-center gap-4 mt-1">
                      <div v-if="form.image9" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img :src="form.image9.includes('/') ? form.image9 : `/assets/img/${form.image9}`" class="w-full h-full object-cover" />
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
          </div>

          <!-- TAB 4: OUR STRENGTHS -->
          <div v-if="activeTab === 'strengths'" class="space-y-6">
            <!-- Header row -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:zap" class="text-[#feb900] text-xl" />
                  <h3 class="text-lg font-extrabold text-slate-800 tracking-tight">Our Strengths</h3>
                </div>
                <p class="text-xs text-slate-400 mt-1">
                  Manage the strength/advantage items displayed on the homepage. Each entry has a title, icon, and optional description.
                </p>
              </div>
              <button
                type="button"
                @click="openStrengthModal()"
                class="inline-flex items-center gap-2 bg-[#feb900] hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Icon name="lucide:plus-circle" class="text-base" />
                Add Strength
              </button>
            </div>

            <!-- Section Header & Cover Image -->
            <div class="p-6 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
              <h4 class="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2"><Icon name="lucide:lightning-charge" class="text-amber-500" /> Section Header</h4>
              <div class="grid grid-cols-1 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                  <input type="text" v-model="form.title4" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Short description</label>
                  <input type="text" v-model="form.tag4" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section Cover Image</label>
                  <div class="flex items-center gap-4 mt-1">
                    <div v-if="form.strengths_image" class="relative w-24 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                      <img :src="form.strengths_image.includes('/') ? form.strengths_image : `/assets/img/${form.strengths_image}`" class="w-full h-full object-cover" />
                      <button @click.prevent="removeField('strengths_image')" class="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 leading-none shadow transition-all">
                        <Icon name="lucide:x" class="text-xs" />
                      </button>
                    </div>
                    <label class="flex-1 max-w-xs flex flex-col items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border border-slate-300 border-dashed hover:border-[#feb900] cursor-pointer transition-all">
                      <span v-if="uploading.strengths_image" class="animate-spin rounded-full h-4 w-4 border-2 border-[#feb900] border-t-transparent"></span>
                      <span v-else class="text-xs font-semibold uppercase tracking-wide"><Icon name="lucide:upload" /> Upload Image</span>
                      <input type="file" @change="onFileUpload($event, 'strengths_image')" class="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingStrengths" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#feb900]"></div>
            </div>

            <!-- Empty state -->
            <div v-else-if="strengthsList.length === 0" class="text-center py-16 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200">
              <div class="w-14 h-14 rounded-2xl bg-amber-50 text-[#feb900] flex items-center justify-center text-3xl mx-auto mb-3">
                <Icon name="lucide:zap" />
              </div>
              <p class="text-sm font-extrabold text-slate-700">No Strengths Added</p>
              <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Click "Add Strength" above to create your first strength item.</p>
            </div>

            <!-- Cards grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div
                v-for="item in strengthsList"
                :key="item.id"
                class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3 hover:shadow-md transition-all group"
              >
                <!-- Icon & Title -->
                <div class="flex items-start gap-3">
                  <div class="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl text-[#feb900] flex-shrink-0">
                    <Icon :name="item.icon || 'lucide:zap'" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-extrabold text-slate-800 leading-snug truncate">{{ item.title }}</h4>
                    <p class="text-[11px] font-mono text-slate-400 mt-0.5">{{ item.icon || 'lucide:zap' }}</p>
                  </div>
                </div>

                <!-- Description -->
                <p v-if="item.content" class="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {{ item.content }}
                </p>
                <p v-else class="text-xs text-slate-300 italic">No description</p>

                <!-- Actions -->
                <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    @click="openStrengthModal(item)"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-[#feb900] hover:bg-amber-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Icon name="lucide:pencil" class="text-xs" />
                    Edit
                  </button>
                  <button
                    type="button"
                    @click="deleteStrength(item.id)"
                    :disabled="deletingStrengthId === item.id"
                    class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span v-if="deletingStrengthId === item.id" class="animate-spin rounded-full h-3 w-3 border-2 border-rose-500 border-t-transparent"></span>
                    <Icon v-else name="lucide:trash-2" class="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════ STRENGTH MODAL ═══════════════════════════ -->
  <div
    v-if="showStrengthModal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
  >
    <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 text-[#feb900] flex items-center justify-center text-xl flex-shrink-0">
            <Icon name="lucide:zap" />
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-slate-800">{{ strengthForm.id ? 'Edit Strength' : 'Add New Strength' }}</h3>
            <p class="text-xs text-slate-400">Strength items are displayed on the frontend homepage</p>
          </div>
        </div>
        <button @click="showStrengthModal = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer">
          <Icon name="lucide:x" class="text-lg" />
        </button>
      </div>

      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Strength Title <span class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            v-model.trim="strengthForm.title"
            placeholder="e.g. 15+ Years of Experience"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#feb900] transition-colors"
          />
        </div>

        <!-- Icon -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Icon <span class="text-slate-400 font-normal">(Lucide icon name)</span></label>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-[#feb900] text-xl flex-shrink-0">
              <Icon :name="strengthForm.icon || 'lucide:zap'" />
            </div>
            <input
              type="text"
              v-model.trim="strengthForm.icon"
              placeholder="lucide:zap"
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 font-mono focus:outline-none focus:border-[#feb900] transition-colors"
            />
          </div>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <button
              v-for="ic in commonIcons"
              :key="ic"
              type="button"
              @click="strengthForm.icon = ic"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer"
              :class="strengthForm.icon === ic ? 'border-[#feb900] bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
              :title="ic"
            >
              <Icon :name="ic" class="text-sm" />
              {{ ic.replace('lucide:', '') }}
            </button>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Description <span class="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            v-model.trim="strengthForm.content"
            rows="3"
            placeholder="Brief description of this strength..."
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 resize-none focus:outline-none focus:border-[#feb900] transition-colors"
          ></textarea>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          @click="showStrengthModal = false"
          class="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveStrength"
          :disabled="savingStrength || !strengthForm.title"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
        >
          <span v-if="savingStrength" class="animate-spin rounded-full h-3 w-3 border-2 border-slate-950 border-t-transparent"></span>
          <Icon v-else name="lucide:check" class="text-sm" />
          {{ savingStrength ? 'Saving...' : (strengthForm.id ? 'Update Strength' : 'Add Strength') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Home Page'
})

const activeTab = ref('hero')
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const tabs = [
  { id: 'hero', name: 'Hero Slideshow', icon: 'lucide:image' },
  { id: 'glance', name: 'At a Glance', icon: 'lucide:eye' },
  { id: 'custom', name: 'Custom Blocks & CTA', icon: 'lucide:layout-template' },
  { id: 'strengths', name: 'Our Strengths', icon: 'lucide:lightning-charge' }
]

const form = reactive({
  hero_images: [],
  glance_title: '',
  glance_description: '',
  glance_img: '',
  Exp_title: '',
  exp_year: '',
  pro_title: '',
  pro_nos: '',
  title4: '', tag4: '', strengths_image: '',
  title10: '', tag10: '',
  title7: '', content7: '', image7: '',
  title8: '', content8: '', image8: '',
  title9: '', content9: '', image9: '',
  cta_title: '', cta_content: ''
})

const uploading = reactive({
  glance_img: false,
  strengths_image: false,
  image7: false,
  image8: false,
  image9: false,
  slide: false
})

// Slides list reactive storage
const slides = ref([])

// Fetch current configuration
const { data: homeRes, pending, refresh } = await useFetch('/api/admin/home')

const loadSettings = () => {
  if (homeRes.value && homeRes.value.success && homeRes.value.content) {
    Object.assign(form, homeRes.value.content)
    if (Array.isArray(form.hero_images)) {
      slides.value = [...form.hero_images]
    } else {
      slides.value = []
    }
  }
}

onMounted(() => {
  loadSettings()
})

watch(homeRes, () => {
  loadSettings()
})

const removeField = (fieldName) => {
  form[fieldName] = ''
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

    form[fieldName] = data.filename
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
  form.hero_images = [...slides.value]

  try {
    const res = await useNuxtApp().$fetch('/api/admin/home', {
      method: 'POST',
      body: { ...form }
    })

    if (res.success) {
      successMsg.value = 'Home page content saved successfully.'
      refresh()
      setTimeout(() => {
        successMsg.value = ''
      }, 3000)
    } else {
      errorMsg.value = res.message || 'Failed to save home page content.'
    }
  } catch (err) {
    console.error(err)
    const serverMessage = err.data?.message || err.data?.statusMessage || err.statusMessage;
    errorMsg.value = serverMessage ? `Error: ${serverMessage}` : 'An unexpected error occurred while saving.'
  } finally {
    saving.value = false
  }
}

// ─── OUR STRENGTHS CRUD ───────────────────────────────────────────────────────
const strengthsList = ref([])
const loadingStrengths = ref(false)
const savingStrength = ref(false)
const deletingStrengthId = ref(null)
const showStrengthModal = ref(false)

const blankStrengthForm = () => ({ id: null, title: '', icon: 'lucide:zap', content: '' })
const strengthForm = reactive(blankStrengthForm())

const commonIcons = [
  'lucide:zap', 'lucide:star', 'lucide:shield-check', 'lucide:trophy', 'lucide:rocket',
  'lucide:award', 'lucide:target', 'lucide:lightbulb', 'lucide:handshake', 'lucide:users',
  'lucide:globe', 'lucide:chart-line', 'lucide:badge-check', 'lucide:clock', 'lucide:cpu'
]

const fetchStrengths = async () => {
  loadingStrengths.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/strengths')
    if (res?.success) strengthsList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch strengths:', err)
  } finally {
    loadingStrengths.value = false
  }
}

const openStrengthModal = (item = null) => {
  if (item) {
    Object.assign(strengthForm, { id: item.id, title: item.title, icon: item.icon || 'lucide:zap', content: item.content || '' })
  } else {
    Object.assign(strengthForm, blankStrengthForm())
  }
  showStrengthModal.value = true
}

const saveStrength = async () => {
  if (!strengthForm.title.trim()) return
  savingStrength.value = true
  try {
    const method = strengthForm.id ? 'PUT' : 'POST'
    const res = await useNuxtApp().$fetch('/api/admin/strengths', {
      method,
      body: { id: strengthForm.id, title: strengthForm.title, icon: strengthForm.icon, content: strengthForm.content }
    })
    if (res?.success) {
      showStrengthModal.value = false
      useToast().success(res.message || 'Strength saved successfully.')
      await fetchStrengths()
    }
  } catch (err) {
    useToast().error(err.data?.statusMessage || err.message || 'Failed to save strength.')
  } finally {
    savingStrength.value = false
  }
}

const deleteStrength = async (id) => {
  if (!confirm('Are you sure you want to delete this strength item?')) return
  deletingStrengthId.value = id
  try {
    const res = await useNuxtApp().$fetch(`/api/admin/strengths?id=${id}`, { method: 'DELETE' })
    if (res?.success) {
      useToast().success(res.message || 'Strength deleted.')
      await fetchStrengths()
    }
  } catch (err) {
    useToast().error(err.data?.statusMessage || err.message || 'Failed to delete strength.')
  } finally {
    deletingStrengthId.value = null
  }
}

// Fetch strengths when tab becomes active
watch(activeTab, (tab) => {
  if (tab === 'strengths') fetchStrengths()
})

onMounted(() => {
  if (activeTab.value === 'strengths') fetchStrengths()
})
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
