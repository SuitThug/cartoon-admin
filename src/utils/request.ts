// 对axios 进行二次封装，使用请求拦截器

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 引入相关仓库
import useUserStore from '@/stores/modules/user'

// 创建实例
const request = axios.create({

  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
  timeout: 10000 //超过时间设置
})

// 请求拦截器
request.interceptors.request.use((config) => {
  //获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
  // console.log(config)
  const userStore = useUserStore()
  // console.log(userStore.token)
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

// 响应拦截器
request.interceptors.response.use((response) => {
  if (response.data && response.data.hash) {
    response.data.code = 200
  }
  // 成功
  return response.data 

}, (error) => {
  //  失败
  let message = ''
  // console.log(error)
  const status = error.response.status

  switch (status) {
    case 401:
      message = 'TOKEN过期-响应拦截'
      break
    case 403:
      message = '无权访问'
      break
    case 404:
      message = '请求地址错误'
      break
    case 500:
      message = '服务器出现问题'
      break
    default:
      message = '网络出现问题'
      break
  }
  //提示错误信息
  ElMessage({
    type: 'error',
    message,
  })
  return Promise.reject(error)
})

//对外暴露
export default request