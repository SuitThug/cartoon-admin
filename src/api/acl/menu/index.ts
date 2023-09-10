
import request from '@/utils/request'
import  {IMenuItem} from './type'
enum API {
    INSERTMENU = '/api/insertParentMenu',
    MENULIST = '/api/getMenuList' ,
    UPDATEMENU = '/api/updateMenu' 
 }

//  添加角色
 export const reqInsertMenu = (data:object)=> request.post(API.INSERTMENU,data);
//  获取菜单列表
export const reqMenuList= ()=> request.get<any,any>(API.MENULIST);
// 更新菜单
export const reqUpdateMenu= (data:any)=> request.post<any,any>(API.UPDATEMENU,data);

