import request from "@/utils/request";
import {resCategoryData,responseData,subAddCategory,editCategory} from './type'

enum API {
      CATEGORY_LIST = '/api/category/listCategory',
       ADDCATEGORY ='/api/category/addCategory',
       UPDATECATEGORY ='/api/category/updateCategory',
       DELETECATEGORY ='/api/category/delCategory',
       SEACHCATEGORY = '/api/category/search'

}

// 查询分类列表
export const reqCategory = (pageNo:number,limit:number)=> request.get<any,any>(API.CATEGORY_LIST+`?pageNo=${pageNo}&limit=${limit}`);

// 添加分类
export const reqAddCategory = (data:subAddCategory)=> request.post<any,any>(API.ADDCATEGORY,data);

// 更新分类
export const reqUpdateCategory = (data:editCategory)=> request.patch<any,any>(API.UPDATECATEGORY,data);

// 删除分类
export const reqDeleteCategory = (data:any)=> request.post<any,any>(API.DELETECATEGORY,data);
//查询分类
export const reqSearchCategory = (data:string|number)=> request.get<any,any>(API.SEACHCATEGORY+`?searchKey=${data}`);




