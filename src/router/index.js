import { createRouter, createWebHashHistory } from 'vue-router';

// 本地静态路由
export const constantRoutes = [
  {
    path: '/',
    redirect: '/user/index',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      isParentView: false,
      sort: 1,
    },
  },

  {
    // path: '/404',
    path: '/:pathMatch(.*)*', // 防止浏览器刷新时路由未找到警告提示: vue-router.mjs:35 [Vue Router warn]: No match found for location with path "/xxx"
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      isParentView: true,
      sort: 1,
    },
  },
  // {
  //   // path: '/404',
  //   path: '/system/personal-center', // 防止浏览器刷新时路由未找到警告提示: vue-router.mjs:35 [Vue Router warn]: No match found for location with path "/xxx"
  //   component: () => import('@/views/error-page/404.vue'),
  // },
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;
