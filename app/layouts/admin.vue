<template>
  <div class="flex h-screen bg-[#f8f9fa] font-sans antialiased text-slate-800 overflow-hidden">
    <!-- Global Admin Notifications -->
    <AdminToast />
    
    <!-- Admin Inactivity Auto-Logout Warning Modal -->
    <AdminSessionWarning />
    
    <!-- Backdrop Overlay for Mobile Sidebar -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false" 
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 w-64 bg-[#364d59] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-[#364d59]/20 shadow-xl z-30 md:relative"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <!-- Top header line or subtle shine -->
      <div class="absolute inset-x-0 top-0 h-1 bg-[#feb900] pointer-events-none"></div>
      
      <!-- Brand Logo Section -->
      <div class="h-20 flex items-center justify-between px-6 z-10 border-b border-[#ffffff]/10">
        <NuxtLink to="/" class="flex items-center group" @click="sidebarOpen = false">
          <div class="w-9 h-9 bg-[#feb900] rounded-full flex items-center justify-center mr-3 shadow-md group-hover:scale-105 transition-transform duration-200">
            <Icon name="lucide:shield-check" class="text-[#364d59] text-lg" />
          </div>
          <span class="text-xl font-bold tracking-tight text-white group-hover:text-[#feb900] transition-colors duration-200">
            Cozmic<span class="text-[#feb900]">.</span>Admin
          </span>
        </NuxtLink>
        
        <!-- Mobile Sidebar Close Button -->
        <button 
          @click="sidebarOpen = false" 
          class="md:hidden text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <Icon name="lucide:x" class="text-2xl" />
        </button>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 z-10 space-y-1">
        <ul class="space-y-1.5">
          <li v-if="can('dashboard')">
            <NuxtLink to="/admin" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:gauge" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Overview
            </NuxtLink>
          </li>
          <li v-if="can('contact')">
            <NuxtLink to="/admin/messages" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:mail" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Inbox Messages
            </NuxtLink>
          </li>
          
          <li v-if="hasContentAccess" class="px-5 pt-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Content Manager
          </li>
          
          <!-- Collapsible Pages Dropdown -->
          <li v-if="hasPagesAccess">
            <button 
              type="button" 
              @click="pagesOpen = !pagesOpen"
              class="w-full group flex items-center justify-between px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none select-none cursor-pointer"
              :class="{ 'text-white bg-white/10 font-semibold': isPagesActive }"
            >
              <div class="flex items-center">
                <Icon name="lucide:layers" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" :class="isPagesActive ? 'text-[#feb900]' : 'text-slate-300'" />
                <span>Pages</span>
              </div>
              <Icon 
                name="lucide:chevron-down" 
                class="text-base transition-transform duration-200 text-slate-400 group-hover:text-white"
                :class="{ 'rotate-180': pagesOpen }"
              />
            </button>

            <!-- Collapsible Sub-menu -->
            <transition
              enter-active-class="transition-all duration-200 ease-out overflow-hidden"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-150 ease-in overflow-hidden"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="pagesOpen" class="mt-1 pl-4 pr-1">
                <ul class="border-l-2 border-white/10 pl-2 space-y-1 py-1">
                  <li v-if="can('pages')">
                    <NuxtLink 
                      to="/admin/about" 
                      class="group flex items-center px-3.5 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" 
                      active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" 
                      @click="sidebarOpen = false"
                    >
                      <Icon name="lucide:file-user" class="mr-3 text-base group-hover:scale-110 transition-transform duration-200" />
                      About
                    </NuxtLink>
                  </li>
                  <li v-if="can('services')">
                    <NuxtLink 
                      to="/admin/services" 
                      class="group flex items-center px-3.5 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" 
                      active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" 
                      @click="sidebarOpen = false"
                    >
                      <Icon name="lucide:server" class="mr-3 text-base group-hover:scale-110 transition-transform duration-200" />
                      Services
                    </NuxtLink>
                  </li>
                  <li v-if="can('blog')">
                    <NuxtLink 
                      to="/admin/blog" 
                      class="group flex items-center px-3.5 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" 
                      active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" 
                      @click="sidebarOpen = false"
                    >
                      <Icon name="lucide:book-open-text" class="mr-3 text-base group-hover:scale-110 transition-transform duration-200" />
                      Blog
                    </NuxtLink>
                  </li>
                  <li v-if="can('careers')">
                    <NuxtLink 
                      to="/admin/career" 
                      class="group flex items-center px-3.5 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" 
                      active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" 
                      @click="sidebarOpen = false"
                    >
                      <Icon name="lucide:briefcase" class="mr-3 text-base group-hover:scale-110 transition-transform duration-200" />
                      Careers
                    </NuxtLink>
                  </li>
                  <li v-if="can('contact')">
                    <NuxtLink 
                      to="/admin/contact" 
                      class="group flex items-center px-3.5 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" 
                      active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" 
                      @click="sidebarOpen = false"
                    >
                      <Icon name="lucide:phone-call" class="mr-3 text-base group-hover:scale-110 transition-transform duration-200" />
                      Contact
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </transition>
          </li>

          <li v-if="can('projects')">
            <NuxtLink to="/admin/projects" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:briefcase" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Portfolio Projects
            </NuxtLink>
          </li>
          <li v-if="can('clients')">
            <NuxtLink to="/admin/clients" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:handshake" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Clients
            </NuxtLink>
          </li>
          <li v-if="can('advanced_search')">
            <NuxtLink to="/admin/advanced-search" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:sliders-horizontal" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Advanced Search
            </NuxtLink>
          </li>
          <li v-if="can('testimonials')">
            <NuxtLink to="/admin/testimonials" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:message-square-quote" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Testimonials
            </NuxtLink>
          </li>
          <li v-if="can('team')">
            <NuxtLink to="/admin/team" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:users" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Team Members
            </NuxtLink>
          </li>
          <li v-if="can('global_settings')">
            <NuxtLink to="/admin/settings" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:settings" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Global Settings
            </NuxtLink>
          </li>
          
          <li v-if="hasAccessSection" class="px-5 pt-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Analytics &amp; Access
          </li>
          <li v-if="can('visitor_analytics')">
            <NuxtLink to="/admin/analytics" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:bar-chart-2" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Visitor Analytics
            </NuxtLink>
          </li>
          <li v-if="can('users_roles')">
            <NuxtLink to="/admin/users" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:user-cog" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Users &amp; Roles
            </NuxtLink>
          </li>
          <li v-if="can('security')">
            <NuxtLink to="/admin/security" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <Icon name="lucide:shield-check" class="mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200" />
              Security &amp; Policies
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- Bottom Logout Section -->
      <div class="p-4 border-t border-[#ffffff]/10 z-10 bg-[#364d59]/50">
        <button @click="logout" class="group w-full flex items-center justify-center px-4 py-2.5 bg-white/5 hover:bg-red-500/15 text-slate-300 hover:text-red-300 rounded-full border border-transparent hover:border-red-500/30 transition-all duration-200 text-sm font-semibold">
          <Icon name="lucide:log-out" class="mr-2.5 group-hover:-translate-x-0.5 transition-transform duration-200 text-lg" /> 
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8f9fa] relative w-full">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" style="background-color: rgba(254, 185, 0, 0.04);"></div>

      <!-- Top header -->
      <header class="h-20 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10">
        <div class="flex items-center">
          <!-- Mobile Menu Toggle Button -->
          <button 
            @click="sidebarOpen = !sidebarOpen" 
            class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors md:hidden mr-2"
          >
            <Icon name="lucide:menu" class="text-2xl" />
          </button>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">{{ route?.meta?.title || 'Overview' }}</h2>
          </div>
        </div>
        <div class="flex items-center space-x-3 sm:space-x-6">
          <!-- Session Auto-Logout Indicator Badge -->
          <NuxtLink 
            to="/admin/settings" 
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition-colors text-xs font-semibold cursor-pointer"
            :title="`Auto-logout configured to ${adminSession.timeoutHours.value} hour${adminSession.timeoutHours.value > 1 ? 's' : ''}`"
          >
            <Icon name="lucide:shield-check" class="text-amber-500 text-sm" />
            <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Timeout: {{ adminSession.timeoutHours.value }}h</span>
          </NuxtLink>

          <button class="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-[#364d59] hover:bg-slate-100 rounded-full transition-all duration-200">
            <Icon name="lucide:bell" class="text-lg" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-[#feb900] rounded-full border-2 border-white animate-pulse"></span>
          </button>
          <div class="h-8 w-px bg-slate-200"></div>
          
          <!-- User Profile Dropdown Box -->
          <div class="flex items-center gap-2 sm:gap-3 cursor-pointer group p-1 sm:p-1.5 rounded-full hover:bg-slate-100 transition-all duration-200">
            <div class="hidden sm:flex flex-col items-end pl-2">
              <span class="text-sm font-bold text-slate-700 group-hover:text-[#364d59] transition-colors leading-tight">{{ authUser?.username || 'Admin' }}</span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mt-0.5">{{ authUser?.role || 'Administrator' }}</span>
            </div>
            <div class="w-9 h-9 rounded-full bg-[#feb900] text-slate-900 font-bold flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-200">
              <Icon name="lucide:user" class="text-lg" />
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto p-4 sm:p-8 z-10 scroll-smooth">
        <div class="max-w-7xl mx-auto animate-fade-in-up">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';

const authUser = useState('authUser');
const { can, isSuperAdmin } = usePermissions();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(false);
const adminSession = useAdminSession();

const pagesOpen = ref(false);

const hasPagesAccess = computed(() => {
  return can('pages') || can('services') || can('blog') || can('careers') || can('contact');
});

const hasContentAccess = computed(() => {
  return (
    hasPagesAccess.value ||
    can('projects') ||
    can('clients') ||
    can('advanced_search') ||
    can('testimonials') ||
    can('team') ||
    can('global_settings')
  );
});

const hasAccessSection = computed(() => {
  return can('visitor_analytics') || can('users_roles') || can('security');
});

const isPagesActive = computed(() => {
  const p = route.path;
  return (
    p.startsWith('/admin/about') ||
    p.startsWith('/admin/services') ||
    p.startsWith('/admin/blog') ||
    p.startsWith('/admin/career') ||
    p.startsWith('/admin/contact')
  );
});

onMounted(() => {
  adminSession.initSessionWatcher();
  if (isPagesActive.value) {
    pagesOpen.value = true;
  }
});

watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath && isPagesActive.value) {
    pagesOpen.value = true;
  }
});

onUnmounted(() => {
  adminSession.cleanupSessionWatcher();
});

const { data: commonData } = await useFetch('/api/common')
useHead({
  link: [
    {
      rel: 'icon',
      type: () => commonData.value?.homepage?.favicon?.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
      href: () => commonData.value?.homepage?.favicon ? `/assets/img/${commonData.value.homepage.favicon}` : '/assets/img/favicon.svg'
    }
  ],
  bodyAttrs: {
    class: () => commonData.value?.homepage?.theme || 'theme-default'
  }
})

const logout = () => {
  adminSession.logout(false);
};
</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
