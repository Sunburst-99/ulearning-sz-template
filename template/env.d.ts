/// <reference types="vite/client" />

declare module 'ulearning-obs/dist/obs-huawei.js'
declare module 'markdown-it-katex'

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_COOKIE_DOMAIN: string
  readonly VITE_ULEARNING_DOMAIN: string
  readonly VITE_API_HOST: string
  readonly VITE_DOCS_HOST: string
  readonly VITE_SZACCOUNT_API: string
  readonly VITE_COURSE_API: string
  readonly VITE_SZAI_HOST: string
  readonly VITE_AI_HOST: string
  readonly VITE_SJJX_HOST: string
  readonly VITE_SJJX_PORTAL_HOST: string
  readonly VITE_VR_HOST: string
  readonly VITE_VR_TEACH_HOST: string
  readonly VITE_ZYK_HOST: string
  readonly VITE_MOOCPEOPLE_HOST: string
  readonly VITE_UPLOAD_STRATEGY: 'standard' | 'local'
  readonly VITE_SHOW_FORGOT_PASSWORD: 'true' | 'false'
  readonly VITE_IS_PORTAL: 'true' | 'false'
}