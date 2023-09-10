export interface responseData  {
    code: number,
    msg: string
}



export interface resCategoryData {
    total:string | number,
    name: string,
    status: string | boolean
    _id: string
}

// 分类提交数据
export interface subAddCategory {
    name: string
}

// 编辑
export interface editCategory {
    name: string,
    status: string | boolean,
    _id: string
}
export class categorPage  {
    categoryTypeData: resCategoryData[] = [];
    subAddCategory:subAddCategory = {
        name:''
    }
    editCategory:editCategory ={
        name: '',
        status: '',
        _id: ''
    }
}