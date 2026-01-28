import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/pages/AuthPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'swipe',
      component: () => import('@/pages/SwipePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('@/pages/AddPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items',
      name: 'items',
      component: () => import('@/pages/ItemsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/box/:boxId',
      name: 'items-box',
      component: () => import('@/pages/ItemsDetailPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/category/:category',
      name: 'items-category',
      component: () => import('@/pages/ItemsDetailPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const { waitForAuth, isAuthenticated } = useAuth()

  await waitForAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'auth' }
  }

  if (to.name === 'auth' && isAuthenticated.value) {
    return { name: 'swipe' }
  }
})

export default router
