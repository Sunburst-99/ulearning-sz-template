import type { Router } from 'vue-router'
import { useUserStore } from '@/store';

export function setupPageGuard(router: Router) {
  const IS_PORTAL = import.meta.env.VITE_IS_PORTAL === 'true'
  router.beforeEach(async (to, from, next) => {
    if (IS_PORTAL || to.meta.noNeedLogin) {
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
