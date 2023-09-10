// vue提供的路由类型
import { RouteRecordRaw } from "vue-router"
import {IMenuItem,ITreeMenuItem} from '@/api/acl/menu/type'
// 定义小仓库的state类型
export interface UserState{
    token:string | null,
    uid:string,
    username:string,
    avatar:string,
    menuRouters:RouteRecordRaw[],
    menuList:IMenuItem[],
    userRouters:ITreeMenuItem[]
}