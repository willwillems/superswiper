<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  trigger: boolean
}>()

const emit = defineEmits<{
  complete: []
}>()

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  delay: number
}

const particles = ref<Particle[]>([])
const isActive = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const colors = [
  '#10B981', // keep green
  '#34D399', // keep green light
  '#8B5CF6', // accent violet
  '#A78BFA', // accent violet light
  '#F43F5E', // discard rose
  '#FB7185', // discard rose light
  '#FBBF24', // yellow
  '#60A5FA', // blue
]

function createParticles() {
  const newParticles: Particle[] = []
  const particleCount = 50

  for (let i = 0; i < particleCount; i++) {
    newParticles.push({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400 - 200,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 200,
    })
  }

  return newParticles
}

function triggerConfetti() {
  isActive.value = true
  particles.value = createParticles()

  timeoutId = setTimeout(() => {
    isActive.value = false
    particles.value = []
    emit('complete')
  }, 2000)
}

watch(
  () => props.trigger,
  (newVal) => {
    if (newVal && !isActive.value) {
      triggerConfetti()
    }
  }
)

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isActive" class="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div class="absolute left-1/2 top-1/2">
        <div
          v-for="particle in particles"
          :key="particle.id"
          class="confetti-particle absolute h-3 w-3 rounded-sm"
          :style="{
            backgroundColor: particle.color,
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
            '--rotation': `${particle.rotation}deg`,
            '--scale': particle.scale,
            '--delay': `${particle.delay}ms`,
          }"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confetti-particle {
  animation: confetti-fall 2s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(var(--scale));
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), calc(var(--y) + 100vh)) rotate(var(--rotation)) scale(var(--scale));
  }
}
</style>
