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
            <el-button class="button" type="primary" icon="Plus" @click="addCategory">添加漫画</el-button>
        </template>
        <el-table :data="comicsData.resListData" border style="width: 100%" show-overflow-tooltip>
            <el-table-column prop="index" label="序号" width="100" type="index" align="center" />
            <el-table-column prop="name" label="漫画名称" align="center" width="120" />
            <el-table-column prop="description" label="简介" align="center" />
            <el-table-column prop="name" label="封面图片" align="center" width="100">
                <template #="{ row, $index }">
                    <img :src="row.imageUrl" style="width:60px; height:60px" />
                </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" align="center" width="100" />
            <el-table-column prop="status" label="状态" align="center" width="100">
                <template #="{ row, $index }">
                    <el-switch v-model="row.status" name="row.name " />
                </template>
            </el-table-column>

            <el-table-column prop="address" label="操作">
                <template #="{ row, $index }">
                    <el-button class="button" type="primary" icon="Edit" @click="editcartoon(row)">修改</el-button>
                    <el-button class="button" type="primary" icon="Delete" @click="delComics(row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="demo-pagination-block">
            <el-pagination background v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                layout=" prev, pager, next,jumper,->, sizes,total" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </el-card>

    <el-dialog v-model="dialogVisible" width="70%" :before-close="handleClose" align-center
        style="height: 90%;overflow-y: scroll;" v-if="addOrUp">
        <ComicsOrChapter></ComicsOrChapter>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch, provide } from 'vue';
import { reqComicsList, reqDelComics, reqSearchComics } from '@/api/comics/index'
import { resCategoryData } from '@/api/cartoon/category/type'
import { responseData, comicsPage } from '@/api/comics/type'
import { ElMessage, ElMessageBox } from 'element-plus'
import ComicsOrChapter from '../addcartoon/index.vue'
import comicsStore from '@/stores/comics'
import type { Action } from 'element-plus'
const comicsIdStore = comicsStore()
const dialogVisible = ref(false)
let addOrUp = ref(true)
let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
const form = reactive({
    searchKey: ''
})
let disabledSearch = ref<boolean>(true)
let comicsData = reactive(new comicsPage())
const ruleFormRef = ref()
onMounted(() => {
    getComicsList(pageNo.value, limit.value)
})
// Search
const searchCategory = async () => {
    let res = await reqSearchComics(form.searchKey.trim())
    console.log(form.searchKey)
    if (res.code === 200 && res.data.length > 0) {
        comicsData.resListData = res.data
        total.value = Number(res.total)
        console.log(comicsData.resListData)
    } else {
        comicsData.resListData = res.data
        total.value = res.data.length
        ElMessage({
            message: '没有这个分类',
            type: 'error',
        })
    }

}

const handleSizeChange = () => {
    getComicsList(pageNo.value, limit.value)
}
// 点击数字触发
const handleCurrentChange = () => {
    getComicsList(pageNo.value, limit.value)
}

// 添加
const addCategory = async () => {
    console.log('添加')
    comicsIdStore.editORAdd._id = ''
    dialogVisible.value = true
    addOrUp.value = true
}

// update
const editcartoon = (row: resCategoryData) => {
    Object.assign(comicsIdStore.editORAdd, row)
    comicsIdStore.comicsId = row._id
    localStorage.setItem('comicsId', row._id)
    dialogVisible.value = true;
    addOrUp.value = true
}

// delete
const delComics = async (row: string) => {
    ElMessageBox.alert('确定删除漫画吗？', '删除漫画', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        callback: async (action: Action) => {
            if (action === 'confirm') {
                let row_arr: string[] = [row]
                let obj = { ids: row_arr }
                // console.log(row_arr)
                let res = await reqDelComics(obj)
                if (res.code === 200) {
                    getComicsList(pageNo.value, limit.value)
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
            } else {
                ElMessage({
                    type: 'info',
                    message: `取消删除`,
                })
            }


        },
    })


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

const getComicsList = async (pageNo: number, limit: number) => {
    let res: responseData = await reqComicsList(pageNo, limit)

    if (res.code === 200) {
        comicsData.resListData = res.data
        // console.log(res.data)
        total.value = Number(res.total)
    }

}

const handleClose = (done: () => void) => {
    // ruleFormRef.value.resetFields()
    // dialogVisible.value = false
    addOrUp.value = false
    done()
    getComicsList(pageNo.value, limit.value)
}

watch([() => form.searchKey], () => {
    if (form.searchKey !== '') {
        disabledSearch.value = false
    } else {
        disabledSearch.value = true

        getComicsList(pageNo.value, limit.value)
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