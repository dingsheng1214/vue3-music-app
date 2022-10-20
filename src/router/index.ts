import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Recommend = () => import('@/views/tabs/Recommend')
const Singer = () => import('@/views/tabs/Singer')
const Rank = () => import('@/views/tabs/Rank')
const Search = () => import('@/views/tabs/Search')
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer,
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
