<template>
  <div class="space-y-8 font-sans pb-16">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
      <div>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          <NuxtLink to="/admin" class="hover:text-slate-600 transition-colors">Admin</NuxtLink>
          <Icon name="lucide:chevron-right" class="text-xs" />
          <span class="text-[#feb900]">Security</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <span>Security &amp; Access Policies</span>
        </h2>
        <p class="text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">
          Database-Backed Security Policies, IP Blocking, &amp; Activity Audit Logs
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button 
          v-if="isSuperAdmin"
          @click="saveSecurityPolicies" 
          :disabled="savingSecurity"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#feb900] hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <span v-if="savingSecurity" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent mr-1"></span>
          <Icon v-else name="lucide:save" class="text-base" />
          {{ savingSecurity ? 'Saving Changes...' : 'Save Security Policies' }}
        </button>
      </div>
    </div>

    <!-- Security KPI / Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Session Timeout KPI -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#feb900] flex items-center justify-center text-xl flex-shrink-0">
          <Icon name="lucide:clock" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Session Timeout</p>
          <h4 class="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            {{ policies.sessionTimeoutHours }} {{ policies.sessionTimeoutHours === 1 ? 'Hour' : 'Hours' }}
          </h4>
          <p class="text-[11px] text-slate-500 truncate">Inactivity auto-logout</p>
        </div>
      </div>

      <!-- Rate Limiting KPI -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
        <div 
          class="w-12 h-12 rounded-2xl border flex items-center justify-center text-xl flex-shrink-0"
          :class="policies.rateLimitEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-500'"
        >
          <Icon :name="policies.rateLimitEnabled ? 'lucide:shield-check' : 'lucide:shield-off'" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rate Limiting</p>
          <div class="flex items-center gap-2 mt-0.5">
            <h4 class="text-xl font-extrabold text-slate-800 tracking-tight">
              {{ policies.rateLimitEnabled ? 'Protected' : 'Disabled' }}
            </h4>
            <span 
              class="w-2 h-2 rounded-full"
              :class="policies.rateLimitEnabled ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-rose-500'"
            ></span>
          </div>
          <p class="text-[11px] text-slate-500 truncate">Brute-force shield</p>
        </div>
      </div>

      <!-- Blocked IPs KPI -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl flex-shrink-0">
          <Icon name="lucide:ban" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blocked IPs</p>
          <h4 class="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            {{ blockedIps.length }}
          </h4>
          <p class="text-[11px] text-slate-500 truncate">Suspicious addresses</p>
        </div>
      </div>

      <!-- Audit Logs KPI -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
          <Icon name="lucide:activity" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Records</p>
          <h4 class="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            {{ securityLogs.length }}
          </h4>
          <p class="text-[11px] text-slate-500 truncate">Live activity logs</p>
        </div>
      </div>
    </div>

    <!-- Main Tabbed Navigation -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Tab Header Strip -->
      <div class="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto whitespace-nowrap scrollbar-thin">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 focus:outline-none cursor-pointer inline-flex items-center gap-2"
          :class="activeTab === tab.id 
            ? 'border-[#feb900] text-slate-900 bg-white font-extrabold shadow-2xs' 
            : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'"
        >
          <Icon :name="tab.icon" class="text-base" :class="activeTab === tab.id ? 'text-[#feb900]' : 'text-slate-400'" />
          <span>{{ tab.name }}</span>
          <span 
            v-if="tab.count !== undefined" 
            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
            :class="activeTab === tab.id ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-6 sm:p-8">
        <!-- ═══════════════════════════════════════════════════════════════ -->
        <!-- TAB 1: SECURITY & ACCESS POLICIES -->
        <!-- ═══════════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'policies'" class="space-y-8">
          <!-- Role Notice Banner -->
          <div 
            class="rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            :class="isSuperAdmin ? 'bg-amber-50/40 border-amber-200/80 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700'"
          >
            <div class="flex items-center gap-3.5">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                :class="isSuperAdmin ? 'bg-[#feb900] text-slate-950 font-bold' : 'bg-slate-200 text-slate-500'"
              >
                <Icon :name="isSuperAdmin ? 'lucide:shield-check' : 'lucide:shield-alert'" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-extrabold tracking-tight">Database-Backed Security Governance</h4>
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                    :class="isSuperAdmin ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'"
                  >
                    {{ isSuperAdmin ? 'Super Admin Mode' : 'Read-Only' }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  All policies below are stored in the database and applied dynamically across the platform.
                </p>
              </div>
            </div>

            <div v-if="isSuperAdmin" class="flex-shrink-0">
              <span class="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300/60 inline-flex items-center gap-1.5">
                <Icon name="lucide:database" class="text-sm" />
                Live Database Storage
              </span>
            </div>
          </div>

          <!-- Section 1.1: Admin Session Timeout -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:clock" class="text-[#feb900] text-lg" />
                  <h4 class="text-base font-extrabold text-slate-800 tracking-tight">Admin Session Inactivity Timeout</h4>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">
                  Administrators will be automatically logged out after this duration of inactivity.
                </p>
              </div>
              <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
                Active: {{ policies.sessionTimeoutHours }}h
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div 
                v-for="opt in sessionTimeoutOptions" 
                :key="opt.value"
                @click="isSuperAdmin ? (policies.sessionTimeoutHours = opt.value) : null"
                class="relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between"
                :class="[
                  policies.sessionTimeoutHours === opt.value 
                    ? 'border-[#feb900] bg-amber-50/30 shadow-xs ring-2 ring-amber-100' 
                    : 'border-slate-200 hover:border-slate-300 bg-white',
                  isSuperAdmin ? 'cursor-pointer hover:shadow-sm' : 'cursor-not-allowed opacity-80'
                ]"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-base font-black text-slate-800 tracking-tight">{{ opt.label }}</span>
                  <div 
                    class="w-5 h-5 rounded-full flex items-center justify-center border transition-all"
                    :class="policies.sessionTimeoutHours === opt.value ? 'bg-[#feb900] border-[#feb900] text-slate-950' : 'border-slate-300 bg-white'"
                  >
                    <Icon v-if="policies.sessionTimeoutHours === opt.value" name="lucide:check" class="text-xs font-bold" />
                  </div>
                </div>
                <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {{ opt.desc }}
                </p>
                <div v-if="opt.value === 2" class="mt-2.5">
                  <span class="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
                    Recommended
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 1.2: Login Rate Limiting & Brute-Force Protection -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:shield-alert" class="text-[#feb900] text-lg" />
                  <h4 class="text-base font-extrabold text-slate-800 tracking-tight">Login Rate Limiting &amp; Brute-Force Shield</h4>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">
                  Temporarily locks out IP addresses and accounts after repeated failed password attempts.
                </p>
              </div>

              <!-- Master Toggle Switch -->
              <div 
                class="flex items-center gap-3 cursor-pointer select-none"
                @click="isSuperAdmin ? (policies.rateLimitEnabled = !policies.rateLimitEnabled) : null"
              >
                <div 
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200"
                  :class="policies.rateLimitEnabled
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'"
                >
                  <span 
                    class="w-2 h-2 rounded-full transition-all duration-200"
                    :class="policies.rateLimitEnabled ? 'bg-amber-500 ring-2 ring-amber-300 animate-pulse' : 'bg-slate-400'"
                  ></span>
                  <span>{{ policies.rateLimitEnabled ? 'ON' : 'OFF' }}</span>
                </div>

                <div 
                  class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out"
                  :class="policies.rateLimitEnabled ? 'bg-[#feb900] border-[#feb900]' : 'bg-slate-200 border-slate-300'"
                >
                  <span 
                    class="pointer-events-none inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out text-[11px]"
                    :class="policies.rateLimitEnabled ? 'translate-x-5 text-amber-700 font-bold' : 'translate-x-0 text-slate-400'"
                  >
                    <Icon :name="policies.rateLimitEnabled ? 'lucide:check' : 'lucide:x'" class="text-xs" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Rate limit parameters -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Tier 1 -->
              <div class="p-5 rounded-2xl bg-amber-50/30 border border-amber-200/80 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold uppercase tracking-wider text-amber-800">Tier 1 Lockout</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/60 text-amber-900">First Threshold</span>
                </div>
                <p class="text-xs text-slate-500">Initial temporary cooldown upon consecutive credential failures.</p>
                <div class="space-y-3 pt-1">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Failed Attempts</label>
                    <input 
                      type="number" 
                      min="2" 
                      max="20"
                      v-model.number="policies.tier1Attempts"
                      :disabled="!isSuperAdmin || !policies.rateLimitEnabled"
                      class="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#feb900] disabled:bg-slate-100 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lockout Duration (Minutes)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="180"
                      v-model.number="policies.tier1LockoutMinutes"
                      :disabled="!isSuperAdmin || !policies.rateLimitEnabled"
                      class="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#feb900] disabled:bg-slate-100 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <!-- Tier 2 -->
              <div class="p-5 rounded-2xl bg-rose-50/30 border border-rose-200/80 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold uppercase tracking-wider text-rose-800">Tier 2 Lockout</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200/60 text-rose-900">Persistent Attack</span>
                </div>
                <p class="text-xs text-slate-500">Severe prolonged lockout for repeated failure attempts.</p>
                <div class="space-y-3 pt-1">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Failed Attempts</label>
                    <input 
                      type="number" 
                      min="3" 
                      max="50"
                      v-model.number="policies.tier2Attempts"
                      :disabled="!isSuperAdmin || !policies.rateLimitEnabled"
                      class="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#feb900] disabled:bg-slate-100 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lockout Duration (Minutes)</label>
                    <input 
                      type="number" 
                      min="5" 
                      max="1440"
                      v-model.number="policies.tier2LockoutMinutes"
                      :disabled="!isSuperAdmin || !policies.rateLimitEnabled"
                      class="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#feb900] disabled:bg-slate-100 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <!-- Cooldown -->
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold uppercase tracking-wider text-slate-700">Attempt Reset Window</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">Auto-Decay</span>
                </div>
                <p class="text-xs text-slate-500">Inactivity duration after which failed attempt counters reset.</p>
                <div class="space-y-3 pt-1">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cooldown Duration (Minutes)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="180"
                      v-model.number="policies.cooldownMinutes"
                      :disabled="!isSuperAdmin || !policies.rateLimitEnabled"
                      class="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#feb900] disabled:bg-slate-100 disabled:opacity-60"
                    />
                  </div>
                  <div class="rounded-xl bg-white border border-slate-200 p-2.5 text-[11px] text-slate-500">
                    <Icon name="lucide:info" class="text-blue-500 mr-1 inline" />
                    Successful authentications instantly reset failure counters.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 1.3: Access Control & Password Governance -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <div class="pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <Icon name="lucide:lock" class="text-[#feb900] text-lg" />
                <h4 class="text-base font-extrabold text-slate-800 tracking-tight">Access Control &amp; Password Governance</h4>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Global security enforcement across administrator logins and accounts.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- IP Blocking Enforcement Toggle -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h5 class="text-sm font-bold text-slate-800">IP Blacklist Enforcement</h5>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Actively block requests from blocked IP addresses across all admin gateways.
                  </p>
                </div>
                <div 
                  class="flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
                  @click="isSuperAdmin ? (policies.ipBlockingEnabled = !policies.ipBlockingEnabled) : null"
                >
                  <div 
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                    :class="policies.ipBlockingEnabled
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'"
                  >
                    <span>{{ policies.ipBlockingEnabled ? 'ON' : 'OFF' }}</span>
                  </div>
                  <div 
                    class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200"
                    :class="policies.ipBlockingEnabled ? 'bg-[#feb900] border-[#feb900]' : 'bg-slate-200 border-slate-300'"
                  >
                    <span 
                      class="pointer-events-none inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-md transition-transform duration-200 text-[11px]"
                      :class="policies.ipBlockingEnabled ? 'translate-x-5 text-amber-700 font-bold' : 'translate-x-0 text-slate-400'"
                    >
                      <Icon :name="policies.ipBlockingEnabled ? 'lucide:check' : 'lucide:x'" class="text-xs" />
                    </span>
                  </div>
                </div>
              </div>

              <!-- Strong Passwords Requirement -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h5 class="text-sm font-bold text-slate-800">Require Complex Passwords</h5>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Enforce mix of uppercase, lowercase, numbers, and symbols for admin accounts.
                  </p>
                </div>
                <div 
                  class="flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
                  @click="isSuperAdmin ? (policies.requireStrongPasswords = !policies.requireStrongPasswords) : null"
                >
                  <div 
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                    :class="policies.requireStrongPasswords
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'"
                  >
                    <span>{{ policies.requireStrongPasswords ? 'ON' : 'OFF' }}</span>
                  </div>
                  <div 
                    class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200"
                    :class="policies.requireStrongPasswords ? 'bg-[#feb900] border-[#feb900]' : 'bg-slate-200 border-slate-300'"
                  >
                    <span 
                      class="pointer-events-none inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-md transition-transform duration-200 text-[11px]"
                      :class="policies.requireStrongPasswords ? 'translate-x-5 text-amber-700 font-bold' : 'translate-x-0 text-slate-400'"
                    >
                      <Icon :name="policies.requireStrongPasswords ? 'lucide:check' : 'lucide:x'" class="text-xs" />
                    </span>
                  </div>
                </div>
              </div>

              <!-- Minimum Password Length -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 md:col-span-2">
                <div>
                  <h5 class="text-sm font-bold text-slate-800">Minimum Password Length</h5>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Specifies the lowest allowed character length when administrators update passwords.
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="6" 
                    max="32"
                    v-model.number="policies.minPasswordLength"
                    :disabled="!isSuperAdmin"
                    class="w-20 px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm font-bold text-center focus:outline-none focus:border-[#feb900] disabled:bg-slate-100"
                  />
                  <span class="text-xs font-bold text-slate-400">Characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════ -->
        <!-- TAB 2: SUSPICIOUS ACTIVITY & BLOCKED IPS -->
        <!-- ═══════════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'blocked_ips'" class="space-y-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <Icon name="lucide:ban" class="text-rose-500 text-lg" />
                <h4 class="text-base font-extrabold text-slate-800 tracking-tight">Suspicious Activity IP Blocking</h4>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Super Admins can block or unblock specific IP addresses to stop unauthorized access attempts.
              </p>
            </div>

            <button 
              v-if="isSuperAdmin"
              @click="openBlockModal()"
              type="button"
              class="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Icon name="lucide:plus-circle" class="text-base" />
              Block IP Address
            </button>
          </div>

          <!-- Blocked IPs Table -->
          <div v-if="blockedIps.length === 0" class="text-center py-14 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-3">
              <Icon name="lucide:shield-check" />
            </div>
            <p class="text-sm font-extrabold text-slate-700">No Blocked IP Addresses</p>
            <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are currently no IP addresses restricted on this system. Click "Block IP Address" above or block suspicious IPs directly from the Audit Logs tab.
            </p>
          </div>

          <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-100 text-left text-xs">
                <thead class="bg-slate-50 font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th class="px-5 py-3.5">IP Address</th>
                    <th class="px-5 py-3.5">Reason</th>
                    <th class="px-5 py-3.5">Blocked By</th>
                    <th class="px-5 py-3.5">Date Blocked</th>
                    <th v-if="isSuperAdmin" class="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-600">
                  <tr v-for="item in blockedIps" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
                    <td class="px-5 py-3.5 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        <span class="font-mono font-bold text-slate-800 text-sm">{{ item.ip_address }}</span>
                      </div>
                    </td>
                    <td class="px-5 py-3.5">
                      <span class="text-slate-600 font-medium">{{ item.reason || 'Suspicious activity' }}</span>
                    </td>
                    <td class="px-5 py-3.5 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {{ item.blocked_by || 'SuperAdmin' }}
                      </span>
                    </td>
                    <td class="px-5 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                      {{ new Date(item.created_at).toLocaleString() }}
                    </td>
                    <td v-if="isSuperAdmin" class="px-5 py-3.5 whitespace-nowrap text-right">
                      <button 
                        @click="unblockIp(item.ip_address)" 
                        :disabled="unblockingIp === item.ip_address"
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        <span v-if="unblockingIp === item.ip_address" class="animate-spin rounded-full h-3 w-3 border-2 border-emerald-600 border-t-transparent"></span>
                        <Icon v-else name="lucide:unlock" class="text-xs" />
                        Unblock IP
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════ -->
        <!-- TAB 3: DATABASE-BACKED SECURITY AUDIT & ACTIVITY LOGS -->
        <!-- ═══════════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'logs'" class="space-y-6">
          <!-- Filters & Action Bar -->
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <Icon name="lucide:activity" class="text-[#feb900] text-lg" />
                <h4 class="text-base font-extrabold text-slate-800 tracking-tight">Security Audit &amp; Activity Log Stream</h4>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Complete database audit trail of authentication, credential events, admin operations, and anomalies.
              </p>
            </div>

            <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <button 
                type="button" 
                @click="fetchSecurityData" 
                :disabled="loadingSecurity"
                class="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Icon name="lucide:refresh-cw" :class="{ 'animate-spin': loadingSecurity }" class="text-xs" />
                Refresh Logs
              </button>

              <button 
                v-if="isSuperAdmin && securityLogs.length > 0"
                type="button" 
                @click="clearLogs" 
                class="px-4 py-2 rounded-full border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Icon name="lucide:trash-2" class="text-xs" />
                Clear Logs
              </button>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            <!-- Search Bar -->
            <div class="md:col-span-6 relative">
              <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                v-model="logSearch"
                placeholder="Search by IP, username, event action, or details..."
                class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#feb900] transition-all"
              />
              <button 
                v-if="logSearch" 
                @click="logSearch = ''" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            </div>

            <!-- Category Filter Tabs -->
            <div class="md:col-span-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
              <button 
                v-for="cat in logCategories" 
                :key="cat.id"
                @click="selectedCategory = cat.id"
                class="px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                :class="selectedCategory === cat.id 
                  ? 'bg-slate-900 text-white shadow-2xs' 
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'"
              >
                <span>{{ cat.label }}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="selectedCategory === cat.id ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-500'">
                  {{ cat.count }}
                </span>
              </button>
            </div>
          </div>

          <!-- Logs Table Container -->
          <div v-if="loadingSecurity && securityLogs.length === 0" class="flex justify-center py-16">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#feb900]"></div>
          </div>

          <div v-else-if="filteredLogs.length === 0" class="text-center py-14 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200">
            <Icon name="lucide:shield-check" class="text-4xl text-emerald-500 mb-2" />
            <p class="text-sm font-extrabold text-slate-700">No Matching Activity Logs</p>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ logSearch ? 'No logs match your current search terms.' : 'No security events recorded yet in this category.' }}
            </p>
          </div>

          <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table class="min-w-full divide-y divide-slate-100 text-left text-xs">
                <thead class="bg-slate-50 sticky top-0 z-10 font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th class="px-4 py-3.5">Timestamp</th>
                    <th class="px-4 py-3.5">Event Action</th>
                    <th class="px-4 py-3.5">User / Identifier</th>
                    <th class="px-4 py-3.5">IP Address</th>
                    <th class="px-4 py-3.5">Device</th>
                    <th class="px-4 py-3.5">Details</th>
                    <th v-if="isSuperAdmin" class="px-4 py-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-slate-50/80 transition-colors">
                    <!-- Timestamp -->
                    <td class="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {{ formatLogDate(log.timestamp) }}
                    </td>

                    <!-- Event Action Badge -->
                    <td class="px-4 py-3.5 whitespace-nowrap">
                      <span 
                        class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 border"
                        :class="getActionBadgeClass(log)"
                      >
                        <Icon :name="getActionIcon(log.action)" class="text-xs" />
                        {{ formatActionName(log.action) }}
                      </span>
                    </td>

                    <!-- Identifier -->
                    <td class="px-4 py-3.5 whitespace-nowrap">
                      <span class="font-bold text-slate-800 max-w-[130px] truncate block" :title="log.identifier">
                        {{ log.identifier || 'system' }}
                      </span>
                    </td>

                    <!-- IP Address -->
                    <td class="px-4 py-3.5 whitespace-nowrap font-mono text-[11px]">
                      <div class="flex items-center gap-1.5">
                        <span class="text-slate-600">{{ log.ip }}</span>
                        <span 
                          v-if="isIpBlocked(log.ip)" 
                          class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200"
                        >
                          Blocked
                        </span>
                      </div>
                    </td>

                    <!-- Device Platform -->
                    <td class="px-4 py-3.5 whitespace-nowrap">
                      <div class="flex items-center gap-1.5 text-slate-500" :title="log.userAgent || 'Device'">
                        <Icon :name="getDeviceIcon(log.deviceType)" class="text-sm text-slate-400" />
                        <span class="capitalize text-[11px]">{{ log.deviceType || 'Desktop' }}</span>
                      </div>
                    </td>

                    <!-- Details -->
                    <td class="px-4 py-3.5 max-w-sm">
                      <p class="text-slate-600 text-xs truncate" :title="log.details">
                        {{ log.details }}
                      </p>
                    </td>

                    <!-- Quick Action (Block IP if not blocked) -->
                    <td v-if="isSuperAdmin" class="px-4 py-3.5 whitespace-nowrap text-right">
                      <button 
                        v-if="canBlockIp(log.ip)"
                        @click="openBlockModal(log.ip, `Blocked from Audit Log: ${log.action}`)"
                        type="button"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-rose-200 hover:bg-rose-50 text-rose-700 text-[11px] font-bold transition-all cursor-pointer"
                        title="Block this IP address"
                      >
                        <Icon name="lucide:ban" class="text-xs" />
                        Block IP
                      </button>
                      <button 
                        v-else-if="isIpBlocked(log.ip)"
                        @click="unblockIp(log.ip)"
                        type="button"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 text-[11px] font-bold transition-all cursor-pointer"
                        title="Unblock this IP"
                      >
                        <Icon name="lucide:unlock" class="text-xs" />
                        Unblock
                      </button>
                      <span v-else class="text-slate-300 text-[11px]">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════ -->
    <!-- MODAL: BLOCK IP ADDRESS -->
    <!-- ═════════════════════════════════════════════════════════════════ -->
    <div 
      v-if="showBlockModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-all"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl flex-shrink-0">
              <Icon name="lucide:shield-ban" />
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-800 tracking-tight">Block IP Address</h3>
              <p class="text-xs text-slate-400">Restrict access for this IP address across the platform</p>
            </div>
          </div>
          <button 
            @click="showBlockModal = false" 
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <Icon name="lucide:x" class="text-lg" />
          </button>
        </div>

        <form @submit.prevent="submitBlockIp" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              IP Address <span class="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              v-model.trim="blockForm.ip" 
              placeholder="e.g. 192.168.1.100 or 2001:db8::1"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-[#feb900] transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Reason for Blocking
            </label>
            <textarea 
              v-model.trim="blockForm.reason" 
              rows="3"
              placeholder="e.g. Repeated brute-force login attempts, malicious bot scanner..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#feb900] transition-colors resize-none"
            ></textarea>
          </div>

          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <Icon name="lucide:alert-triangle" class="text-amber-600 mr-1 inline" />
            The blocked IP will receive a <strong>403 Forbidden</strong> response on all admin routes and login attempts.
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="showBlockModal = false"
              class="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="blockingLoading || !blockForm.ip"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <span v-if="blockingLoading" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></span>
              <Icon v-else name="lucide:ban" class="text-sm" />
              {{ blockingLoading ? 'Blocking...' : 'Confirm Block' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Security & Access Policies | Admin Panel'
})

const authUser = useState('authUser')
const isSuperAdmin = computed(() => authUser.value?.role === 'SuperAdmin')
const adminSession = useAdminSession()

const activeTab = ref('policies')

const tabs = computed(() => [
  { id: 'policies', name: 'Security & Access Policies', icon: 'lucide:shield' },
  { id: 'blocked_ips', name: 'Blocked IPs', icon: 'lucide:ban', count: blockedIps.value.length },
  { id: 'logs', name: 'Security Audit & Activity Logs', icon: 'lucide:activity', count: securityLogs.value.length }
])

const sessionTimeoutOptions = [
  { value: 1, label: '1 hour', desc: 'Strict security, recommended for shared terminals' },
  { value: 2, label: '2 hours', desc: 'Balanced security (recommended standard)' },
  { value: 6, label: '6 hours', desc: 'Half-day window for active operational shifts' },
  { value: 12, label: '12 hours', desc: 'Full-day admin session window' },
  { value: 24, label: '24 hours', desc: 'Maximum 1-day continuous duration' }
]

// Database-backed policy model
const policies = reactive({
  sessionTimeoutHours: 2,
  rateLimitEnabled: true,
  tier1Attempts: 5,
  tier1LockoutMinutes: 15,
  tier2Attempts: 10,
  tier2LockoutMinutes: 60,
  cooldownMinutes: 15,
  ipBlockingEnabled: true,
  requireStrongPasswords: true,
  minPasswordLength: 8
})

const blockedIps = ref([])
const securityLogs = ref([])
const loadingSecurity = ref(false)
const savingSecurity = ref(false)

// Block Modal & Action State
const showBlockModal = ref(false)
const blockingLoading = ref(false)
const unblockingIp = ref(null)
const blockForm = reactive({
  ip: '',
  reason: ''
})

// Logs Search & Category Filters
const logSearch = ref('')
const selectedCategory = ref('all')

const isIpBlocked = (ip) => {
  if (!ip) return false
  const clean = ip.trim().toLowerCase()
  return blockedIps.value.some(b => b.ip_address.toLowerCase() === clean)
}

const canBlockIp = (ip) => {
  if (!ip) return false
  const clean = ip.trim().toLowerCase()
  if (['unknown', '127.0.0.1', '::1', 'localhost'].includes(clean)) return false
  return !isIpBlocked(clean)
}

const openBlockModal = (prefillIp = '', prefillReason = '') => {
  blockForm.ip = prefillIp
  blockForm.reason = prefillReason || 'Suspicious activity detected in audit logs'
  showBlockModal.value = true
}

const fetchSecurityData = async () => {
  loadingSecurity.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/security')
    if (res?.success) {
      if (res.policies) {
        Object.assign(policies, res.policies)
      }
      if (Array.isArray(res.blockedIps)) {
        blockedIps.value = res.blockedIps
      }
      if (Array.isArray(res.logs)) {
        securityLogs.value = res.logs
      }
    }
  } catch (err) {
    console.error('Failed to load security settings:', err)
  } finally {
    loadingSecurity.value = false
  }
}

const saveSecurityPolicies = async () => {
  if (!isSuperAdmin.value) {
    useToast().error('Only Super Admin can update security policies.')
    return
  }

  savingSecurity.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/security', {
      method: 'POST',
      body: {
        action: 'save_policies',
        policies: {
          sessionTimeoutHours: policies.sessionTimeoutHours,
          rateLimitEnabled: policies.rateLimitEnabled,
          tier1Attempts: policies.tier1Attempts,
          tier1LockoutMinutes: policies.tier1LockoutMinutes,
          tier2Attempts: policies.tier2Attempts,
          tier2LockoutMinutes: policies.tier2LockoutMinutes,
          cooldownMinutes: policies.cooldownMinutes,
          ipBlockingEnabled: policies.ipBlockingEnabled,
          requireStrongPasswords: policies.requireStrongPasswords,
          minPasswordLength: policies.minPasswordLength
        }
      }
    })

    if (res?.success) {
      adminSession.timeoutHours.value = policies.sessionTimeoutHours
      if (typeof window !== 'undefined') {
        localStorage.setItem('cozmic_admin_timeout_hours', String(policies.sessionTimeoutHours))
      }
      useToast().success(res.message || 'Security & access policies saved to database.')
      fetchSecurityData()
    }
  } catch (err) {
    useToast().error(err.data?.statusMessage || err.message || 'Failed to save security policies.')
  } finally {
    savingSecurity.value = false
  }
}

