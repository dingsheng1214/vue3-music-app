import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      type: 'home',
    },
    component: () => import('@/views/Home'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      type: 'login',
    },
    component: () => import('@/views/Login'),
  },
  {
    path: '/:pathMatch(.*)*', // 注意此处 404页面匹配规则和以前不相同，得采用这种配置方式才行
    name: '404',
    component: () => import('@/views/Page404'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
