import { computed, ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'superswiper-theme'

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getStoredTheme())

const resolvedTheme = computed<'light' | 'dark'>(() =>
  theme.value === 'system' ? getSystemTheme() : theme.value
)

const isDark = computed(() => resolvedTheme.value === 'dark')

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('light', resolved === 'light')
}

watchEffect(() => {
  applyTheme(resolvedTheme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (theme.value === 'system') {
    applyTheme(getSystemTheme())
  }
})

export function useTheme() {
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