const submitBlockIp = async () => {
  if (!blockForm.ip) return
  blockingLoading.value = true
  try {
    const res = await useNuxtApp().$fetch('/api/admin/security', {
      method: 'POST',
      body: {
        action: 'block_ip',
        ip: blockForm.ip,
        reason: blockForm.reason
      }
    })

    if (res?.success) {
      useToast().success(res.message || `IP ${blockForm.ip} blocked successfully.`)
      showBlockModal.value = false
      blockForm.ip = ''
      blockForm.reason = ''
      fetchSecurityData()
    }
  } catch (err) {
    useToast().error(err.data?.statusMessage || err.message || 'Failed to block IP address.')
  } finally {
    blockingLoading.value = false
  }
}

const unblockIp = async (ip) => {
  if (!confirm(`Are you sure you want to unblock IP ${ip}?`)) return
  unblockingIp.value = ip
  try {
    const res = await useNuxtApp().$fetch('/api/admin/security', {
      method: 'POST',
      body: {
        action: 'unblock_ip',
        ip
      }
    })

    if (res?.success) {
      useToast().success(res.message || `IP ${ip} has been unblocked.`)
      fetchSecurityData()
    }
  } catch (err) {
    useToast().error(err.data?.statusMessage || err.message || 'Failed to unblock IP address.')
  } finally {
    unblockingIp.value = null
  }
}

