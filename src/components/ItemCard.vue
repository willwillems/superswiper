<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUpload } from '@/composables/useUpload'

const props = defineProps<{
  id: string
  name: string
  photoPath: string
}>()

defineEmits<{
  click: []
}>()

const { getImageUrl } = useUpload()
const imageUrl = ref<string | null>(null)

onMounted(async () => {
  imageUrl.value = await getImageUrl(props.photoPath)
})
</script>

<template>
  <button
    class="group relative aspect-square overflow-hidden rounded-xl bg-surface transition-transform active:scale-[0.98]"
    @click="$emit('click')"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="name"
      class="h-full w-full object-cover"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-surface"
    >
      <span class="animate-pulse text-text-muted">...</span>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2"
    >
      <span class="line-clamp-1 text-sm font-medium text-white">{{ name }}</span>
    </div>
  </button>
</template>
