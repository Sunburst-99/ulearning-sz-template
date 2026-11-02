import 'normalize.css/normalize.css'

import { createApp } from 'vue'
import App from './App.vue'
import { setupStore, useAppStore } from './store'
import { setupRouter } from './router'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import '@/styles/vant.scss'
import initComponents from '@/components/init'
import 'virtual:svg-icons-register'
import initDirective from '@/directive/index'
import initThemeInfo from '@/utils/theme/init'

// fix：发版更新时代码资源报错无法切换路由
const PRELOAD_RETRY_KEY = 'vite-preload-retried'
window.addEventListener('vite:preloadError', () => {
  // 启动成功前只自动刷新一次，避免资源持续不可用时进入刷新循环。
  if (sessionStorage.getItem(PRELOAD_RETRY_KEY)) return
  sessionStorage.setItem(PRELOAD_RETRY_KEY, '1')
  window.location.reload()
})

async function bootstrap() {
  const app = createApp(App)
  setupStore(app)
  app.onUnmount(useAppStore().initResponsive())
  await setupRouter(app)
  initComponents(app)
  initDirective(app) //TODO 初始化指令(临时)
  initThemeInfo()
  app.mount('#app')
  sessionStorage.removeItem(PRELOAD_RETRY_KEY)
}

bootstrap()
