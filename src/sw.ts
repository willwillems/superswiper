/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  /^https:\/\/api\.instantdb\.com\/.*/i,
  new NetworkFirst({
    cacheName: 'instantdb-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

registerRoute(
  /^https:\/\/storage\.instantdb\.com\/.*/i,
  new CacheFirst({
    cacheName: 'instantdb-storage-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

self.addEventListener('push', (event) => {
  const defaultOptions = {
    title: 'SuperSwiper Reminder',
    body: 'Time to declutter! Your items are waiting to be sorted.',
    icon: '/favicon-96x96.png',
    badge: '/favicon-96x96.png',
    tag: 'superswiper-reminder',
    requireInteraction: true,
    data: { url: '/' },
    actions: [
      { action: 'open', title: 'Start Sorting' },
      { action: 'dismiss', title: 'Later' },
    ],
  }

  let notificationData = defaultOptions

  if (event.data) {
    try {
      const payload = event.data.json()
      notificationData = { ...defaultOptions, ...payload }
    } catch {
      notificationData.body = event.data.text() || defaultOptions.body
    }
  }

  const options: NotificationOptions & { actions?: Array<{ action: string; title: string }> } = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    data: notificationData.data,
    actions: notificationData.actions,
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }
        return self.clients.openWindow(urlToOpen)
      })
  )
})

self.addEventListener('notificationclose', () => {
  // Optionally track notification dismissals
})
