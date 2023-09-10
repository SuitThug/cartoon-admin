// 封装本地存储数据与读取数据
export const SET_TOKEN = (name:any,token:string)=>{
    localStorage.setItem(name,token)
}
export const GET_TOKEN = (name:string)=>{
    return localStorage.getItem(name)
}

export const REMOVE_TOKEN = (name:string)=>{
    localStorage.removeItem(name)
}

export const REMOVE_All = ()=>{
    localStorage.clear()
}
