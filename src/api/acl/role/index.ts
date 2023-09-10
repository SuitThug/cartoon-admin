import request from '@/utils/request'
import {RoleReqData} from './type'
enum API {
       ADDROLE = '/api/acl/addRole',
       ROLELIST = '/api/acl/roleList',
       DELROLE = '/api/acl/delRole',
       UPDATEROLE = '/api/acl/updateRole',
       ROLEMENU = '/api/getMenuList',
       GETROLEMENU = '/api/getRoleMenu',
       UPDATEROLEMENU = '/api/updateRoleMenu'
 }

//  添加角色
 export const reqAddRole = (roleName:object)=> request.post(API.ADDROLE,roleName);
// 获取角色列表
 export const reqRoleList = (pageNo:number,limit:number)=> request.get<any,RoleReqData>(API.ROLELIST+`?pageNo=${pageNo}&limit=${limit}`);
 export const reqDelRole = (ids:any)=> request.post<any,RoleReqData>(API.DELROLE,ids);

 export const reqUpdateRole = (role:any)=> request.post<any,RoleReqData>(API.UPDATEROLE,role);

//  获取全部菜单
export const reqRoleAuthority= ()=> request.get<any,any>(API.ROLEMENU);

// 根据角色获取菜单
export const reqGetRoleMenu= (data:String)=> request.get<any,any>(API.GETROLEMENU+`?id=${data}`);

// 更新角色
export const reqUpdateRoleMenu= (data:any)=> request.post<any,any>(API.UPDATEROLEMENU,data);


