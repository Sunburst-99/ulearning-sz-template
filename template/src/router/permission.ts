import type { Router } from 'vue-router'
import { useUserStore } from '@/store';

const { IS_PORTAl } = import.meta.env

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (IS_PORTAl || to.meta.noNeedLogin) {
      next()
      return
    }
    if (useUserStore().isLogin) {
      to.path === '/login' ? next('/') : next()
    } else {
      to.path === '/login' ? next() : next('/login')
    }
  })

  router.afterEach((to) => {
    window.scrollTo(0, 0)
  })
}
