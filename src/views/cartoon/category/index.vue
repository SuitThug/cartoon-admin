<template>
    <el-card class="box-card" style="height:80px">
        <el-form :model="form" class="form">
            <el-form-item label="分类搜索">
                <el-input v-model="form.searchKey" />
            </el-form-item>
            <el-form-item>
                <el-button class="button" type="primary" @click="searchCategory" :disabled="disabledSearch">搜索</el-button>
                <el-button class="button" @click="form.searchKey = ''">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card class="box-card" style="margin: 10px 0">
        <template #header>
            <el-button class="button" type="primary" icon="Plus" @click="addCategory">添加分类</el-button>
        </template>
        <el-table :data="categoryData.categoryTypeData" border style="width: 100%">
            <el-table-column prop="index" label="序号" width="180" type="index" align="center" />
            <el-table-column prop="name" label="分类名称" align="center" />
            <el-table-column prop="status" label="状态" align="center">
                <template #="{ row, $index }">
                    <el-switch v-model="row.status" name="row.name " />
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template #="{ row, $index }">
                    <el-button class="button" type="primary" icon="Edit" @click="editCategory(row)">修改</el-button>
                    <el-button class="button"  type="primary" icon="Delete" @click="deleteCategory(row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="demo-pagination-block">
            <el-pagination background v-model:current-page="pageNo" v-model:page-size="limit"
                :page-sizes="[3, 5, 7, 9]" 
                layout=" prev, pager, next,jumper,->, sizes,total" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="Tips" width="50%" :before-close="handleClose">
        <el-form :model="categoryData.subAddCategory" label-width="120px" :rules="rules" ref="ruleFormRef">
            <el-form-item label="分类名" prop="name">
                <el-input v-model="categoryData.subAddCategory.name" />
            </el-form-item>
            <el-form-item label="上架">
                <el-switch v-model="value1" name="row.name " />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    {{ addOrUp == true ? '确认添加' : '确认更新' }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref,watch } from 'vue';
import { reqCategory, reqAddCategory, reqUpdateCategory, reqDeleteCategory,reqSearchCategory} from '@/api/cartoon/category/index'
import { categorPage, resCategoryData,editCategory } from '@/api/cartoon/category/type'
import { ElMessage } from 'element-plus'
const value1 = ref(true)
const dialogVisible = ref(false)
let addOrUp = ref(true)
let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
const form = reactive({
    searchKey: ''
})
let disabledSearch = ref<boolean>(true)

let categoryData = reactive(new categorPage())
const ruleFormRef = ref()
onMounted(() => {
    getCategory(pageNo.value,limit.value)
})
// Search
const searchCategory =async () =>{
    let searchArr:resCategoryData[] = []
    let res = await reqSearchCategory(form.searchKey)
  
    if(res.code === 200 && res.data.length > 0){
        categoryData.categoryTypeData = res.data
        total.value = res.total
       
    }else{
        categoryData.categoryTypeData = res.data
        total.value = res.data.length 
        ElMessage({
            message: '没有这个分类',
            type: 'error',
        })
    }
    // categoryData.categoryTypeData = searchArr
}

const handleSizeChange =()=>{
    getCategory(pageNo.value,limit.value)
}
// 点击数字触发
const handleCurrentChange =()=>{
    getCategory(pageNo.value,limit.value)
}

// 添加
const addCategory = async () => {
    categoryData.subAddCategory.name = ''
    dialogVisible.value = true
    addOrUp.value = true


}

const save = async () => {
    await ruleFormRef.value.validate()
    if (addOrUp.value) {
        let res = await reqAddCategory(categoryData.subAddCategory)
        if (res.code == 200) {
            ElMessage({
                message: '添加成功',
                type: 'success',
            })
            dialogVisible.value = false
            getCategory(pageNo.value,limit.value)
        } else {
            ElMessage({
                message: res.msg,
                type: 'error',
            })
        }
    } else {
        let obj = {
            name: categoryData.subAddCategory.name
        }
        Object.assign(categoryData.editCategory, obj)
        let res = await reqUpdateCategory(categoryData.editCategory)
     
        if (res.code === 200) {
            if (res.code == 200) {
                ElMessage({
                    message: '更新成功',
                    type: 'success',
                })

                dialogVisible.value = false
                categoryData.editCategory.name = ''
                getCategory(pageNo.value,limit.value)
            } else {
                ElMessage({
                    message: res.msg,
                    type: 'error',
                })
            }
        }
    }


}

// update
const editCategory = (row: resCategoryData) => {
    addOrUp.value = false
    categoryData.editCategory = row
    dialogVisible.value = true;
    categoryData.subAddCategory.name = row.name
}

// delete
const deleteCategory = async (row: string) => {
    let row_arr: string[] = [row]
    let obj = { id: row_arr }
   
    let res = await reqDeleteCategory(obj)
    if (res.code === 200) {
        getCategory(pageNo.value,limit.value)
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
    } else {
        ElMessage({
            message: res.msg,
            type: 'error',
        })
    }
   
}

const validatorName = (rule: any, value: any, callback: any) => {
    if (value.length === 0) {
        callback(new Error('请输入分类名'))
    } else {
        callback()
    }
}
const rules = reactive({
    name: [
        {
            trigger: 'blur',
            validator: validatorName
        },

    ],
})


const getCategory = async (pageNo:number,limit:number) => {
    let res: any = await reqCategory(pageNo,limit)
 
    if (res.code === 200) {
        categoryData.categoryTypeData = res.data
        total.value=res.total
       
    }

}

const handleClose = (done: () => void) => {
    ruleFormRef.value.resetFields()
    dialogVisible.value = false
    done()
}

watch([()=>form.searchKey],()=>{
    if(form.searchKey!==''){
      disabledSearch.value = false
    }else{
        disabledSearch.value = true
      
        getCategory(pageNo.value,limit.value)
    }

})
</script>

<style scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}

.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.demo-pagination-block {
    margin-top: 15px;
}

.card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
}

.box-card {
    width: 100%;
}
</style>