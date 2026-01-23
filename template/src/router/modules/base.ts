import { RouteRecordRaw } from 'vue-router'

const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  
]

export default baseRoutes