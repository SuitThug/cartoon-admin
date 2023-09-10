<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
    <!-- <el-form-item label="章节名" prop="chapterName" style="width:350px;">
            <el-input v-model="ruleForm.chapterName" />
        </el-form-item> -->
    <el-form-item label="图片上传" prop="imageUrlGather">
      <Uploadimgs @imgList="chapterImgemit"></Uploadimgs>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Create
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import Uploadimgs from '../components/uploads.vue';
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { reqChapterImg } from '@/api/comics/index'
import { ElMessage } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
interface RuleForm {
  imageUrlGather: []
}
const ruleForm = reactive<RuleForm>({
  imageUrlGather: [],
})
const rules = reactive<FormRules<RuleForm>>({
  imageUrlGather: [
    { required: true, message: '请上传图片', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      chapterImg()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const chapterImgemit = async (img: any) => {
  ruleForm.imageUrlGather = img
}
const chapterImg = async () => {
  let res = await reqChapterImg(ruleForm.imageUrlGather)
  console.log(res)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '图片添加成功'
    })
    
  } else {
    ElMessage({
      type: 'error',
      message: '图片添加失败'
    })
  }
}



const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>

<style scoped></style>