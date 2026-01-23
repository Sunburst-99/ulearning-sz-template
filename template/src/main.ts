import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
import '@/styles/element-variables.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import initComponents from '@/components/init'
import 'virtual:svg-icons-register'
import initDirective from '@/directive/index'
import initThemeInfo from '@/utils/theme/init'

// fix：发版更新时代码资源报错无法切换路由
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // 刷新页面
})

async function bootstrap() {
  const app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  setupStore(app)
  await setupRouter(app)
  initComponents(app)
  initDirective(app) //TODO 初始化指令(临时)
  initThemeInfo()
  app.mount('#app')
}

bootstrap()