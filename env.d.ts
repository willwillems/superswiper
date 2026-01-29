/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSTANT_APP_ID: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
