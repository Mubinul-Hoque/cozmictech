<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans antialiased">
    <!-- Cosmic Background Glowing Orbs -->
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] bg-[#feb900]/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] bg-indigo-600/5 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
    <div class="absolute top-10 right-20 w-80 h-80 rounded-full blur-[100px] bg-[#8b5cf6]/5 pointer-events-none"></div>

    <div class="max-w-md w-full mx-4 relative z-10 animate-fade-in">
      <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-[#feb900] to-violet-600"></div>

        <div class="text-center mb-8">
          <div class="mx-auto w-16 h-16 bg-[#feb900] rounded-2xl shadow-lg shadow-amber-500/10 flex items-center justify-center transform hover:scale-105 transition-all duration-300 border border-amber-300/25">
            <Icon name="lucide:shield-check" class="text-slate-950 text-2xl" />
          </div>

          <h2 class="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Set New Password
          </h2>
          <p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Admin Account Recovery
          </p>
        </div>

        <!-- Missing Token -->
        <div v-if="!token" class="space-y-6">
          <div class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm">
            <div class="flex items-start">
              <Icon name="lucide:x-circle" class="text-rose-400 text-lg leading-none mt-0.5 flex-shrink-0" />
              <div class="ml-3">
                <h4 class="font-bold text-rose-300">Invalid Reset Link</h4>
                <p class="mt-1 text-slate-300 text-xs leading-relaxed">This password reset link is missing its token. Please request a new one.</p>
              </div>
            </div>
          </div>
          <NuxtLink to="/admin/forgot-password" class="block text-center text-xs font-bold text-[#feb900] hover:text-amber-400 transition-colors uppercase tracking-wider">
            Request New Reset Link
          </NuxtLink>
        </div>

        <!-- Success State -->
        <div v-else-if="submitted" class="space-y-6">
          <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm animate-fade-in">
            <div class="flex items-start">
              <Icon name="lucide:check-circle" class="text-emerald-400 text-lg leading-none mt-0.5 flex-shrink-0" />
              <div class="ml-3">
                <h4 class="font-bold text-emerald-300">Password Reset Successful</h4>
                <p class="mt-1 text-slate-300 text-xs leading-relaxed">{{ successMsg }}</p>
              </div>
            </div>
          </div>
          <NuxtLink to="/admin/login" class="block text-center text-xs font-bold text-[#feb900] hover:text-amber-400 transition-colors uppercase tracking-wider">
            Go to Login
          </NuxtLink>
        </div>

        <!-- Reset Form -->
        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="errorMsg" class="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 animate-shake text-sm">
            <div class="flex items-start">
              <Icon name="lucide:x-circle" class="text-rose-400 text-lg leading-none mt-0.5 flex-shrink-0" />
              <div class="ml-3">
                <h4 class="font-bold text-rose-300">Reset Failed</h4>
                <p class="mt-1 text-slate-300 text-xs leading-relaxed">{{ errorMsg }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-5">
            <!-- New Password -->
            <div>
              <label for="password" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Icon name="lucide:lock" class="text-slate-500 text-base" />
                </div>
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  minlength="8"
                  class="block w-full pl-10 pr-12 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]/50 transition-all duration-300 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none cursor-pointer z-10"
                >
                  <Icon :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" class="text-lg" />
                </button>
              </div>
              <p class="mt-1.5 text-[11px] text-slate-500">Minimum 8 characters.</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Icon name="lucide:lock" class="text-slate-500 text-base" />
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  name="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  class="block w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900]/50 transition-all duration-300 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-amber-400 to-[#feb900] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-full transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-4">
                <Icon v-if="!loading" name="lucide:check" class="text-base transition-transform duration-300 group-hover:translate-x-0.5" />
                <Icon v-else name="lucide:loader-2" class="animate-spin text-base" />
              </span>
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>

        <div v-if="!submitted" class="mt-8 border-t border-white/10 pt-6">
          <NuxtLink
            to="/admin/login"
            class="flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider gap-2"
          >
            <Icon name="lucide:arrow-left" class="text-sm" /> Back to Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  layout: false
});

const route = useRoute();
const token = computed(() => String(route.query.token || ''));

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const submitted = ref(false);

const handleSubmit = async () => {
  errorMsg.value = '';

  if (password.value.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters long.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;

  try {
    const response = await useNuxtApp().$fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, password: password.value }
    });

    successMsg.value = response.message || 'Your password has been reset successfully. You may now log in.';
    submitted.value = true;
  } catch (error) {
    if (error.data && error.data.statusMessage) {
      errorMsg.value = error.data.statusMessage;
    } else {
      errorMsg.value = 'Something went wrong. Please try again.';
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
