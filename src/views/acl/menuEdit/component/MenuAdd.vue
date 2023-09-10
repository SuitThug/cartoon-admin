<template>
  <el-drawer v-model="isVisible" :title="`${pid === 0 ? '添加父级菜单' : '添加子菜单：' + parentTitle}`" :with-header="true"
    size="22%" @close="cancelClick">
    <el-form ref="ruleFormRef" :model="formState" :rules="rules" label-width="90px" class="demo-ruleForm">
      <el-form-item label="菜单名称:" prop="title">
        <el-input v-model="formState.title" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单图标:" prop="icon">
        <el-input v-model="formState.icon" placeholder="请输入菜单图标" />
      </el-form-item>
      <el-form-item label="路由地址:" prop="path">
        <el-input v-model="formState.path" placeholder="请输入以/开头的路由地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reqInsertMenu, reqMenuList } from '@/api/acl/menu/index'
import { ElMessage, ElMessageBox } from 'element-plus'
const isVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
let props = defineProps(['menuAddVisible', 'pid', 'parentTitle'])
let $emit = defineEmits(['menuAddVisibleClose', 'menuAddSuccess'])
interface RuleForm {
  title: string
  icon: string
  path: string
}
const formState = reactive<RuleForm>({
  title: "",
  icon: "",
  path: "",
})
const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: '请填写菜单名', trigger: 'blur' },
  ],
  icon: [
    { required: true, message: '请填写图标', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入以/开头的路由地址', trigger: 'blur' },
  ],
})
const cancelClick = () => {
  isVisible.value = false
  ruleFormRef.value?.resetFields();
  $emit("menuAddVisibleClose");
}
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const data = JSON.parse(JSON.stringify(formState));
      const id = props.pid;
      if (id) {
        // 追加属性
        data.pid = id;
      }
      addMenu(data)
      cancelClick();
      // 成功后通知父组件，更新页面
      $emit("menuAddSuccess");

    } else {
      console.log('error submit!')
      return false
    }
  })
}
const addMenu = async (data: any) => {
  let reslut: any = await reqInsertMenu(data)
  if (reslut.code == 200) {
    ElMessage({
      type: 'success',
      message: reslut.msg
    })
  }

}
watch(
  () => props.menuAddVisible,
  (val) => {
    console.log(val)
    if (val) {
      isVisible.value = val;
    } else {
      isVisible.value = val;
    }
  }
);
</script>
<style></style>