const clearLogs = async () => {
  if (!confirm('Are you sure you want to clear all security audit logs? This action will be audited.')) return
  try {
    const res = await useNuxtApp().$fetch('/api/admin/security', {
      method: 'POST',
      body: { action: 'clear_logs' }
    })
    if (res?.success) {
      useToast().success('Security audit logs cleared successfully.')
      fetchSecurityData()
    }
  } catch (err) {
    useToast().error('Failed to clear logs.')
  }
}

// Log Formatting Helpers
const formatLogDate = (isoStr) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString()
}

const formatActionName = (action) => {
  if (!action) return 'EVENT'
  return action.replace(/_/g, ' ')
}

const getActionIcon = (action) => {
  const act = (action || '').toUpperCase()
  if (act.includes('LOGIN_SUCCESS')) return 'lucide:check-circle'
  if (act.includes('LOGOUT')) return 'lucide:log-out'
  if (act.includes('FAILED')) return 'lucide:alert-circle'
  if (act.includes('LOCKOUT')) return 'lucide:lock'
  if (act.includes('BLOCKED_ACCESS')) return 'lucide:shield-ban'
  if (act.includes('IP_BLOCKED')) return 'lucide:ban'
  if (act.includes('IP_UNBLOCKED')) return 'lucide:unlock'
  if (act.includes('SECURITY_POLICY')) return 'lucide:sliders'
  if (act.includes('PASSWORD')) return 'lucide:key'
  if (act.includes('ADMIN_ACTION')) return 'lucide:user-check'
  return 'lucide:activity'
}

