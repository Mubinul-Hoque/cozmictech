<template>
  <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-80 max-w-[calc(100vw-3rem)]">
    <TransitionGroup 
      name="toast" 
      tag="div"
      class="flex flex-col gap-3"
    >
      <div 
        v-for="toast in toast.toasts.value" 
        :key="toast.id"
        class="pointer-events-auto overflow-hidden rounded-xl shadow-lg border backdrop-blur-md flex items-start p-4 transition-all"
        :class="{
          'bg-white/95 border-emerald-200 shadow-emerald-500/10': toast.type === 'success',
          'bg-white/95 border-red-200 shadow-red-500/10': toast.type === 'error',
          'bg-white/95 border-blue-200 shadow-blue-500/10': toast.type === 'info'
        }"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mr-3 mt-0.5">
          <Icon v-if="toast.type === 'success'" name="lucide:check-circle-2" class="text-emerald-500 text-lg" />
          <Icon v-else-if="toast.type === 'error'" name="lucide:alert-triangle" class="text-red-500 text-lg" />
          <Icon v-else name="lucide:info" class="text-blue-500 text-lg" />
        </div>
        
        <!-- Message -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-800 leading-snug">
            {{ toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification' }}
          </p>
          <p class="text-xs text-slate-500 mt-0.5 break-words">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close button -->
        <button 
          @click="toast.remove(toast.id)" 
          class="flex-shrink-0 ml-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          <Icon name="lucide:x" class="text-xl leading-none" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
const toast = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.95);
  margin-bottom: -1rem; /* Collapse space when leaving */
}
</style>
