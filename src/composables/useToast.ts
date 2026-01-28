import { ref, readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

const TOAST_DURATION = 4000

let toastId = 0
const toasts = ref<Toast[]>([])

export function useToast() {
  function addToast(message: string, type: ToastType = 'info') {
    const id = ++toastId
    toasts.value.push({ id, message, type })

    setTimeout(() => removeToast(id), TOAST_DURATION)
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string) {
    addToast(message, 'success')
  }

  function error(message: string) {
    addToast(message, 'error')
  }

  function info(message: string) {
    addToast(message, 'info')
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    info,
  }
}
