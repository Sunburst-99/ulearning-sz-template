import type { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { setupPageGuard } from './permission';
import Layout from '@/layout/index.vue';
import baseRoutes from './modules/base';

/**
 * 路由meta属性配置说明：
 *  @param title 菜单展示的名称
 *  @param icon 菜单展示的图标
 *  @param roles 角色权限(不填时权限跟随父路由，父路由也不填时则所有角色都有权限)
 *  @param isHidden 是否在菜单中隐藏（默认false）
 *  @param parent 父级路由路径，用于高亮菜单
 *  @param breadcrumb 是否在面包屑中显示(默认true)
 *  @param noNeedLogin 是否不需要token校验
 */

// 登录页路由
const logingRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    children: [
      ...baseRoutes
    ]
  }
]
const constantRouter: Array<RouteRecordRaw> = [
  ...(import.meta.env.VITE_IS_PORTAL === 'true' ? [] : logingRoutes),
  ...routes,
  {
    path: '/:pathMatch(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
