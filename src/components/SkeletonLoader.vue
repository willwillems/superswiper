<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}>()
</script>

<template>
  <div
    class="animate-pulse bg-surface/60"
    :class="[
      rounded === 'sm' && 'rounded-sm',
      rounded === 'md' && 'rounded-md',
      rounded === 'lg' && 'rounded-lg',
      rounded === 'xl' && 'rounded-xl',
      rounded === '2xl' && 'rounded-2xl',
      rounded === '3xl' && 'rounded-3xl',
      rounded === 'full' && 'rounded-full',
      !rounded && 'rounded-xl',
    ]"
    :style="{
      width: width || '100%',
      height: height || '1rem',
    }"
  />
</template>
