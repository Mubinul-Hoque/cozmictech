<template>
  <div class="space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Icon name="lucide:type" class="text-[#feb900]" />
          <span>Website Typography Management</span>
        </h3>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          Control global font families, heading scales, responsive sizes, line heights, and UI typography across the entire site
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          type="button" 
          @click="showResetModal = true"
          :disabled="saving || resetting"
          class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wider uppercase text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Icon name="lucide:rotate-ccw" class="text-sm" />
          Reset to Defaults
        </button>

        <button 
          type="button" 
          @click="saveTypography" 
          :disabled="saving || resetting"
          class="inline-flex items-center justify-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <span v-if="saving" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent mr-1"></span>
          <Icon v-else name="lucide:check" class="text-base" />
          {{ saving ? 'Saving Changes...' : 'Save Typography' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-24">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#feb900] animate-spin"></div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Settings Configuration Tabs & Controls (7 Cols) -->
      <div class="xl:col-span-7 space-y-6">
        <!-- Tabs Navigation -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-1.5 flex flex-wrap gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
            :class="activeTab === tab.id ? 'bg-[#364d59] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <Icon :name="tab.icon" class="text-sm" :class="activeTab === tab.id ? 'text-[#feb900]' : 'text-slate-400'" />
            {{ tab.label }}
          </button>
        </div>

        <!-- TAB 1: Global Fonts & Body -->
        <div v-show="activeTab === 'global'" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h3 class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Icon name="lucide:globe" class="text-[#feb900] text-xl" />
              Global Font Families
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Select standard Google Fonts or system stacks for body text, headings, and decorative display text.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Body Font Family -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Body Font Family
              </label>
              <select 
                v-model="form.body.fontFamily"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]"
              >
                <option v-for="font in availableFonts" :key="font.name" :value="font.name">
                  {{ font.name }} ({{ font.category }})
                </option>
              </select>
              <p class="text-[11px] text-slate-400">Used for body copy, paragraphs, and standard UI.</p>
            </div>

            <!-- Headings Font Family -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Headings Font Family
              </label>
              <select 
                v-model="form.headings.fontFamily"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]"
              >
                <option v-for="font in availableFonts" :key="font.name" :value="font.name">
                  {{ font.name }} ({{ font.category }})
                </option>
              </select>
              <p class="text-[11px] text-slate-400">Default family for H1–H6 and section titles.</p>
            </div>

            <!-- Display / Hero Font Family -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Display & Hero Font
              </label>
              <select 
                v-model="form.display.fontFamily"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]"
              >
                <option v-for="font in availableFonts" :key="font.name" :value="font.name">
                  {{ font.name }} ({{ font.category }})
                </option>
              </select>
              <p class="text-[11px] text-slate-400">Used for editorial statements & big hero text.</p>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="lucide:align-left" class="text-amber-500" />
              Body Text Specifications
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <!-- Body Font Size -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Size</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="form.body.fontSize" 
                    placeholder="15px"
                    class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                  />
                  <span class="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">px/rem</span>
                </div>
              </div>

              <!-- Body Font Weight -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Weight</label>
                <select 
                  v-model="form.body.fontWeight"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="300">300 (Light)</option>
                  <option value="400">400 (Regular)</option>
                  <option value="500">500 (Medium)</option>
                  <option value="600">600 (Semi-Bold)</option>
                  <option value="700">700 (Bold)</option>
                </select>
              </div>

              <!-- Body Font Style -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Style</label>
                <select 
                  v-model="form.body.fontStyle"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              <!-- Body Line Height -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Line Height</label>
                <input 
                  type="text" 
                  v-model="form.body.lineHeight" 
                  placeholder="1.65"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <!-- Body Letter Spacing -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Letter Spacing</label>
                <input 
                  type="text" 
                  v-model="form.body.letterSpacing" 
                  placeholder="-0.01em"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <!-- Body Text Color -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Text Color</label>
                <div class="flex items-center gap-2">
                  <input 
                    type="color" 
                    v-model="form.body.color"
                    class="w-9 h-9 p-0.5 rounded-lg border border-slate-300 cursor-pointer bg-transparent"
                  />
                  <input 
                    type="text" 
                    v-model="form.body.color" 
                    placeholder="#364d59"
                    class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#feb900]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: Heading Styles (H1 to H6) -->
        <div v-show="activeTab === 'headings'" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h3 class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Icon name="lucide:heading" class="text-[#feb900] text-xl" />
              Heading Scales (H1 – H6)
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Configure responsive desktop and mobile font sizes, weights, and line heights for all heading levels.
            </p>
          </div>

          <!-- Base Headings Shared Defaults -->
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="lucide:sliders" class="text-amber-500" />
              Shared Headings Base Settings
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Base Weight</label>
                <select 
                  v-model="form.headings.fontWeight"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="400">400 (Regular)</option>
                  <option value="500">500 (Medium)</option>
                  <option value="600">600 (Semi-Bold)</option>
                  <option value="700">700 (Bold)</option>
                  <option value="800">800 (Extra-Bold)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Base Line Height</label>
                <input 
                  type="text" 
                  v-model="form.headings.lineHeight" 
                  placeholder="1.2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Headings Color</label>
                <div class="flex items-center gap-2">
                  <input 
                    type="color" 
                    v-model="form.headings.color"
                    class="w-8 h-8 p-0.5 rounded-lg border border-slate-300 cursor-pointer bg-transparent"
                  />
                  <input 
                    type="text" 
                    v-model="form.headings.color" 
                    placeholder="#1a1a1a"
                    class="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:outline-none focus:border-[#feb900]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Individual Headings (H1 to H6) Cards -->
          <div class="space-y-4">
            <div 
              v-for="h in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']" 
              :key="h"
              class="border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-colors"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs uppercase">
                    {{ h }}
                  </span>
                  <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Heading Level {{ h.replace('h', '') }}
                  </span>
                </div>
                <!-- Inline Tag Preview -->
                <div class="text-xs text-slate-400 font-mono">
                  Desktop: <strong class="text-slate-700">{{ form[h]?.fontSize }}</strong> | Mobile: <strong class="text-slate-700">{{ form[h]?.fontSizeMobile }}</strong>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <!-- Desktop Size -->
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desktop Size</label>
                  <input 
                    type="text" 
                    v-model="form[h].fontSize" 
                    placeholder="36px"
                    class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#feb900]"
                  />
                </div>

                <!-- Mobile Size -->
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Size</label>
                  <input 
                    type="text" 
                    v-model="form[h].fontSizeMobile" 
                    placeholder="24px"
                    class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#feb900]"
                  />
                </div>

                <!-- Weight -->
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weight</label>
                  <select 
                    v-model="form[h].fontWeight"
                    class="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#feb900]"
                  >
                    <option value="400">400 (Regular)</option>
                    <option value="500">500 (Medium)</option>
                    <option value="600">600 (Semi-Bold)</option>
                    <option value="700">700 (Bold)</option>
                  </select>
                </div>

                <!-- Line Height -->
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Line Height</label>
                  <input 
                    type="text" 
                    v-model="form[h].lineHeight" 
                    placeholder="1.2"
                    class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#feb900]"
                  />
                </div>

                <!-- Letter Spacing -->
                <div class="space-y-1 col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Spacing</label>
                  <input 
                    type="text" 
                    v-model="form[h].letterSpacing" 
                    placeholder="-0.02em"
                    class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#feb900]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Navigation & Buttons -->
        <div v-show="activeTab === 'ui'" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h3 class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Icon name="lucide:layout-template" class="text-[#feb900] text-xl" />
              Navigation &amp; Button Typography
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Control the font style, letter spacing, and capitalization for header navigation links and interactive call-to-action buttons.
            </p>
          </div>

          <!-- Navigation / Menu Text -->
          <div class="border border-slate-200 rounded-2xl p-6 space-y-5">
            <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Icon name="lucide:compass" class="text-amber-500 text-lg" />
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Navigation / Menu Text</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Family</label>
                <select 
                  v-model="form.navigation.fontFamily"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option v-for="font in availableFonts" :key="font.name" :value="font.name">
                    {{ font.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Size</label>
                <input 
                  type="text" 
                  v-model="form.navigation.fontSize" 
                  placeholder="14px"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Weight</label>
                <select 
                  v-model="form.navigation.fontWeight"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="400">400 (Regular)</option>
                  <option value="500">500 (Medium)</option>
                  <option value="600">600 (Semi-Bold)</option>
                  <option value="700">700 (Bold)</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Letter Spacing</label>
                <input 
                  type="text" 
                  v-model="form.navigation.letterSpacing" 
                  placeholder="0.02em"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Text Transform</label>
                <select 
                  v-model="form.navigation.textTransform"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="none">None (As typed)</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="capitalize">Capitalize</option>
                  <option value="lowercase">lowercase</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Button Text -->
          <div class="border border-slate-200 rounded-2xl p-6 space-y-5">
            <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Icon name="lucide:mouse-pointer-click" class="text-amber-500 text-lg" />
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Button Text</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Family</label>
                <select 
                  v-model="form.button.fontFamily"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option v-for="font in availableFonts" :key="font.name" :value="font.name">
                    {{ font.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Size</label>
                <input 
                  type="text" 
                  v-model="form.button.fontSize" 
                  placeholder="12px"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Weight</label>
                <select 
                  v-model="form.button.fontWeight"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="500">500 (Medium)</option>
                  <option value="600">600 (Semi-Bold)</option>
                  <option value="700">700 (Bold)</option>
                  <option value="800">800 (Extra Bold)</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Letter Spacing</label>
                <input 
                  type="text" 
                  v-model="form.button.letterSpacing" 
                  placeholder="0.05em"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Text Transform</label>
                <select 
                  v-model="form.button.textTransform"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="uppercase">UPPERCASE</option>
                  <option value="none">None (As typed)</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: Project Titles & Editorial Display -->
        <div v-show="activeTab === 'projects'" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h3 class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Icon name="lucide:briefcase" class="text-[#feb900] text-xl" />
              Project Titles &amp; Display Typography
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Control the styling of project titles on the Project Details page and hero portfolio presentations.
            </p>
          </div>

          <div class="border border-slate-200 rounded-2xl p-6 space-y-6">
            <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Icon name="lucide:sparkles" class="text-amber-500 text-lg" />
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Project Title Typography</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <!-- Font Family -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Family</label>
                <select 
                  v-model="form.projectTitle.fontFamily"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option v-for="font in availableFonts" :key="font.name" :value="font.name">
                    {{ font.name }} ({{ font.category }})
                  </option>
                </select>
              </div>

              <!-- Desktop Size -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Desktop Size</label>
                <input 
                  type="text" 
                  v-model="form.projectTitle.fontSize" 
                  placeholder="48px"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <!-- Mobile Size -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Mobile Size</label>
                <input 
                  type="text" 
                  v-model="form.projectTitle.fontSizeMobile" 
                  placeholder="32px"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <!-- Font Weight -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Weight</label>
                <select 
                  v-model="form.projectTitle.fontWeight"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="300">300 (Light)</option>
                  <option value="400">400 (Regular)</option>
                  <option value="500">500 (Medium)</option>
                  <option value="600">600 (Semi-Bold)</option>
                  <option value="700">700 (Bold)</option>
                </select>
              </div>

              <!-- Font Style -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Font Style</label>
                <select 
                  v-model="form.projectTitle.fontStyle"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#feb900]"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              <!-- Line Height -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Line Height</label>
                <input 
                  type="text" 
                  v-model="form.projectTitle.lineHeight" 
                  placeholder="1.15"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <!-- Letter Spacing -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Letter Spacing</label>
                <input 
                  type="text" 
                  v-model="form.projectTitle.letterSpacing" 
                  placeholder="-0.025em"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#feb900]"
                />
              </div>

              <!-- Color -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Title Color</label>
                <div class="flex items-center gap-2">
                  <input 
                    type="color" 
                    v-model="form.projectTitle.color"
                    class="w-9 h-9 p-0.5 rounded-lg border border-slate-300 cursor-pointer bg-transparent"
                  />
                  <input 
                    type="text" 
                    v-model="form.projectTitle.color" 
                    placeholder="#090402"
                    class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#feb900]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Live Preview (5 Cols, Sticky) -->
      <div class="xl:col-span-5 sticky top-6 space-y-4">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Preview Header & Device Selector -->
          <div class="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-extrabold uppercase tracking-wider text-slate-200">Interactive Live Preview</span>
            </div>

            <!-- Device Selector Toggle -->
            <div class="flex items-center bg-slate-800 rounded-full p-1 border border-slate-700">
              <button 
                type="button" 
                @click="previewDevice = 'desktop'"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
                :class="previewDevice === 'desktop' ? 'bg-[#feb900] text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
              >
                <Icon name="lucide:monitor" class="text-xs" />
                Desktop
              </button>
              <button 
                type="button" 
                @click="previewDevice = 'mobile'"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
                :class="previewDevice === 'mobile' ? 'bg-[#feb900] text-slate-950 shadow' : 'text-slate-400 hover:text-white'"
              >
                <Icon name="lucide:smartphone" class="text-xs" />
                Mobile
              </button>
            </div>
          </div>

          <!-- Preview Frame Wrapper -->
          <div class="p-4 sm:p-6 bg-slate-100 flex justify-center min-h-[500px]">
            <div 
              class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300"
              :class="previewDevice === 'mobile' ? 'max-w-[360px] border-4 border-slate-800 rounded-3xl' : 'max-w-full'"
            >
              <!-- Simulated Header Navigation -->
              <div class="px-4 py-3 border-b border-slate-100 bg-[#364d59] text-white flex items-center justify-between">
                <div class="font-bold text-sm tracking-tight flex items-center gap-1">
                  <span>Cozmic</span><span class="text-[#feb900]">.</span>
                </div>
                <div class="flex items-center gap-3">
                  <span 
                    v-for="item in ['Home', 'About', 'Projects', 'Contact']" 
                    :key="item"
                    class="transition-colors hover:text-[#feb900] cursor-pointer"
                    :style="previewNavStyle"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <!-- Simulated Project Details Page Hero -->
              <div class="p-5 sm:p-6 space-y-6">
                <!-- Project Title Preview -->
                <div class="border-b border-slate-100 pb-4">
                  <span class="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                    Industrial &amp; RMG Facility
                  </span>
                  <h1 :style="previewProjectTitleStyle">
                    Gildan Knitwear Manufacturing Plant
                  </h1>
                  <p class="text-xs text-slate-400 mt-1">Gazipur, Bangladesh &bull; Completed 2024</p>
                </div>

                <!-- Headings Hierarchy Preview -->
                <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Headings Hierarchy
                  </span>
                  <div class="space-y-2">
                    <div :style="getHeadingPreviewStyle('h1')">H1: Engineering Excellence</div>
                    <div :style="getHeadingPreviewStyle('h2')">H2: Architectural Structural Rigour</div>
                    <div :style="getHeadingPreviewStyle('h3')">H3: Sustainable Infrastructure &amp; MEP</div>
                    <div :style="getHeadingPreviewStyle('h4')">H4: Comprehensive Project Timeline</div>
                    <div :style="getHeadingPreviewStyle('h5')">H5: Specification Requirements</div>
                    <div :style="getHeadingPreviewStyle('h6')">H6: Safety &amp; Environmental Compliance</div>
                  </div>
                </div>

                <!-- Body Paragraph Preview -->
                <div class="space-y-2">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Body Copy &amp; Paragraphs
                  </span>
                  <p :style="previewBodyStyle">
                    Since 2009, REINCARNATION has shaped spaces across Bangladesh — from large-scale industrial and RMG facilities to corporate interiors, hospitality, mixed-use landmarks and private residences. Each project pairs architectural rigour with a careful eye for how people actually use a space.
                  </p>
                </div>

                <!-- Interactive Buttons Preview -->
                <div class="space-y-2 pt-2 border-t border-slate-100">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Button Styles
                  </span>
                  <div class="flex flex-wrap gap-2.5">
                    <button 
                      type="button" 
                      class="px-4 py-2 rounded-full bg-[#feb900] text-slate-950 font-bold transition-all hover:bg-amber-500 shadow-sm"
                      :style="previewButtonStyle"
                    >
                      Explore Projects
                    </button>
                    <button 
                      type="button" 
                      class="px-4 py-2 rounded-full bg-[#364d59] text-white font-bold transition-all hover:bg-slate-700 shadow-sm"
                      :style="previewButtonStyle"
                    >
                      Contact Us
                    </button>
                    <button 
                      type="button" 
                      class="px-4 py-2 rounded-full border border-slate-300 text-slate-700 font-bold transition-all hover:bg-slate-100"
                      :style="previewButtonStyle"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset to Defaults Confirmation Modal -->
    <div 
      v-if="showResetModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold">
            <Icon name="lucide:alert-triangle" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800">Reset Typography to Defaults?</h3>
            <p class="text-xs text-slate-400">Restore default design presets</p>
          </div>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed">
          This will restore standard typography settings across the entire website, including font families (<strong>DM Sans</strong> &amp; <strong>Cormorant Garamond</strong>), standard heading sizes, line heights, and button styles.
        </p>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button" 
            @click="showResetModal = false"
            :disabled="resetting"
            class="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="resetToDefaults"
            :disabled="resetting"
            class="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow transition-all cursor-pointer"
          >
            <span v-if="resetting" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></span>
            <Icon v-else name="lucide:rotate-ccw" class="text-sm" />
            {{ resetting ? 'Resetting...' : 'Yes, Reset Defaults' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const toast = useToast()
const saving = ref(false)
const resetting = ref(false)
const showResetModal = ref(false)
const activeTab = ref('global')
const previewDevice = ref('desktop')

const tabs = [
  { id: 'global', label: 'Global & Body', icon: 'lucide:globe' },
  { id: 'headings', label: 'Headings (H1–H6)', icon: 'lucide:heading' },
  { id: 'ui', label: 'Navigation & Buttons', icon: 'lucide:layout-template' },
  { id: 'projects', label: 'Project Titles & Display', icon: 'lucide:briefcase' }
]

const availableFonts = ref([
  { name: 'DM Sans', category: 'Sans-Serif', google: 'DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400' },
  { name: 'Cormorant Garamond', category: 'Serif', google: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400' },
  { name: 'Inter', category: 'Sans-Serif', google: 'Inter:wght@300;400;500;600;700' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', google: 'Plus+Jakarta+Sans:wght@300;400;500;600;700' },
  { name: 'Outfit', category: 'Sans-Serif', google: 'Outfit:wght@300;400;500;600;700' },
  { name: 'Playfair Display', category: 'Serif', google: 'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Lora', category: 'Serif', google: 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Montserrat', category: 'Sans-Serif', google: 'Montserrat:wght@300;400;500;600;700' },
  { name: 'Manrope', category: 'Sans-Serif', google: 'Manrope:wght@300;400;500;600;700' },
  { name: 'Cinzel', category: 'Serif', google: 'Cinzel:wght@400;500;600;700' },
  { name: 'System Sans', category: 'System', google: null },
  { name: 'System Serif', category: 'System', google: null }
])

const defaultTypography = {
  body: {
    fontFamily: 'DM Sans',
    fontSize: '15px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '1.65',
    letterSpacing: '-0.01em',
    color: '#364d59'
  },
  headings: {
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    color: '#1a1a1a'
  },
  h1: {
    fontSize: '42px',
    fontSizeMobile: '28px',
    fontWeight: '500',
    lineHeight: '1.2',
    letterSpacing: '-0.025em'
  },
  h2: {
    fontSize: '32px',
    fontSizeMobile: '24px',
    fontWeight: '500',
    lineHeight: '1.25',
    letterSpacing: '-0.02em'
  },
  h3: {
    fontSize: '24px',
    fontSizeMobile: '20px',
    fontWeight: '500',
    lineHeight: '1.3',
    letterSpacing: '-0.015em'
  },
  h4: {
    fontSize: '18px',
    fontSizeMobile: '16px',
    fontWeight: '600',
    lineHeight: '1.35',
    letterSpacing: '-0.01em'
  },
  h5: {
    fontSize: '16px',
    fontSizeMobile: '14px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0'
  },
  h6: {
    fontSize: '14px',
    fontSizeMobile: '13px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.02em'
  },
  display: {
    fontFamily: 'Cormorant Garamond',
    fontSize: '48px',
    fontSizeMobile: '34px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    color: '#090402'
  },
  navigation: {
    fontFamily: 'DM Sans',
    fontSize: '14px',
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: '0.02em',
    textTransform: 'none'
  },
  button: {
    fontFamily: 'DM Sans',
    fontSize: '12px',
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },
  projectTitle: {
    fontFamily: 'Cormorant Garamond',
    fontSize: '48px',
    fontSizeMobile: '32px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '1.15',
    letterSpacing: '-0.025em',
    color: '#090402'
  }
}

const form = reactive(JSON.parse(JSON.stringify(defaultTypography)))

// Fetch current configurations (non-blocking so the component can mount lazily inside a tab)
const { data: initialData, pending, refresh } = useFetch('/api/admin/typography', {
  getCachedData: () => undefined
})

watch(initialData, (val) => {
  if (val?.config) {
    deepMerge(form, val.config)
  }
  if (val?.availableFonts) {
    availableFonts.value = val.availableFonts
  }
}, { immediate: true })

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {}
      deepMerge(target[key], source[key])
    } else if (source[key] !== undefined) {
      target[key] = source[key]
    }
  }
}

// Compute dynamic Google Font links for live preview in admin
const activeFontLinks = computed(() => {
  const selectedFamilies = new Set([
    form.body.fontFamily,
    form.headings.fontFamily,
    form.display.fontFamily,
    form.navigation.fontFamily,
    form.button.fontFamily,
    form.projectTitle.fontFamily
  ])

  const links = []
  for (const fontName of selectedFamilies) {
    const f = availableFonts.value.find(item => item.name === fontName)
    if (f && f.google) {
      links.push(`https://fonts.googleapis.com/css2?family=${f.google}&display=swap`)
    }
  }
  return links
})

useHead(() => ({
  link: activeFontLinks.value.map(href => ({
    rel: 'stylesheet',
    href
  }))
}))

// Live preview styles
const previewBodyStyle = computed(() => ({
  fontFamily: form.body.fontFamily ? `"${form.body.fontFamily}", sans-serif` : 'inherit',
  fontSize: form.body.fontSize || '15px',
  fontWeight: form.body.fontWeight || '400',
  fontStyle: form.body.fontStyle || 'normal',
  lineHeight: form.body.lineHeight || '1.65',
  letterSpacing: form.body.letterSpacing || '-0.01em',
  color: form.body.color || '#364d59'
}))

const previewProjectTitleStyle = computed(() => {
  const isMobile = previewDevice.value === 'mobile'
  return {
    fontFamily: form.projectTitle.fontFamily ? `"${form.projectTitle.fontFamily}", serif` : 'inherit',
    fontSize: (isMobile ? form.projectTitle.fontSizeMobile : form.projectTitle.fontSize) || '40px',
    fontWeight: form.projectTitle.fontWeight || '400',
    fontStyle: form.projectTitle.fontStyle || 'normal',
    lineHeight: form.projectTitle.lineHeight || '1.15',
    letterSpacing: form.projectTitle.letterSpacing || '-0.025em',
    color: form.projectTitle.color || '#090402'
  }
})

const previewNavStyle = computed(() => ({
  fontFamily: form.navigation.fontFamily ? `"${form.navigation.fontFamily}", sans-serif` : 'inherit',
  fontSize: form.navigation.fontSize || '14px',
  fontWeight: form.navigation.fontWeight || '500',
  letterSpacing: form.navigation.letterSpacing || '0.02em',
  textTransform: form.navigation.textTransform || 'none'
}))

const previewButtonStyle = computed(() => ({
  fontFamily: form.button.fontFamily ? `"${form.button.fontFamily}", sans-serif` : 'inherit',
  fontSize: form.button.fontSize || '12px',
  fontWeight: form.button.fontWeight || '700',
  letterSpacing: form.button.letterSpacing || '0.05em',
  textTransform: form.button.textTransform || 'uppercase'
}))

const getHeadingPreviewStyle = (h) => {
  const isMobile = previewDevice.value === 'mobile'
  const cfg = form[h] || {}
  return {
    fontFamily: form.headings.fontFamily ? `"${form.headings.fontFamily}", sans-serif` : 'inherit',
    fontSize: (isMobile ? cfg.fontSizeMobile : cfg.fontSize) || '24px',
    fontWeight: cfg.fontWeight || form.headings.fontWeight || '500',
    lineHeight: cfg.lineHeight || form.headings.lineHeight || '1.25',
    letterSpacing: cfg.letterSpacing || form.headings.letterSpacing || '-0.02em',
    color: form.headings.color || '#1a1a1a'
  }
}

// Actions
const saveTypography = async () => {
  saving.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/typography', {
      method: 'POST',
      body: { typography: form }
    })
    if (res?.success) {
      toast.success(res.message || 'Typography settings saved successfully!')
      // Invalidate caches in Nuxt client
      clearNuxtData('/api/common')
      clearNuxtData('common')
      clearNuxtData('/api/projects')
      refresh()
    } else {
      toast.error('Failed to save typography settings.')
    }
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.statusMessage || 'An unexpected error occurred while saving.')
  } finally {
    saving.value = false
  }
}

const resetToDefaults = async () => {
  resetting.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/typography', {
      method: 'DELETE'
    })
    if (res?.success) {
      showResetModal.value = false
      toast.success(res.message || 'Typography reset to default values.')
      deepMerge(form, defaultTypography)
      clearNuxtData('/api/common')
      clearNuxtData('common')
      clearNuxtData('/api/projects')
      refresh()
    } else {
      toast.error('Failed to reset typography.')
    }
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.statusMessage || 'An unexpected error occurred while resetting.')
  } finally {
    resetting.value = false
  }
}
</script>

<style scoped>
/* Scoped typography helper styles if needed */
</style>
