<script setup lang="ts">
export type ActionButtonVariant = 'keep' | 'discard' | 'undo'
export type ActionButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant: ActionButtonVariant
  size?: ActionButtonSize
  disabled?: boolean
  ariaLabel: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const sizeClasses: Record<ActionButtonSize, string> = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-16',
}

const iconSizeClasses: Record<ActionButtonSize, string> = {
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-7',
}

const variantStyles: Record<ActionButtonVariant, string> = {
  keep: 'bg-[var(--gradient-keep)]',
  discard: 'bg-[var(--gradient-discard)]',
  undo: 'bg-[var(--gradient-undo)]',
}

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    :class="[
      sizeClasses[size],
      variantStyles[variant],
      disabled
        ? 'cursor-not-allowed opacity-50 shadow-none'
        : 'hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md',
      variant === 'keep' && 'focus-visible:ring-keep',
      variant === 'discard' && 'focus-visible:ring-discard',
      variant === 'undo' && 'focus-visible:ring-undo',
    ]"
    :style="!disabled ? { background: `var(--gradient-${variant})` } : undefined"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <!-- Keep icon (checkmark) -->
    <svg
      v-if="variant === 'keep'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="iconSizeClasses[size]"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>

    <!-- Discard icon (X mark) -->
    <svg
      v-else-if="variant === 'discard'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="iconSizeClasses[size]"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>

    <!-- Undo icon (rotate left arrow) -->
    <svg
      v-else-if="variant === 'undo'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="iconSizeClasses[size]"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  </button>
</template>
