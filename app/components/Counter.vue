<template>
  <span ref="counterRef">{{ currentCount }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  target: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1500
  }
})

const currentCount = ref(0)
const counterRef = ref(null)
let observer = null
let animationFrame = null

const animateCount = () => {
  const startTime = performance.now()
  const startVal = 0
  const endVal = props.target

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // Ease out quad
    const easeProgress = progress * (2 - progress)
    currentCount.value = Math.floor(startVal + easeProgress * (endVal - startVal))

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step)
    } else {
      currentCount.value = endVal
    }
  }
  animationFrame = requestAnimationFrame(step)
}

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount()
          if (observer) observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    
    if (counterRef.value) {
      observer.observe(counterRef.value)
    }
  } else {
    currentCount.value = props.target
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (animationFrame) cancelAnimationFrame(animationFrame)
})
</script>
