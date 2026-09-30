<template>
  <Transition name="fade-slide">
    <div 
      v-if="showWarning" 
      class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div 
        class="bg-white rounded-3xl shadow-2xl border border-amber-200/80 max-w-md w-full p-6 sm:p-8 relative overflow-hidden text-center animate-scale-up"
      >
        <!-- Top accent banner -->
        <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#feb900] to-amber-500"></div>

        <!-- Animated icon -->
        <div class="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 relative shadow-sm">
          <Icon name="lucide:clock-alert" class="text-amber-500 text-3xl animate-pulse" />
          <span class="absolute -top-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-[#feb900]"></span>
          </span>
        </div>

        <!-- Title & description -->
        <h3 class="text-xl font-extrabold text-slate-800 tracking-tight">
          Session Expiring Soon
        </h3>
        <p class="mt-2 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          For security, your admin session will automatically log out due to inactivity in:
        </p>

        <!-- Countdown badge -->
        <div class="my-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700">
          <Icon name="lucide:timer" class="text-lg animate-spin" style="animation-duration: 4s;" />
          <span class="text-2xl font-black font-mono tracking-tight text-amber-600">
            {{ remainingSeconds }}
          </span>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600/80">seconds</span>
        </div>

        <p class="text-[11px] text-slate-400 mb-6 font-semibold">
          Click below or move your mouse / type to stay logged in.
        </p>

        <!-- Action buttons -->
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            @click="logout(false)" 
            class="flex-1 py-3 px-4 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            Log Out Now
          </button>
          <button 
            type="button" 
            @click="extendSession" 
            class="flex-1 py-3 px-4 rounded-full bg-[#feb900] hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Icon name="lucide:check-circle" class="text-sm" />
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { showWarning, remainingSeconds, extendSession, logout } = useAdminSession();
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
