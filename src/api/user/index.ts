// 用户登录接口
import request from '@/utils/request'

import  {registerType,loginType} from './type'
enum API {
   LOGIN_URL = '/admin/login', //登录
   REGISTER_URL = '/admin/register', //注册
   USERINFO_URL = '/admin/userInfo', //详细信息
   USERROLE = '/api/getUserMenu'
}
// 注册  ---别再写 {}好吗？
export const register = (data:registerType)=> request.post<any,any>(API.REGISTER_URL,data)

// 登录
export const reqLogin = (data:loginType)=> request.post<any, any>(API.LOGIN_URL,data)
// 用户详细信息
export const userInfo = ()=> request.get<any, any>(API.USERINFO_URL)

// 根据用户id获取菜单权限
export const userRole = (id:object)=> request.post<any, any>(API.USERROLE,id)


