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
            <el-button class="button" type="primary" icon="Plus" @click="addUser">添加用户</el-button>
        </template>
        <el-table :data="userData.userList" border style="width: 100%" show-overflow-tooltip>
            <el-table-column prop="index" label="序号" width="100" type="index" align="center" />
            <el-table-column prop="username" label="用户名字" align="center" />
            <el-table-column prop="roles" label="用户角色" align="center">
                <template #="{ row, $index }">
                    <template v-for="(item, index) in row.roles " :key="index">
                        <el-button text>{{ item }}</el-button>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="updateTime" label="修改时间" align="center" />
            <el-table-column prop="address" label="操作" width="340px" align="center">
                <template #="{ row, $index }">
                    <el-button class="button" type="primary" icon="Edit" @click="editOrle(row)">分配职位</el-button>
                    <el-button class="button" type="primary" icon="Edit" @click="editUser(row)">修改</el-button>
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

        <!-- 新建/编辑 -->
        <el-drawer v-model="drawer" title="I am the title" :before-close="handleClose">
            <!-- 头部标题:将来文字内容应该动态的 -->
            <template #header>
                <h4>{{ validateForm._id ? '更新用户' : '添加用户' }}</h4>
            </template>
            <!-- 身体部分 -->
            <template #default>
                <el-form :model="validateForm" :rules="rulesUser" ref="formRef">
                    <el-form-item label="用户姓名" prop="username">
                        <el-input placeholder="请您输入用户姓名" v-model="validateForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input placeholder="请您输入手机号码" v-model="validateForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password" v-if="!validateForm._id">
                        <el-input placeholder="请您输入用户密码" v-model="validateForm.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="submitForm(formRef)">{{ validateForm._id ? '更新用户' : '添加用户'
                    }}</el-button>
                    <el-button @click="resetForm(formRef)">重置</el-button>
                </div>
            </template>
        </el-drawer>

        <!-- 分配权限 -->
        <el-drawer v-model="drawer1" title="I am the title" :before-close="handleClose">
            <!-- 头部标题:将来文字内容应该动态的 -->
            <template #header>
                <h4>分配职位</h4>
            </template>
            <!-- 身体部分 -->
            <template #default>
                <el-form>
                    <el-form-item label="用户姓名" prop="username">
                        <el-input placeholder="请您输入用户姓名" v-model="validateForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="添加职位" :prop="roleName">
                        <el-select v-model="value" clearable :placeholder="roleName">
                            <el-option v-for="item in options" :key="item._id" :label="item.roleName" :value="item._id" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="onRole">添加职位</el-button>
                    <el-button @click="resetForm(formRef)">Reset</el-button>
                </div>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch, nextTick } from 'vue';
import { reqSearchComics } from '@/api/comics/index'
import { resUserData } from '@/api/acl/user/type'
import { reqUserList, reqDelUser, reqUpdateUser, reqUpdateUserRole } from '@/api/acl/user/index'
import { responseData, comicsPage } from '@/api/comics/type'
import { register } from '@/api/user/index'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { reqUserRoleList } from '@/api/acl/user/index'
const drawer = ref(false)
const drawer1 = ref(false)
let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
const form = reactive({
    searchKey: ''
})
let disabledSearch = ref<boolean>(true)
let userData = reactive(new resUserData())
let comicsData = reactive(new comicsPage())
const formRef = ref<FormInstance>()
interface RuleForm {
    _id: string,
    username: string,
    password: string,
    phone: string
}
const validateForm = reactive<RuleForm>({
    _id: '',
    username: '',
    phone: '',
    password: ''
})
// 职位分配
const value = ref('')
const options = ref<any>([])
const roleName = ref()

const rulesUser = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请填写用户名' }
    ],
    phone: [
        { required: true, message: '请填写电话号码' },
        { min: 11, max: 11, message: '请填写11位电话号码' }
    ],
    password: [
        { required: true, message: '请填写密码' },
    ]

})

onMounted(() => {
    getUserList(pageNo.value, limit.value)

})

// 分配职位
const onRole = async () => {
    console.log(value)
    console.log(validateForm)
    let obj = {
        id: validateForm._id,
        roleId: value.value
    }
    let res = await reqUpdateUserRole(obj)
    ElMessage({
        message:res.msg,
        type: 'success',
    })

}


const getUserRoleList = async () => {
    let res: any = await reqUserRoleList()
    console.log(res)
    if (res.code === 200) {
        options.value = res.data
        // roleName.value = res
    }

}


const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            save()

        } else {
            console.log('error submit!')
            return false
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // formEl.resetFields()
    validateForm.username = ''
    validateForm.phone = ''
    validateForm.password = ''

}



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

// 分页器
const handleSizeChange = async () => {
    getUserList(pageNo.value, limit.value)
}
// 点击数字触发
const handleCurrentChange = () => {
    getUserList(pageNo.value, limit.value)
}

// 分配职位
const editOrle = (row: any) => {
    drawer1.value = true
    validateForm.username = row.username
    validateForm._id = row._id
    roleName.value = row.roles[0]
    // console.log(row.roles[0])
    getUserRoleList()
}

// 添加
const addUser = async () => {
    drawer.value = true
    // 清除验证规则与表单内容
    formRef.value?.resetFields()
    validateForm.password = ''
    validateForm._id = ''

}
const save = async () => {
    if (!validateForm._id) {
        let newValidateForm = {
            username: validateForm.username,
            phone: validateForm.phone,
            password: validateForm.password,
        }
        let res = await register(newValidateForm)
        console.log(res)
        if (res.code == 200) {
            drawer.value = false
            ElMessage({
                message: '添加成功',
                type: 'success',
            })
            getUserList(pageNo.value, limit.value)
        } else {
            ElMessage({
                message: res.msg,
                type: 'error',
            })
        }
    } else {
        let res = await reqUpdateUser(validateForm)
        if (res.code == 200) {
            drawer.value = false
            ElMessage({
                message: res.msg,
                type: 'success',
            })
            getUserList(pageNo.value, limit.value)
        } else {
            ElMessage({
                message: res.msg,
                type: 'error',
            })
        }
    }


}


// update
const editUser = (row: any) => {
    Object.assign(validateForm, row);
    // console.log(validateForm)
    drawer.value = true

}

// delete
const delUser = async (row: string) => {
    let row_arr: string[] = [row]
    let obj = { ids: row_arr }
    let res = await reqDelUser(obj)
    if (res.code === 200) {
        getUserList(pageNo.value, limit.value)
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
    console.log(res)
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

const getUserList = async (pageNo: number, limit: number) => {
    let res = await reqUserList(pageNo, limit)
    if (res.code === 200) {
        userData.userList = res.data
        // console.log(res)
        total.value = Number(res.total)
    }

}

const handleClose = (done: () => void) => {
    // 清除值与验证规则
    formRef.value?.resetFields()
    done()

}

watch([() => form.searchKey], () => {
    if (form.searchKey !== '') {
        disabledSearch.value = false
    } else {
        disabledSearch.value = true

        getUserList(pageNo.value, limit.value)
    }

})
</script>

<style scoped>
.demo-ruleForm {
    background-color: red;
}

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