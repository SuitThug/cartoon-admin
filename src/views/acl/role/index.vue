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
            <el-button class="button" type="primary" icon="Plus" @click="addRole">添加用户</el-button>
        </template>
        <el-table :data="roleClass.roleList" border style="width: 100%" show-overflow-tooltip>
            <el-table-column prop="index" label="序号" width="100" type="index" align="center" />
            <el-table-column prop="roleName" label="用户名字" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="updateTime" label="修改时间" align="center" />
            <el-table-column prop="address" label="操作" width="340px" align="center">
                <template #="{ row, $index }">
                    <el-button class="button" type="primary" icon="Edit" @click="editOrle(row)">修改权限</el-button>
                    <el-button class="button" type="primary" icon="Edit" @click="editRole(row)">修改</el-button>
                    <el-button class="button" type="primary" icon="Delete" @click="delUser(row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="demo-pagination-block">
            <el-pagination background v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                layout=" prev, pager, next,jumper,->, sizes,total" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- 弹出框 -->
        <el-dialog v-model="dialogVisible" :title="roleValidateForm._id ? '更新角色' : '添加角色'" width="40%"
            :before-close="handleClose">
            <el-form ref="formRef" :model="roleValidateForm" label-width="100px" class="demo-ruleForm" :rules="rules">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="roleValidateForm.roleName" type="text" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
                    <el-button @click="resetForm(formRef)">Reset</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 权限 -->
        <el-drawer v-model="drawer2">
            <template #header>
                <h4>分配职位</h4>
            </template>
            <template #default>
                <div>
                    <el-tree ref="treeRef" :data="menuListData" show-checkbox node-key="rid" :default-expanded-keys="[2, 3]"
                        :default-checked-keys="roleMenu" :props="defaultProps" />
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">cancel</el-button>
                    <el-button type="primary" @click="confirmClick">confirm</el-button>
                </div>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch, nextTick } from 'vue';
import { reqSearchComics } from '@/api/comics/index'
import { comicsPage } from '@/api/comics/type'
import { reqAddRole, reqRoleList, reqDelRole, reqUpdateRole, reqRoleAuthority, reqGetRoleMenu, reqUpdateRoleMenu } from '@/api/acl/role/index'
import { RoleDataClass, RoleReqData } from '@/api/acl/role/type'
import { getTreeMenus } from "@/utils/tree";
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, Action } from 'element-plus'
import { number } from 'echarts';
import { fa } from 'element-plus/es/locale';
interface role {
    _id: string,
    roleName: string
}
const roleValidateForm = reactive<role>({
    _id: '',
    roleName: ''
})

const dialogVisible = ref(false)
let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
const form = reactive({
    searchKey: ''
})
let disabledSearch = ref<boolean>(true)
let comicsData = reactive(new comicsPage())
let roleClass = reactive(new RoleDataClass())
const formRef = ref<FormInstance>()
const menuListData: any = ref([])
const roleMenu = ref([]);
const treeRef = ref()
const roleId = ref()
const drawer2 = ref(false)
const defaultProps = {
    children: 'children',
    label: 'title',
}
onMounted(() => {
    getRoleList(pageNo.value, limit.value)
})

function cancelClick() {
    drawer2.value = false
}

// 更新角色菜单权限
async function confirmClick() {
    // console.log(roleMenu.value)
    let checkedRoleIds: number[] = [];
    // { rid: number; pid: number } ：指定item里边rid与pid类型
    treeRef.value.getCheckedNodes(false, false).forEach((item: { rid: number; pid: number }) => {
        // 排除掉一级组件id
        // && item.pid !== 0
        if (item.rid) {
            checkedRoleIds.push(item.rid);
        }
    });
    const data = {
        roleMenuIds: checkedRoleIds,
        id: roleId.value,
    }
   
    let res = await reqUpdateRoleMenu(data)
    if (res.code == 200) {
        ElMessage({
            message: res.msg,
            type: 'success',
        })
        drawer2.value = false
    } else {
        ElMessage({
            message: res.msg,
            type: 'error',
        })
    }
}

