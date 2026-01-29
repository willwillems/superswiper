import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'

/**
 * Composable for trapping focus within a container element.
 * Useful for modals and dialogs to maintain focus within the component.
 */
export function useFocusTrap(containerRef: Ref<HTMLElement | null>, isActive: Ref<boolean>) {
  const previousActiveElement = ref<HTMLElement | null>(null)

  function getFocusableElements(): HTMLElement[] {
    if (!containerRef.value) return []

    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(containerRef.value.querySelectorAll<HTMLElement>(selectors))
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !isActive.value || !containerRef.value) return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) return

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  function focusFirst() {
    const focusableElements = getFocusableElements()
    const firstElement = focusableElements[0]
    if (firstElement) {
      firstElement.focus()
    }
  }

  function savePreviousFocus() {
    previousActiveElement.value = document.activeElement as HTMLElement
  }

  function restorePreviousFocus() {
    if (previousActiveElement.value && typeof previousActiveElement.value.focus === 'function') {
      previousActiveElement.value.focus()
    }
  }

  watch(isActive, (active) => {
    if (active) {
      savePreviousFocus()
      requestAnimationFrame(() => focusFirst())
    } else {
      restorePreviousFocus()
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    if (isActive.value) {
      restorePreviousFocus()
    }
  })

  return {
    focusFirst,
    restorePreviousFocus,
  }
}

/**
 * Composable for handling Escape key to close dialogs/modals.
 */
export function useEscapeKey(isActive: Ref<boolean>, onEscape: () => void) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isActive.value) {
      event.preventDefault()
      onEscape()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}

/**
 * Generates a unique ID for ARIA attributes.
 */
let idCounter = 0
export function useUniqueId(prefix = 'a11y'): string {
  return `${prefix}-${++idCounter}`
}
