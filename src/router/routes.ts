// 常量路由
export const constantRoute = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      }
    ],
    meta: {
      title: '',
      hidden: true,
      icon: '',
    },
  },

  // 登录路由
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      icon: 'HomeFilled',
    },

  },
  //  注册
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      title: '注册',
      hidden: true,
      icon: 'HomeFilled',
    },

  },
  // 404
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
      icon: 'HomeFilled',
    },

  },

]

// 任意路由 ：需要在动态路由添加完毕在添加，不然动态路由没渲染完毕就触发404了
export const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  // component: () => import('@/views/404/index.vue'),
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
  },
}
