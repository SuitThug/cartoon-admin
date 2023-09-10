// 用户登录接口
import request from '@/utils/request'
import {responseData,resDefaule,reqimgType} from './type'
import { AnySrvRecord } from 'dns'
enum API {
   UPLOADTOKEN = '/upload/token', //图片上传token
   // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
   UPLOADIMG ="https://upload-z2.qiniup.com/"  ,
   ADDCOMICS = '/api/comics/addcomics', 
   COMICSLIST = '/api/comics/list', 
   ADDCHAPTER = '/api/comics/addchapter',
   DELCOMICS = '/api/comics/delComics',
   SEARCHCOMICS = '/api/comics/search',
   QUERYCHAPTER ='/api/query/chapter',
   ADDCHAPTERIMG = '/api/comics/addchapter/img',
   UPDATACOMICS = '/api/comics/updateComics'
}


// 生成七牛云token
export const uoloadToken = ()=> request.get<any,any>(API.UPLOADTOKEN)

// 上传七牛云
export const reqUoloadImg = (formdata:any)=> request.post<any,any>(API.UPLOADIMG,formdata)

// 添加作品
export const reqAddComics = (data:any)=> request.post<any,any>(API.ADDCOMICS,data)
// 漫画列表
export const reqComicsList = (pageNo:number,limit:number)=> request.get<any,responseData>(API.COMICSLIST+`?pageNo=${pageNo}&limit=${limit}`)
// 删除漫画
export const reqDelComics = (data:any)=> request.post<any,resDefaule>(API.DELCOMICS,data)

// 搜索
export const reqSearchComics = (data:string)=> request.get<any,responseData>(API.SEARCHCOMICS+`?searchKey=${data}`)


// 章节添加
export const reqAddChapter= (data:any)=> request.post<any,responseData>(API.ADDCHAPTER,data)
// 章节查询
export const reqQueryChapter= (data:any)=> request.get<any,responseData>(API.QUERYCHAPTER+`?cartoon_Id=${data}`)

// 章节图片上传
export const reqChapterImg= (data:any)=> request.post<any,responseData>(API.ADDCHAPTERIMG,data)



// 更新漫画
export const reqUpdateComics= (data:any)=> request.post<any,AnySrvRecord>(API.UPDATACOMICS,data)
