<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
        status-icon>
        <el-form-item label="章节名" prop="chapterName" style="width:350px;">
            <el-input v-model="ruleForm.chapterName" />
        </el-form-item>
        <!-- <el-form-item label="图片上传" prop="imageUrlGather">
            <Uploadimgs :comicsId="comicsId"></Uploadimgs>
        </el-form-item> -->
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                Create
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
    </el-form>
    <!--  -->
    <div>
        <hr style="margin-top: 100px; background-color: #f9f9f9;" />
        <h2>章节</h2>
        <div class="chapterList">
            <el-button text v-for="item in chapterList" class="chapterList_btn">第{{ item.chapterName
 >= 10 ? item.chapterName : '0' + item.chapterName }}章</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reqAddChapter, reqQueryChapter } from '@/api/comics/index'
import comicsStore from '@/stores/comics';
interface RuleForm {
    chapterName: string
    imageUrlGather: []
}
const comicsIdStore = comicsStore()
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    chapterName: '',
    imageUrlGather: [],
})
onMounted(() => {
    getChapter()
})

const chapterList = ref()
const getChapter = async ()=>{
  let res = await reqQueryChapter(comicsIdStore.comicsId)
  console.log(res)
  if(res.code == 200){
    chapterList.value = res.data
    console.log(chapterList.value)
  }
}


const rules = reactive<FormRules<RuleForm>>({
    chapterName: [
        { required: true, message: '请填写章节名', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            addChapter()
        } else {
            console.log('error submit!', fields)
        }
    })
}
let addChapter = async () => {
    let res: any = await reqQueryChapter(comicsIdStore.comicsId)
    if (res.code == 200) {
        console.log('章节中拿到的漫画id:'+ comicsIdStore.comicsId)
        const obj = {
            chapterName: ruleForm.chapterName,
            comicsId: comicsIdStore.comicsId,
            order: res.total + 1
        }
        let res2:any = await reqAddChapter(obj)
        if (res2.code == 200) {
            comicsIdStore.chapterId = res2.data._id
            localStorage.setItem('chapterId', res2.data._id)
            ruleForm.chapterName = ''
            ElMessage({
                message: '章节添加成功',
                type: 'success',
            })
           getChapter()
        } else {
            ElMessage({
                message: '章节添加失败',
                type: 'error',
            })
        }
    }

}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}


</script>
<style lang="scss">
.chapterList {
    width: 100%;
    margin-top: 30px;
}

.chapterList .el-button {
    // margin-left: 10px;

    text-align: center;
    border: 1px solid;
    margin-top: 10px;
}
</style>