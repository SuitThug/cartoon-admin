
import request from '@/utils/request'
import {RoleReqData} from '../role/type'
enum API {
    USERLIST = '/api/admin/userList', //用户详细信息
    DELUSER = '/api/delUser',
    UPDATEUSER = '/api/updateUser',
    ROLELIST = '/api/acl/roleList',
    UPDATEUSERROLE='/api/updateUserRole'
 }

//  获取用户列表
 export const reqUserList = (pageNO:number,limit:number)=> request.get<any, any>(API.USERLIST+`/${pageNO}/${limit}`)


//  删除用户
export const reqDelUser = (data:any)=> request.post<any, any>(API.DELUSER,data)

// 更新用户信息

export const reqUpdateUser = (data:any)=> request.post<any, any>(API.UPDATEUSER,data)

// 获取角色列表
export const reqUserRoleList = ()=> request.get<any,RoleReqData>(API.ROLELIST);

// 更新职位
export const reqUpdateUserRole = (data:object)=> request.post<any,any>(API.UPDATEUSERROLE,data);

