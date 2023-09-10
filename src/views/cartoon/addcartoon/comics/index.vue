<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
        status-icon>
        <el-form-item :label="comicsIdStore.editORAdd._id ? '更新作品名称' : '添加作品名称'" prop="name" style="width: 320px;">
            <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="作者名" prop="author" style="width: 320px;">
            <el-input v-model="ruleForm.author" />
        </el-form-item>
        <el-form-item label="作品分类" prop="category_name">
            <el-select v-model="ruleForm.category_id" placeholder="请选择分类">
                <!-- <el-option  label="请选择分类" value="请选择分类"  /> -->
                <el-option v-for="item in options.categoryTypeData " :key="item._id" :label="item.name"
                    :value="item._id" />
            </el-select>
        </el-form-item>
        <el-form-item label="更新状态" prop="">
            <el-switch v-model="ruleForm.status" />
        </el-form-item>
        <el-form-item label="封面图片" prop="imageUrl">
            <!-- 上传图片 -->
            <Uploadimg @data-imageUrl="imageUrl"></Uploadimg>
        </el-form-item>
        <el-form-item label="作品简介" prop="description">
            <el-input v-model="ruleForm.description" type="textarea" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                {{ comicsIdStore.editORAdd._id ? '更新作品' : '添加作品' }}
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, toRefs, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
// 请求接口
import { reqCategory } from '@/api/cartoon/category';
import { reqAddComics, reqUpdateComics } from '@/api/comics/index';
import Uploadimg from '../components/upload.vue';
import { categorPage } from '@/api/cartoon/category/type';
import comicsStore from '@/stores/comics'
const comicsIdStore = comicsStore()
interface RuleForm {
    name: string
    category_id:string,
    status: boolean
    description: string,
    imageUrl: string,
    author: string
}
const flog = ref(true)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    name: '',
    category_id:'',
    status: false,
    description: '',
    imageUrl: '',
    author: ''
})
const options = reactive(new categorPage())
onMounted(async () => {
    let res = await reqCategory(1, 100)
    options.categoryTypeData = res.data
    if (comicsIdStore.editORAdd._id) {
        updateComics()
    }
})
const imageUrl = (url: any) => {
    ruleForm.imageUrl = url
}
const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: '请填写作品名', trigger: 'blur' },
    ],
    author: [
        { required: true, message: '请填写作者', trigger: 'blur' },
    ],
    status: [
        {
            message: '是否连载呢',
            trigger: 'change',
        },
    ],
    description: [
        { required: true, message: '请填写简介内容', trigger: 'blur' },
    ],
    imageUrl: [
        { required: true, message: '请上传作品封面', trigger: 'blur' },
    ],
    category_id: [
        { required: true, message: '请选择分类', trigger: 'blur' },
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            // addComics(ruleForm, formEl)
            save(ruleForm, formEl)
        } else {
            console.log('error submit!', fields)
        }
    })
}
// 添加作品
const addComics = async (ruleForm: any, formEl: any) => {
    let res: any = await reqAddComics(ruleForm)
    if (res.code === 200) {
        comicsIdStore.comicsId = res.data._id
        localStorage.setItem('comicsId',comicsIdStore.comicsId )
        console.log(comicsIdStore.comicsId)
        ElMessage({
            type: 'success',
            message: '作品添加成功'
        })
        ruleForm = {}
        formEl.resetFields()

    } else {
        ElMessage({
            type: 'error',
            message: '作品添加失败'
        })
    }
}

const save = async (ruleForm: any, formEl: any) => {
    if (!comicsIdStore.editORAdd._id) {
        addComics(ruleForm, formEl)
    } else {
        let res:any = await reqUpdateComics(ruleForm)
        if(res.code == 200){
            ElMessage({
            type: 'success',
            message: res.msg
        })
        }else{
            ElMessage({
            type: 'error',
            message: res.msg
        })
        }
       
    }
}




// 更新作品
const updateComics = async () => {
    Object.assign(ruleForm, comicsIdStore.editORAdd)

}


const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}



</script>