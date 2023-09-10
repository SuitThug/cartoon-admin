// 用户列表查询
 export interface resUserListData {
    username:string,
    routers:[],
    roles:[],
    _id:string,
    updateTime:Date,
    createTime:Date,
 }

 
 export class resUserData{
    userList:resUserListData[] =[] 
 }


//  侧边菜单