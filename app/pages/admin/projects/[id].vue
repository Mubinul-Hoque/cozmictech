<template>
  <div class="font-sans">
    <!-- Page Header -->
    <div class="mb-6 flex flex-col gap-1">
      <NuxtLink to="/admin/projects" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 mb-1">
        <Icon name="lucide:arrow-left" /> Back to Projects
      </NuxtLink>
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">{{ isNew ? 'Add New Project' : 'Edit Project' }}</h2>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <!-- Tab Navigation Bar -->
      <div class="border-b border-slate-200 bg-slate-50/80 px-6 pt-4 flex items-center gap-1 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          @click="activeTab = tab.key"
          class="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg whitespace-nowrap transition-all duration-200 border-b-2 -mb-px relative cursor-pointer"
          :class="activeTab === tab.key
            ? 'border-[#feb900] text-slate-800 bg-white shadow-xs'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/70'"
        >
          <Icon :name="tab.icon" class="text-sm flex-shrink-0" :class="activeTab === tab.key ? 'text-[#feb900]' : ''" />
          <span>{{ tab.label }}</span>
          <!-- Badges for counts -->
          <span
            v-if="tab.key === 'services' && form.services.length > 0"
            class="ml-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none"
          >{{ form.services.length }}</span>
          <span
            v-if="tab.key === 'specifications' && form.specifications.length > 0"
            class="ml-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none"
          >{{ form.specifications.length }}</span>
          <span
            v-if="tab.key === 'media' && form.images && form.images.length > 0"
            class="ml-1 bg-slate-200 text-slate-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none"
          >{{ form.images.length }}</span>
        </button>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="saveProject">
        <div class="p-8">

          <!-- ═══════════════════════════════════════════
               TAB 1: Basic Information
          ═══════════════════════════════════════════ -->
          <div v-show="activeTab === 'basic'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Project Title -->
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Title <span class="text-rose-400">*</span></label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Enter project name..."
                  class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors"
                />
              </div>

              <!-- Searchable Multiple Category Selection Dropdown -->
              <div class="md:col-span-2">
                <div class="relative relative-dropdown-container">
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Categories <span class="text-rose-400">*</span></label>
                  
                  <!-- Selected Badges Area & Dropdown Trigger -->
                  <div 
                    @click="toggleDropdown" 
                    class="min-h-[42px] w-full bg-white border border-slate-300 rounded-lg p-1.5 flex flex-wrap gap-1.5 items-center cursor-pointer focus-within:border-[#feb900] focus-within:ring-1 focus-within:ring-[#feb900] transition-colors"
                  >
                    <!-- Selected Badges -->
                    <span 
                      v-for="catId in form.category_ids" 
                      :key="catId"
                      class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-md hover:bg-amber-100 transition-colors"
                      @click.stop="removeCategory(catId)"
                    >
                      {{ getCategoryName(catId) }}
                      <Icon name="lucide:x" class="text-sm leading-none text-slate-400 hover:text-red-500 transition-colors" />
                    </span>
                    
                    <!-- Placeholder -->
                    <span v-if="!form.category_ids?.length" class="text-slate-400 text-sm pl-2 select-none">
                      Select categories...
                    </span>
                    
                    <!-- Chevron Indicator -->
                    <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Icon :name="showDropdown ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
                    </div>
                  </div>

                  <!-- Dropdown Menu -->
                  <div 
                    v-show="showDropdown" 
                    class="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-3 space-y-2 max-h-60 overflow-y-auto"
                  >
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Icon name="lucide:search" class="text-xs" />
                      </span>
                      <input 
                        v-model="catSearch" 
                        type="text" 
                        placeholder="Search categories..." 
                        class="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-xs bg-slate-50 focus:outline-none focus:border-[#feb900] focus:bg-white transition-all"
                        @click.stop
                      />
                    </div>

                    <div class="space-y-0.5 mt-2">
                      <div 
                        v-for="cat in filteredCategories" 
                        :key="cat.id"
                        @click="toggleCategorySelection(cat.id)"
                        class="flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                        :class="isCategorySelected(cat.id) ? 'bg-amber-50 text-[#0f172a] font-bold' : 'text-slate-700 hover:bg-slate-50'"
                      >
                        <span>{{ cat.name }}</span>
                        <Icon v-if="isCategorySelected(cat.id)" name="lucide:check" class="text-amber-600 font-bold" />
                      </div>
                      <div v-if="!filteredCategories.length" class="text-center py-4 text-xs text-slate-400">
                        No matching categories found
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sector -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sector <span class="text-rose-400">*</span></label>
                <select v-model="form.sector_id" required class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                  <option v-for="sec in options?.sectors || []" :key="sec.id" :value="sec.id">
                    {{ sec.sector || 'Sector ' + sec.id }}
                  </option>
                </select>
              </div>

              <!-- Client -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Client</label>
                <select v-model="form.client_id" class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                  <option :value="null">No Client (Internal/Unassigned)</option>
                  <option v-for="client in options?.clients || []" :key="client.id" :value="client.id">
                    {{ client.client_name }}
                  </option>
                </select>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Status</label>
                <select v-model="form.status" class="block w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors">
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                <input v-model="form.location" type="text" placeholder="e.g. Dhaka, Bangladesh" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>

              <!-- Start Date -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                <input v-model="form.start_date" type="date" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>

              <!-- End Date -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Date</label>
                <input v-model="form.end_date" type="date" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>

              <!-- Project Cost -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contract / Project Value</label>
                <input v-model="form.project_cost" type="text" placeholder="e.g. BDT 5,00,00,000" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>

              <!-- Service Cost -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Cost</label>
                <input v-model="form.service_cost" type="text" placeholder="e.g. BDT 25,00,000" class="block w-full border border-slate-300 rounded-lg py-2.5 px-4 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] sm:text-sm transition-colors" />
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════
               TAB 2: Media (Images)
          ═══════════════════════════════════════════ -->
          <div v-show="activeTab === 'media'" class="space-y-5">
            <div>
              <h3 class="text-sm font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                <Icon name="lucide:image" class="text-[#feb900]" />
                Project Image Gallery
              </h3>
              <p class="text-xs text-slate-500 mb-4">Upload and manage project showcase images. The first image will be used as the primary featured thumbnail.</p>

              <!-- Image Gallery Preview -->
              <div v-if="form.images && form.images.length > 0" class="flex flex-wrap gap-3 mb-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative group w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white">
                  <img :src="`/assets/img/projects/${img}`" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" @click.prevent="removeImage(idx)" class="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm cursor-pointer" title="Remove image">
                      <Icon name="lucide:trash-2" class="text-sm" />
                    </button>
                  </div>
                  <div class="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {{ idx === 0 ? 'Featured' : `#${idx + 1}` }}
                  </div>
                </div>
              </div>
              <div v-else class="mb-4 p-8 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                <Icon name="lucide:image-off" class="text-3xl mx-auto mb-2 text-slate-300" />
                No images uploaded yet.
              </div>

              <!-- Drag & Drop Upload Zone -->
              <div 
                class="relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 flex flex-col items-center justify-center gap-3 group"
                :class="isDragging ? 'border-[#feb900] bg-amber-50/50 scale-[1.01]' : 'border-slate-300 hover:border-[#feb900] bg-slate-50 hover:bg-white'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
              >
                <div class="w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 group-hover:text-[#feb900] transition-colors" :class="{'text-[#feb900]': isDragging}">
                  <Icon v-if="uploading" name="lucide:loader-2" class="animate-spin text-2xl text-amber-500" />
                  <Icon v-else name="lucide:cloud-upload" class="text-2xl" />
                </div>
                
                <div v-if="uploading" class="text-sm font-bold text-amber-600 animate-pulse">
                  Uploading image(s)...
                </div>
                <div v-else>
                  <p class="text-sm font-bold text-slate-700">Drag &amp; drop images here, or</p>
                  <label class="text-xs font-bold text-[#feb900] hover:text-amber-600 cursor-pointer mt-2 inline-block transition-colors bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg">
                    browse files
                    <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" multiple />
                  </label>
                  <p class="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider">Supports JPG, PNG (Max 500KB per image)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════
               TAB 3: Project Narrative
          ═══════════════════════════════════════════ -->
          <div v-show="activeTab === 'narrative'" class="space-y-4">
            <div class="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
              <Icon name="lucide:file-text" class="text-[#feb900] text-lg mt-0.5 flex-shrink-0" />
              <div>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Project Narrative Overview</h4>
                <p class="text-xs text-slate-600 leading-relaxed mt-0.5">
                  The Project Narrative represents the core story and technical scope of the project. Describe background details, design concepts, engineering challenges overcome, methodology, and project outcomes.
                </p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Narrative &amp; Scope Content</label>
              <LazyRichTextEditor v-model="form.description" placeholder="Describe the project narrative, scope of work, technical challenges, and achievements..." />
            </div>
          </div>

          <!-- ═══════════════════════════════════════════
               TAB 4: Provided Services
          ═══════════════════════════════════════════ -->
          <div v-show="activeTab === 'services'" class="space-y-4">
            <div class="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
              <Icon name="lucide:wrench" class="text-[#feb900] text-lg mt-0.5 flex-shrink-0" />
              <div>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Provided Engineering Services</h4>
                <p class="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Define distinct engineering and consultancy services delivered under this project. Add as many services as required, providing a distinct Service Title and Scope Description for each.
                </p>
              </div>
            </div>

            <!-- Panel Action Bar -->
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-extrabold text-slate-700">Services List</span>
                <span class="text-xs font-semibold text-slate-400">({{ form.services.length }} item{{ form.services.length !== 1 ? 's' : '' }})</span>
              </div>

              <button
                type="button"
                @click="addService"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-[#feb900] hover:bg-amber-500 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Icon name="lucide:plus" class="text-sm" />
                <span>Add Service</span>
              </button>
            </div>

            <!-- Services List Items -->
            <div class="space-y-3 pt-1">
              <div v-if="form.services.length === 0" class="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/60">
                <Icon name="lucide:layers" class="text-3xl mx-auto mb-2 text-slate-300" />
                <p class="text-sm font-semibold text-slate-500">No services added yet.</p>
                <p class="text-xs text-slate-400 mt-1">Click "Add Service" above to define specific engineering services for this project.</p>
              </div>

              <div
                v-for="(svc, idx) in form.services"
                :key="idx"
                draggable="true"
                @dragstart="onServiceDragStart(idx)"
                @dragover.prevent
                @drop="onServiceDrop(idx)"
                class="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-xs"
                :class="{ 'opacity-50 ring-2 ring-[#feb900]': draggedServiceIdx === idx }"
              >
                <!-- Item Controls Header -->
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600" title="Drag to reorder">
                      <Icon name="lucide:grip-vertical" class="text-sm" />
                    </span>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Service #{{ idx + 1 }}
                    </span>
                    <span v-if="svc.title" class="text-xs font-semibold text-slate-700 truncate max-w-[280px]">
                      — {{ svc.title }}
                    </span>
                  </div>

                  <!-- Ordering & Delete Action Buttons -->
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="moveServiceUp(idx)"
                      :disabled="idx === 0"
                      title="Move Up"
                      class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                    >
                      <Icon name="lucide:chevron-up" class="text-xs" />
                    </button>
                    <button
                      type="button"
                      @click="moveServiceDown(idx)"
                      :disabled="idx === form.services.length - 1"
                      title="Move Down"
                      class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                    >
                      <Icon name="lucide:chevron-down" class="text-xs" />
                    </button>
                    <div class="w-px h-3.5 bg-slate-200 mx-1"></div>
                    <button
                      type="button"
                      @click="removeService(idx)"
                      title="Delete Service"
                      class="w-6 h-6 flex items-center justify-center rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    >
                      <Icon name="lucide:trash-2" class="text-xs" />
                    </button>
                  </div>
                </div>

                <!-- Inputs -->
                <div class="space-y-3">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Service Title <span class="text-rose-400">*</span>
                    </label>
                    <input
                      v-model="svc.title"
                      type="text"
                      placeholder="e.g. Hydrographic Survey &amp; Bathymetric Mapping"
                      class="block w-full border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm font-semibold transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Service Details / Scope Description
                    </label>
                    <textarea
                      v-model="svc.details"
                      rows="3"
                      placeholder="e.g. Conducted detailed hydrographic survey of the river channel, discharge measurements, and prepared bathymetric maps for dredging analysis."
                      class="block w-full border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Add button at bottom -->
              <div v-if="form.services.length > 0" class="pt-2">
                <button
                  type="button"
                  @click="addService"
                  class="w-full py-2.5 border border-dashed border-slate-300 hover:border-[#feb900] rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-amber-50/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Icon name="lucide:plus" class="text-xs text-[#feb900]" />
                  <span>Add Another Service</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════
               TAB 5: Technical Specifications
          ═══════════════════════════════════════════ -->
          <div v-show="activeTab === 'specifications'" class="space-y-4">
            <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <Icon name="lucide:sliders-horizontal" class="text-[#feb900] text-lg mt-0.5 flex-shrink-0" />
              <div>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Technical Specifications Matrix</h4>
                <p class="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Add sector-specific technical parameters and measurements for this project (e.g., Gross Floor Area, Structural System, Generation Capacity, Bridge Span).
                </p>
              </div>
            </div>

            <!-- Panel Header -->
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-extrabold text-slate-700">Specification Rows</span>
                <span class="text-xs font-semibold text-slate-400">({{ form.specifications.length }} row{{ form.specifications.length !== 1 ? 's' : '' }})</span>
              </div>

              <button
                type="button"
                @click="addSpec"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-[#feb900] hover:bg-amber-500 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Icon name="lucide:plus" class="text-sm" />
                <span>Add Row</span>
              </button>
            </div>

            <!-- Column Headers -->
            <div v-if="form.specifications.length > 0" class="grid grid-cols-[1fr_1fr_auto] gap-3 px-1 pt-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specification / Parameter</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value / Details</span>
              <span class="w-8"></span>
            </div>

            <!-- Existing rows -->
            <div class="space-y-2.5">
              <div v-if="!form.specifications.length" class="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/60">
                <Icon name="lucide:sliders" class="text-3xl mx-auto mb-2 text-slate-300" />
                <p class="text-sm font-semibold text-slate-500">No specifications defined yet.</p>
                <p class="text-xs text-slate-400 mt-1">Click "Add Row" above to enter technical specifications for this project.</p>
              </div>

              <div
                v-for="(spec, idx) in form.specifications"
                :key="idx"
                class="grid grid-cols-[1fr_1fr_auto] gap-3 items-start"
              >
                <div>
                  <input
                    v-model="spec.title"
                    type="text"
                    placeholder="e.g. Building Height / Generation Capacity"
                    class="block w-full border border-slate-300 rounded-lg py-2.5 px-3.5 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                  />
                </div>
                <div>
                  <input
                    v-model="spec.value"
                    type="text"
                    placeholder="e.g. 95.9 m / 100 MW"
                    class="block w-full border border-slate-300 rounded-lg py-2.5 px-3.5 bg-white text-slate-800 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] text-sm transition-colors"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    @click="removeSpec(idx)"
                    class="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                    title="Remove row"
                  >
                    <Icon name="lucide:trash-2" class="text-sm" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Add row button at bottom -->
            <div v-if="form.specifications.length > 0" class="pt-2">
              <button
                type="button"
                @click="addSpec"
                class="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-[#feb900] rounded-xl py-2.5 text-xs font-bold text-slate-500 hover:text-[#feb900] bg-white hover:bg-amber-50/30 transition-all duration-200 cursor-pointer"
              >
                <Icon name="lucide:plus" class="text-sm" />
                Add Another Row
              </button>
            </div>
          </div>

        </div>

        <!-- Form Bottom Action Bar -->
        <div class="flex items-center justify-between px-8 py-5 border-t border-slate-200 bg-slate-50/70">
          <!-- Step Navigation Buttons -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="goToPrevTab"
              :disabled="activeTabIndex === 0"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="lucide:arrow-left" class="text-xs" /> Prev
            </button>
            <button
              type="button"
              @click="goToNextTab"
              :disabled="activeTabIndex === tabs.length - 1"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <Icon name="lucide:arrow-right" class="text-xs" />
            </button>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="router.push('/admin/projects')"
              class="bg-white py-2 px-5 border border-slate-300 rounded-full shadow-xs text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 focus:outline-none transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="bg-[#feb900] border border-transparent rounded-full shadow-xs py-2 px-6 text-xs font-bold hover:bg-[#e5a600] focus:outline-none disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
              style="color: #1e293b;"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="text-sm animate-spin" />
              <Icon v-else name="lucide:save" class="text-sm" />
              {{ saving ? 'Saving...' : 'Save Project' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const isNew = route.params.id === 'new';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const tabs = [
  { key: 'basic',          label: 'Basic Info',              icon: 'lucide:info' },
  { key: 'media',          label: 'Media',                   icon: 'lucide:image' },
  { key: 'narrative',      label: 'Project Narrative',       icon: 'lucide:file-text' },
  { key: 'services',       label: 'Provided Services',       icon: 'lucide:wrench' },
  { key: 'specifications', label: 'Technical Specifications', icon: 'lucide:sliders-horizontal' },
];
const activeTab = ref('basic');
const activeTabIndex = computed(() => tabs.findIndex(t => t.key === activeTab.value));

const goToNextTab = () => {
  if (activeTabIndex.value < tabs.length - 1) activeTab.value = tabs[activeTabIndex.value + 1].key;
};
const goToPrevTab = () => {
  if (activeTabIndex.value > 0) activeTab.value = tabs[activeTabIndex.value - 1].key;
};

// ─── Form state ──────────────────────────────────────────────────────────────
const form = ref({
  title: '',
  category_ids: [],
  sector_id: 1,
  client_id: null,
  status: 'Completed',
  start_date: '',
  end_date: '',
  description: '',
  images: [],
  location: '',
  project_cost: '',
  service_cost: '',
  services: [],
  specifications: []
});

const saving = ref(false);
const uploading = ref(false);
const showDropdown = ref(false);
const catSearch = ref('');
const isDragging = ref(false);

const { data: options } = await useFetch('/api/admin/projects/options');

// ─── Dynamic Service helpers ──────────────────────────────────────────────────
const draggedServiceIdx = ref(null);
const addService = () => {
  form.value.services.push({ title: '', details: '' });
};
const removeService = (idx) => {
  form.value.services.splice(idx, 1);
};
const moveServiceUp = (idx) => {
  if (idx > 0) {
    const item = form.value.services.splice(idx, 1)[0];
    form.value.services.splice(idx - 1, 0, item);
  }
};
const moveServiceDown = (idx) => {
  if (idx < form.value.services.length - 1) {
    const item = form.value.services.splice(idx, 1)[0];
    form.value.services.splice(idx + 1, 0, item);
  }
};
const onServiceDragStart = (idx) => {
  draggedServiceIdx.value = idx;
};
const onServiceDrop = (targetIdx) => {
  if (draggedServiceIdx.value !== null && draggedServiceIdx.value !== targetIdx) {
    const item = form.value.services.splice(draggedServiceIdx.value, 1)[0];
    form.value.services.splice(targetIdx, 0, item);
  }
  draggedServiceIdx.value = null;
};

// ─── Free-form spec row helpers ───────────────────────────────────────────────
const addSpec = () => {
  form.value.specifications.push({ title: '', value: '' });
};
const removeSpec = (idx) => {
  form.value.specifications.splice(idx, 1);
};

// ─── Load existing project data ───────────────────────────────────────────────
onMounted(async () => {
  if (!isNew) {
    try {
      const project = await useNuxtApp().$fetch(`/api/admin/projects/${route.params.id}`);
      if (project) {
        Object.keys(form.value).forEach(key => {
          if (key === 'specifications' || key === 'services') return;
          if (project[key] !== undefined && project[key] !== null) {
            if (key === 'images' && !Array.isArray(project[key])) {
              form.value[key] = project[key] ? String(project[key]).split(',').map(s => s.trim()) : [];
            } else if ((key === 'start_date' || key === 'end_date') && project[key]) {
              form.value[key] = String(project[key]).split('T')[0];
            } else {
              form.value[key] = project[key];
            }
          }
        });
        // Populate category_ids from project_categories relationship
        if (project.project_categories) {
          form.value.category_ids = project.project_categories.map(pc => pc.category_id);
        }
        // Populate sector-specific specifications
        if (Array.isArray(project.specifications)) {
          form.value.specifications = project.specifications.map(s => ({ title: s.title || '', value: s.value || '' }));
        }
        // Populate dynamic services
        if (Array.isArray(project.services)) {
          form.value.services = project.services.map(s => ({ title: s.title || '', details: s.details || '' }));
        } else if (typeof project.services === 'string' && project.services) {
          form.value.services = project.services.split(',').map(s => ({ title: s.trim(), details: '' })).filter(s => s.title);
        } else {
          form.value.services = [];
        }
      }
    } catch (err) {
      useToast().error('Failed to load project data');
    }
  }
});

// ─── Category dropdown helpers ────────────────────────────────────────────────
if (process.client) {
  window.addEventListener('click', (e) => {
    const relative = document.querySelector('.relative-dropdown-container');
    if (relative && !relative.contains(e.target)) {
      showDropdown.value = false;
    }
  });
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const getCategoryName = (catId) => {
  const cat = options.value?.categories?.find(c => c.id === catId);
  return cat ? cat.name : 'Category #' + catId;
};

const filteredCategories = computed(() => {
  const allCats = options.value?.categories || [];
  if (!catSearch.value.trim()) return allCats;
  return allCats.filter(c => 
    c.name?.toLowerCase().includes(catSearch.value.toLowerCase())
  );
});

const isCategorySelected = (catId) => {
  return form.value.category_ids.includes(catId);
};

const toggleCategorySelection = (catId) => {
  const idx = form.value.category_ids.indexOf(catId);
  if (idx > -1) {
    form.value.category_ids.splice(idx, 1);
  } else {
    form.value.category_ids.push(catId);
  }
};

const removeCategory = (catId) => {
  const idx = form.value.category_ids.indexOf(catId);
  if (idx > -1) {
    form.value.category_ids.splice(idx, 1);
  }
};

// ─── Image Upload helpers ──────────────────────────────────────────────────────
const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    useToast().error(`Invalid file format: ${file.name}. Only JPG and PNG are allowed.`);
    return false;
  }
  if (file.size > 500 * 1024) {
    useToast().error(`File too large: ${file.name}. Maximum size is 500KB.`);
    return false;
  }
  return true;
};

const processFile = async (file) => {
  if (!file || !validateFile(file)) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'projects');

  try {
    const res = await useNuxtApp().$fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    
    if (res.success) {
      if (!Array.isArray(form.value.images)) {
        form.value.images = [];
      }
      form.value.images.push(res.filename);
      clearNuxtData();
      useToast().success('Image uploaded successfully');
    }
  } catch (error) {
    useToast().error('Upload failed: ' + (error.data?.statusMessage || error.message));
  } finally {
    uploading.value = false;
  }
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files || !files.length) return;
  
  for (let i = 0; i < files.length; i++) {
    await processFile(files[i]);
  }
  event.target.value = '';
};

const handleFileDrop = async (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (!files || !files.length) return;
  
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.startsWith('image/')) {
      await processFile(files[i]);
    } else {
      useToast().error('Only image files are allowed: ' + files[i].name);
    }
  }
};

const removeImage = (idx) => {
  if (Array.isArray(form.value.images)) {
    form.value.images.splice(idx, 1);
  }
};

// ─── Save Project ──────────────────────────────────────────────────────────────
const saveProject = async () => {
  saving.value = true;
  try {
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${route.params.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    await useNuxtApp().$fetch(url, { method, body: form.value });
    
    clearNuxtData();
    await refreshNuxtData('admin-projects-list');

    clearNuxtData();
    useToast().success('Project saved successfully!');
    router.push('/admin/projects');
  } catch (error) {
    useToast().error(error.data?.statusMessage || 'Failed to save project');
  } finally {
    saving.value = false;
  }
};
</script>
