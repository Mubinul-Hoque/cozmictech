<template>
  <div class="flex h-screen bg-[#f8f9fa] font-sans antialiased text-slate-800 overflow-hidden">
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
            <i class="bi bi-shield-lock-fill text-[#364d59] text-lg"></i>
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
          <i class="bi bi-x text-2xl"></i>
        </button>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 z-10 space-y-1">
        <ul class="space-y-1.5">
          <li>
            <NuxtLink to="/admin" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-speedometer2 mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Overview
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/messages" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-envelope mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Inbox Messages
            </NuxtLink>
          </li>
          
          <li class="px-5 pt-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Content Manager
          </li>
          <li>
            <NuxtLink to="/admin/blog" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-journal-text mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Blog Articles
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/projects" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-briefcase mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Portfolio Projects
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/testimonials" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-chat-quote mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Testimonials
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/team" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-people mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Team Members
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/services" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-hdd-network mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Services
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/settings" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-gear mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Global Settings
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/about" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-file-earmark-person mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              About Us Page
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/career" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-briefcase mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Career Openings
            </NuxtLink>
          </li>
          
          <li class="px-5 pt-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Access Control
          </li>
          <li>
            <NuxtLink to="/admin/users" class="group flex items-center px-4 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200" active-class="bg-[#feb900] text-slate-900 font-bold shadow-md shadow-amber-500/10" @click="sidebarOpen = false">
              <i class="bi bi-person-lock mr-3.5 text-lg group-hover:scale-110 transition-transform duration-200"></i>
              Administrators
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- Bottom Logout Section -->
      <div class="p-4 border-t border-[#ffffff]/10 z-10 bg-[#364d59]/50">
        <button @click="logout" class="group w-full flex items-center justify-center px-4 py-2.5 bg-white/5 hover:bg-red-500/15 text-slate-300 hover:text-red-300 rounded-full border border-transparent hover:border-red-500/30 transition-all duration-200 text-sm font-semibold">
          <i class="bi bi-box-arrow-right mr-2.5 group-hover:-translate-x-0.5 transition-transform duration-200 text-lg"></i> 
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
            <i class="bi bi-list text-2xl"></i>
          </button>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">{{ route?.meta?.title || 'Overview' }}</h2>
          </div>
        </div>
        <div class="flex items-center space-x-3 sm:space-x-6">
          <button class="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-[#364d59] hover:bg-slate-100 rounded-full transition-all duration-200">
            <i class="bi bi-bell text-lg"></i>
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
              <i class="bi bi-person-fill text-lg"></i>
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
const authUser = useState('authUser');
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(false);

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

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    authUser.value = null;
    router.push('/admin/login');
  } catch (error) {
    console.error('Logout failed', error);
  }
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
