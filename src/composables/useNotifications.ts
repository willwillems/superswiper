import { ref, computed, watchEffect } from 'vue'

const STORAGE_KEY = 'superswiper-notifications-enabled'
const REMINDER_TIME_KEY = 'superswiper-reminder-time'

type NotificationPermission = 'default' | 'granted' | 'denied'

function getStoredNotificationsEnabled(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'true'
}

function getStoredReminderTime(): string {
  return localStorage.getItem(REMINDER_TIME_KEY) ?? '18:00'
}

const notificationsEnabled = ref(getStoredNotificationsEnabled())
const reminderTime = ref(getStoredReminderTime())
const permission = ref<NotificationPermission>('default')
const isRegistering = ref(false)

function updatePermissionState() {
  if ('Notification' in window) {
    permission.value = Notification.permission as NotificationPermission
  }
}

if (typeof window !== 'undefined') {
  updatePermissionState()
}

export function useNotifications() {
  const isSupported = computed(() => 'Notification' in window && 'serviceWorker' in navigator)
  const isGranted = computed(() => permission.value === 'granted')
  const isDenied = computed(() => permission.value === 'denied')
  const canEnable = computed(() => isSupported.value && !isDenied.value)

  async function requestPermission(): Promise<boolean> {
    if (!isSupported.value) return false

    try {
      const result = await Notification.requestPermission()
      permission.value = result as NotificationPermission
      return result === 'granted'
    } catch {
      return false
    }
  }

  async function registerServiceWorkerForPush(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null

    try {
      const registration = await navigator.serviceWorker.ready
      return registration
    } catch {
      return null
    }
  }

  async function scheduleReminder() {
    if (!isGranted.value || !notificationsEnabled.value) return

    const registration = await registerServiceWorkerForPush()
    if (!registration) return

    const timeParts = reminderTime.value.split(':').map(Number)
    const hours = timeParts[0] ?? 18
    const minutes = timeParts[1] ?? 0
    const now = new Date()
    const scheduledTime = new Date()
    scheduledTime.setHours(hours, minutes, 0, 0)

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    localStorage.setItem('superswiper-next-reminder', scheduledTime.toISOString())
  }

  async function enableNotifications(): Promise<boolean> {
    if (!canEnable.value) return false

    isRegistering.value = true
    try {
      const granted = await requestPermission()
      if (!granted) {
        isRegistering.value = false
        return false
      }

      notificationsEnabled.value = true
      await scheduleReminder()
      return true
    } catch {
      return false
    } finally {
      isRegistering.value = false
    }
  }

  function disableNotifications() {
    notificationsEnabled.value = false
    localStorage.removeItem('superswiper-next-reminder')
  }

  async function toggleNotifications(): Promise<boolean> {
    if (notificationsEnabled.value) {
      disableNotifications()
      return false
    }
    return enableNotifications()
  }

  function setReminderTime(time: string) {
    reminderTime.value = time
    if (notificationsEnabled.value && isGranted.value) {
      scheduleReminder()
    }
  }

  async function showTestNotification() {
    if (!isGranted.value) return

    const registration = await registerServiceWorkerForPush()
    if (registration) {
      await registration.showNotification('SuperSwiper Reminder', {
        body: 'Time to declutter! Your items are waiting to be sorted.',
        icon: '/favicon-96x96.png',
        badge: '/favicon-96x96.png',
        tag: 'superswiper-test',
        requireInteraction: false,
        data: { url: '/' },
      })
    } else {
      new Notification('SuperSwiper Reminder', {
        body: 'Time to declutter! Your items are waiting to be sorted.',
        icon: '/favicon-96x96.png',
        tag: 'superswiper-test',
      })
    }
  }

  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(notificationsEnabled.value))
  })

  watchEffect(() => {
    localStorage.setItem(REMINDER_TIME_KEY, reminderTime.value)
  })

  return {
    notificationsEnabled,
    reminderTime,
    permission,
    isSupported,
    isGranted,
    isDenied,
    canEnable,
    isRegistering,
    requestPermission,
    enableNotifications,
    disableNotifications,
    toggleNotifications,
    setReminderTime,
    showTestNotification,
    scheduleReminder,
  }
}
