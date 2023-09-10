// 路由守卫
//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|注册|首页|数据分析|权限管理(二个子路由)|漫画管理(两个子路由)

//用户未登录:可以访问login,register其余路由路由不能访问(指向login)
//用户登录成功:不可以访问login,register[指向首页],其余的路由可以访问
import router from "@/router";
// 引入滚动条插件 nprogress
// @ts-ignore  //@ts-ignore 隐藏了ts文件的报错,不然打包会报错
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 获取相关仓库内部的token数据，判断用户是否登录成功
import useUserStore from "./stores/modules/user";
// 这里获取不到pinia，所以需要引入并传入pinia
import pinia from "@/stores";
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
const userStore = useUserStore(pinia)
nprogress.configure({ showSpinner: false });
// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title as string
  // 启动滚动条
  nprogress.start();
  const token = userStore.token
  //获取用户名字
  const username = userStore.username
  let uid = GET_TOKEN('uid')!
  //   判断是否登录
  if (token) {
    // /登录状态不能让他去登录注册页面
    if (to.path == '/login' || to.path == '/register') {
      next({ path: '/' })
    } else {
      //登录成功访问其余路由(登录、注册排除)
      //前提得有用户信息
      if (username) {
        next()
      } else {
        // 没有用户信息那就请求用户信息
        try {
          //获取用户信息
          await userStore.userInfo()
          
          next({ ...to })
        } catch (error) {
          console.log('用户信息获取失败')
          //token过期:获取不到用户信息了
          //用户手动修改本地存储token
          //退出登录->用户相关的数据清空
          await userStore.reqLogout()
          next({ path: '/login', query: { redirect: to.path } })

        }
      }
    }
    nprogress.done();
    // await userStore.setUserRouters(uid)
  } else { // 没有token，用户没有登录
    if (to.path == '/login' || to.path == '/register') {
      next()
    } else {
      //token过期，前往登录页面
      nprogress.done();
      next({ path: '/login', query: { redirect: to.path } })
    }

  }
})