const getActionBadgeClass = (log) => {
  const act = (log.action || '').toUpperCase()
  const sev = log.severity || 'info'

  if (act.includes('LOGIN_SUCCESS')) {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  }
  if (act.includes('LOGOUT')) {
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }
  if (act.includes('FAILED')) {
    return 'bg-amber-50 text-amber-800 border-amber-200'
  }
  if (act.includes('LOCKOUT') || sev === 'danger') {
    return 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200'
  }
  if (act.includes('BLOCKED') || sev === 'critical') {
    return 'bg-red-100 text-red-900 border-red-300 ring-1 ring-red-300 animate-pulse'
  }
  if (act.includes('SECURITY_POLICY') || act.includes('ADMIN')) {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200'
  }
  return 'bg-blue-50 text-blue-800 border-blue-200'
}

const getDeviceIcon = (deviceType) => {
  const dt = (deviceType || '').toLowerCase()
  if (dt === 'mobile') return 'lucide:smartphone'
  if (dt === 'tablet') return 'lucide:tablet'
  return 'lucide:monitor'
}

// Log Categories & Filter Computation
const logCategories = computed(() => {
  const allCount = securityLogs.value.length
  const loginsCount = securityLogs.value.filter(l => 
    ['LOGIN_SUCCESS', 'LOGOUT', 'LOGIN_FAILED'].includes(l.action)
  ).length
  const securityCount = securityLogs.value.filter(l => 
    l.action.includes('LOCKOUT') || l.action.includes('BLOCKED') || l.severity === 'danger' || l.severity === 'critical'
  ).length
  const adminCount = securityLogs.value.filter(l => 
    ['SECURITY_POLICY_UPDATE', 'ADMIN_ACTION', 'PASSWORD_CHANGE', 'AUDIT_LOGS_CLEARED'].includes(l.action)
  ).length

  return [
    { id: 'all', label: 'All Activities', count: allCount },
    { id: 'logins', label: 'Logins & Logouts', count: loginsCount },
    { id: 'security', label: 'Lockouts & Blocks', count: securityCount },
    { id: 'admin', label: 'Admin Actions', count: adminCount }
  ]
})

const filteredLogs = computed(() => {
  let list = securityLogs.value

  // Category Filter
  if (selectedCategory.value === 'logins') {
    list = list.filter(l => ['LOGIN_SUCCESS', 'LOGOUT', 'LOGIN_FAILED'].includes(l.action))
  } else if (selectedCategory.value === 'security') {
    list = list.filter(l => l.action.includes('LOCKOUT') || l.action.includes('BLOCKED') || l.severity === 'danger' || l.severity === 'critical')
  } else if (selectedCategory.value === 'admin') {
    list = list.filter(l => ['SECURITY_POLICY_UPDATE', 'ADMIN_ACTION', 'PASSWORD_CHANGE', 'AUDIT_LOGS_CLEARED'].includes(l.action))
  }

  // Text Search
  if (logSearch.value.trim()) {
    const q = logSearch.value.trim().toLowerCase()
    list = list.filter(l => 
      (l.identifier && l.identifier.toLowerCase().includes(q)) ||
      (l.ip && l.ip.toLowerCase().includes(q)) ||
      (l.action && l.action.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q))
    )
  }

  return list
})

onMounted(() => {
  fetchSecurityData()
})
</script>