const data = [
    {
        id: 1,
        label: 'Level one 1',
        children: [
            {
                id: 4,
                label: 'Level two 1-1',
                children: [
                    {
                        id: 9,
                        label: 'Level three 1-1-1',
                    },
                    {
                        id: 10,
                        label: 'Level three 1-1-2',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        label: 'Level one 2',
        children: [
            {
                id: 5,
                label: 'Level two 2-1',
            },
            {
                id: 6,
                label: 'Level two 2-2',
            },
        ],
    },
    {
        id: 3,
        label: 'Level one 3',
        children: [
            {
                id: 7,
                label: 'Level two 3-1',
            },
            {
                id: 8,
                label: 'Level two 3-2',
            },
        ],
    },
]






const handleClose = (done: () => void) => {
    done()
    // ElMessageBox.confirm('Are you sure to close this dialog?')
    //     .then(() => {
    //         done()
    //     })
    //     .catch(() => {
    //         // catch error
    //     })
}
const rules = reactive<FormRules<role>>({
    roleName: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
    ],
})

// 更新/修改角色名字
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            // console.log('submit!')
            save()
        } else {
         
            return false
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}





// Search
const searchCategory = async () => {
    let res = await reqSearchComics(form.searchKey.trim())
   
    if (res.code === 200 && res.data.length > 0) {
        comicsData.resListData = res.data
        total.value = Number(res.total)
     
    } else {
        comicsData.resListData = res.data
        total.value = res.data.length
        ElMessage({
            message: '没有这个分类',
            type: 'error',
        })
    }

}

// 分页器
const handleSizeChange = async () => {
    getRoleList(pageNo.value, limit.value)
}
// 点击数字触发
const handleCurrentChange = () => {
    getRoleList(pageNo.value, limit.value)
}

// 编辑权限
const editOrle = async (row: any) => {
    // console.log(row)
    drawer2.value = true
    // roleValidateForm.roleName = 
    let res = await reqGetRoleMenu(row._id)
    if (res.code == 200) {
        roleMenu.value = res.data
        roleId.value = row._id
    }
    getRoleMenu()
}



const getRoleMenu = async () => {
    let res = await reqRoleAuthority()
    // console.log(res)
    menuListData.value = getTreeMenus(res)

}


// 添加
const addRole = async () => {
    roleValidateForm._id = ''
    dialogVisible.value = true
    // 清除验证规则与表单内容
    formRef.value?.resetFields()
}
const save = async () => {
    if (!roleValidateForm._id) {
        let res: any = await reqAddRole(roleValidateForm)
        if (res.code == 200) {
            ElMessage({
                type: 'success',
                message: res.msg
            })
          
            dialogVisible.value = false
            getRoleList(pageNo.value, limit.value)
        } else {
            ElMessage({
                type: 'error',
                message: res.msg
            })
        }

    } else {
    
        let res: any = await reqUpdateRole(roleValidateForm)
        if (res.code == 200) {
            ElMessage({
                type: 'success',
                message: res.msg
            })
            dialogVisible.value = false
            getRoleList(pageNo.value, limit.value)
        } else {
            ElMessage({
                type: 'error',
                message: res.msg
            })
        }

    }
}


// 更新角色
const editRole = (row: any) => {
    dialogVisible.value = true
    Object.assign(roleValidateForm, row);

}

// delete
const delUser = async (row: string) => {
    let row_arr: string[] = [row]
    let obj = { ids: row_arr }

    let res = await reqDelRole(obj)
    if (res.code === 200) {
        getRoleList(pageNo.value, limit.value)
        ElMessage({
            message:res.msg,
            type: 'success',
        })
    } else {
        ElMessage({
            message: res.msg,
            type: 'error',
        })
    }
  
}


const getRoleList = async (pageNo: number, limit: number) => {
    let res: any = await reqRoleList(pageNo, limit)
  
    if (res.code === 200) {
        roleClass.roleList = res.data
   
        total.value = Number(res.total)
    }

}

watch([() => form.searchKey], () => {
    if (form.searchKey !== '') {
        disabledSearch.value = false
    } else {
        disabledSearch.value = true

        getRoleList(pageNo.value, limit.value)
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