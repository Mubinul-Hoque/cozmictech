<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans antialiased">
    <!-- Cosmic Background Glowing Orbs -->
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] bg-[#feb900]/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] bg-indigo-600/5 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
    <div class="absolute top-10 right-20 w-80 h-80 rounded-full blur-[100px] bg-[#8b5cf6]/5 pointer-events-none"></div>

    <div class="max-w-md w-full mx-4 relative z-10 animate-fade-in">
      <!-- Main Login Container (Glassmorphism card) -->
      <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <!-- Golden accent brand strip -->
        <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-[#feb900] to-violet-600"></div>

        <div class="text-center mb-8">
          <!-- Shield Key Icon -->
          <div class="mx-auto w-16 h-16 bg-[#feb900] rounded-2xl shadow-lg shadow-amber-500/10 flex items-center justify-center transform hover:scale-105 transition-all duration-300 border border-amber-300/25">
            <i class="bi bi-shield-lock-fill text-slate-950 text-2xl"></i>
          </div>
          
          <h2 class="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cozmic<span class="text-[#feb900]">.</span>Admin
          </h2>
          <p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Security Gateway
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Failure Notification Banner -->
          <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 animate-shake text-sm">
            <div class="flex items-start">
              <i class="bi bi-x-circle text-rose-400 text-lg leading-none mt-0.5"></i>
              <div class="ml-3">
                <h4 class="font-bold text-rose-300">Access Denied</h4>
                <p class="mt-1 text-slate-300 text-xs leading-relaxed">{{ errorMsg }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i class="bi bi-envelope text-slate-500 text-base"></i>
                </div>
                <input 
                  id="email" 
                  v-model="email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="block w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]/50 transition-all duration-300 text-sm" 
                  placeholder="admin@cozmictech.com" 
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i class="bi bi-lock text-slate-500 text-base"></i>
                </div>
                <input 
                  id="password" 
                  v-model="password" 
                  name="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  autocomplete="current-password" 
                  required 
                  class="block w-full pl-10 pr-12 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]/50 transition-all duration-300 text-sm" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none cursor-pointer z-10"
                >
                  <i class="bi text-lg" :class="showPassword ? 'bi-eye' : 'bi-eye-slash'"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div>
            <button 
              type="submit" 
              :disabled="loading" 
              class="group relative w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-amber-400 to-[#feb900] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-full transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-4">
                <i v-if="!loading" class="bi bi-box-arrow-in-right text-base transition-transform duration-300 group-hover:translate-x-0.5"></i>
                <i v-else class="bi bi-arrow-repeat animate-spin text-base"></i>
              </span>
              {{ loading ? 'Securing Session...' : 'Authenticate' }}
            </button>
          </div>
        </form>

        <!-- Return to website link -->
        <div class="mt-8 border-t border-white/10 pt-6">
          <NuxtLink 
            to="/" 
            class="flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider gap-2"
          >
            <i class="bi bi-arrow-left text-sm"></i> Return to Site
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: false
});

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMsg = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;
  
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    });
    
    if (response.success) {
      const authUser = useState('authUser');
      authUser.value = response.user;
      router.push('/admin');
    }
  } catch (error) {
    if (error.data && error.data.statusMessage) {
      errorMsg.value = error.data.statusMessage;
    } else {
      errorMsg.value = 'Invalid login credentials. Access denied.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
