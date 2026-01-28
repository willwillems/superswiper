import { i } from '@instantdb/core'

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    items: i.entity({
      name: i.string(),
      photoPath: i.string(),
      status: i.string().indexed(),
      createdAt: i.number().indexed(),
    }),
    boxes: i.entity({
      name: i.string(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    itemOwner: {
      forward: { on: 'items', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'many', label: 'items' },
    },
    itemBox: {
      forward: { on: 'items', has: 'one', label: 'box' },
      reverse: { on: 'boxes', has: 'many', label: 'items' },
    },
    boxOwner: {
      forward: { on: 'boxes', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'many', label: 'boxes' },
    },
  },
  rooms: {},
})

type _AppSchema = typeof _schema
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
