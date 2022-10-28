import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Recommend = () => import('@/views/tabs/Recommend')
const Singer = () => import('@/views/tabs/Singer')
const TopList = () => import('@/views/tabs/TopList')
const Search = () => import('@/views/tabs/Search')

const SingerDetail = () => import('@/views/tabs/SingerDetail')
const Album = () => import('@/views/tabs/Album')
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':mid',
        component: SingerDetail,
      },
    ],
  },
  {
    path: '/top-list',
    component: TopList,
  },
  {
    path: '/search',
    component: Search,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
