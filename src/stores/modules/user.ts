import { defineStore } from 'pinia';
// 路由
import router from '@/router'
import { constantRoute ,anyRoute} from '@/router/routes'
import { UserState } from './type/type'
import { register, reqLogin, userInfo, userRole } from '@/api/user/index'
import { SET_TOKEN, GET_TOKEN, REMOVE_All } from '@/utils/token'
import { IMenuItem, ITreeMenuItem } from '@/api/acl/menu/type'
import { getTreeMenus, generateRouter } from '@/utils/tree'
// 过滤，
function filterAsyncRoute(asyncRoute: any, routes: any) {
    let name = routes.map((item: any) => item.name)
    return asyncRoute.filter((item: any) => {
        if (name.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}

let useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            token: GET_TOKEN('TOKEN')!,
            username: "",
            avatar: "",
            uid: GET_TOKEN('uid')!,
            menuRouters: constantRoute, ////仓库存储生成菜单需要数组(路由)
            menuList: [] as IMenuItem[],
            userRouters: [] as ITreeMenuItem[],
        }
    },
    //异步/逻辑的地方
    actions: {
        //   注册
        async getRegister(data: any) {
            // 发送请求
            let result: any = await register(data)
            if (result.code === 200) {
                return 'ok'
            } else {
                return Promise.reject(new Error(result.msg as string))
            }
        },

        // 登录
        async reqLogin(data: any) {
            // 发送请求
            let result: any = await reqLogin(data)
            if (result.code === 200) {
                this.token = result.data
                // 本地持久化
                SET_TOKEN('TOKEN', result.data as string)
                return 'ok'
            } else {
                return Promise.reject(new Error(result.msg))
            }
        },
        // 详细信息
        async userInfo() {
            let result = await userInfo()
            if (result.code === 200) {
                this.username = result.data.username
                this.avatar = result.data.avatar
                this.uid = result.data._id
                SET_TOKEN('uid', result.data._id)
                // 动态路由追加
                // 拿到数据存储的菜单信息
                await this.setUserRouters(this.uid);
                // 转换路由格式
                let newRoutes = generateRouter(this.userRouters);
                 newRoutes.forEach((item)=>{
                    router.addRoute(item)
                 })
                 this.menuRouters = [...constantRoute, ...newRoutes,anyRoute]
                //  console.log('231321321', this.menuRouters)

            } else {
                return Promise.reject(new Error(result.msg))
            }

        },

        // 获取用户树形结构菜单
        async setUserRouters(id: string) {
            // 根据用户id获取相应的菜单权限
            const menuList = await userRole({ uid: id }) as IMenuItem[];
            this.menuList = menuList;
            // 将菜单转换成树形结构
            this.userRouters = getTreeMenus(menuList);
            

        },

        // 退出登录
        async reqLogout() {
            this.username = ''
            this.avatar = ''
            this.token = ''
            REMOVE_All()
        }


    }
})

export default useUserStore