// 注册类型
export interface registerType {
    username:string,
    password:String,
    phone:string
}

export interface loginType {
    password:String,
    phone:string
}




// 初始化
export class regPage{
    register_from:registerType ={
        username:"",
        password:"",
        phone:''
    }
    loginType:loginType ={
        password:"123456",
        phone:'15078457610'
    }
}