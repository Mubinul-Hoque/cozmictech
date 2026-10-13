<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
    class="inline-flex items-center gap-2.5 cursor-pointer select-none focus:outline-none"
  >
    <span
      class="text-[11px] font-bold uppercase tracking-wider"
      :class="modelValue ? 'text-emerald-600' : 'text-slate-400'"
    >
      {{ modelValue ? 'Visible' : 'Hidden' }}
    </span>
    <span
      class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 transition-colors duration-200 ease-in-out"
      :class="modelValue ? 'bg-[#feb900] border-[#feb900]' : 'bg-slate-200 border-slate-300'"
    >
      <span
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      ></span>
    </span>
  </button>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})
defineEmits(['update:modelValue'])
</script>
