
export interface resDefaule {
    code: number,
    msg: string,

}

export interface resListData {
    category_name: string
    description: string
    imageUrl: string
    name: string
    status: number | boolean
    _id: string

}

export interface responseData extends resDefaule {
     data: resListData[],
     total:string | number,
}

// 提交图片类型
// export interface reqimgType {
//     name: string,
//     url: string
//     chapterOrder: number | string, //排序
//     comics: string,
//     status:string,
//     uid:string
// }

// 提交图片类型
export interface reqimgType {
    chapterName:string,
    url: string
    chapterId:string ,  //章节id
    order:number, //排序
    comicsId: string
}




export class comicsPage {
    resListData: resListData[] = []
    reqimgType: reqimgType[] =[]
}