import type { InstantRules } from '@instantdb/core'

const rules = {
  items: {
    allow: {
      view: 'isOwner',
      create: 'isLoggedIn',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: {
      isLoggedIn: 'auth.id != null',
      isOwner: "auth.id in data.ref('owner.id')",
    },
  },
  boxes: {
    allow: {
      view: 'isOwner',
      create: 'isLoggedIn',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: {
      isLoggedIn: 'auth.id != null',
      isOwner: "auth.id in data.ref('owner.id')",
    },
  },
  $files: {
    allow: {
      view: 'true',
      create: 'isLoggedIn',
      delete: 'isLoggedIn',
    },
    bind: {
      isLoggedIn: 'auth.id != null',
    },
  },
} satisfies InstantRules

export default rules
