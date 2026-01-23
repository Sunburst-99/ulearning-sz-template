/// <reference types="vite/client" />

declare module 'ulearning-obs/dist/obs-huawei.js'

interface ImportMetaEnv {
  readonly VITE_COOKIE_DOMAIN: string
  readonly VITE_DOCS_HOST: string
  readonly VITE_UPLOAD_STRATEGY: 'standard' | 'local'
  readonly VITE_SZACCOUNT_API: string
  readonly VITE_COURSE_API: string
  readonly VITE_SHOW_FORGOT_PASSWORD: string
}