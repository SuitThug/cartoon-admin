
export interface RoleResponseDefault {
    code: number,
    msg: string,
    total: number
}
export interface roleData {
    _id: string,
    roleName: string,
    roles: Array<string>,
    createTime: Date,
    updateTime: Date,
}

export interface RoleReqData extends RoleResponseDefault {
    data:roleData
    
}

export class RoleDataClass {
    roleList: roleData[] = []
} 