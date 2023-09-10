<template>
  <div class="menu-content">
    <el-card class="box-card1" shadow="never">
      <template #header>
        <div class="card-header">
          <el-dropdown @command="handleCommand">
            <el-button>
              添加菜单 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="parent">添加父级菜单</el-dropdown-item>
                <el-dropdown-item :disabled="!isChecked || pid == 0" command="child">添加子菜单</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <div class="menu-list">
        <el-tree ref="treeRef" :expand-on-click-node="false" :highlight-current="true" :data="menuListData"
          @node-click="clickTree" show-checkbox node-key="rid" default-expand-all :props="defaultProps"
          :default-expanded-keys="[]" :default-checked-keys="[]" />
      </div>
    </el-card>
    <el-card class="box-card2" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="menu-iocn">
            <el-icon style="color: #1890ff; font-size: 20px">
              <Menu />
            </el-icon>
          </div>
          <span>编辑菜单：{{ checkedMenu && checkedMenu.title }}</span>
        </div>
      </template>
      <div class="menu-form">
        <el-alert title="从菜单列表选择一项后，进行编辑" type="success" :closable="false" />
        <el-form ref="ruleFormRef" :size="formSize" status-icon :model="checkedMenu" :rules="rules" label-width="90px"
          class="demo-ruleForm">
          <el-form-item label="类型："> 侧边栏 </el-form-item>
          <el-form-item label="菜单名称:" prop="title">
            <el-input v-model="checkedMenu.title" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="菜单图标:" prop="icon">
            <el-input v-model="checkedMenu.icon" placeholder="请输入菜单图标" />
          </el-form-item>
          <el-form-item label="路由地址:" prop="path">
            <el-input v-model="checkedMenu.path" placeholder="请输入以/开头的路由地址" />
          </el-form-item>
          <el-form-item>
            <!-- :disabled="!isChecked" -->
            <el-button type="primary" :disabled="!isChecked" @click="submitForm(ruleFormRef)">确认</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <MenuAdd :menuAddVisible="menuAddVisible" :pid="pid" :parentTitle="parentTitle"
      @menuAddVisibleClose="menuAddVisibleClose" @menuAddSuccess="menuAddSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import {  reqMenuList, reqUpdateMenu } from '@/api/acl/menu/index'
import type { FormInstance, FormRules } from 'element-plus'
import MenuAdd from "./component/MenuAdd.vue"
import { getTreeMenus } from "@/utils/tree";
import { IMenuItem, ITreeMenuItem } from "@/api/acl/menu/type";

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const menuListData = ref<ITreeMenuItem[]>([]);
const pid = ref<number>(0);
const parentTitle = ref<string>("");
const menuAddVisible = ref(false);
const isChecked = ref(false);
// const checkedMenu = ref([])
const defaultProps = {
  children: "children",
  label: "title",
};

const treeRef = ref();

const checkedMenu = reactive<IMenuItem>({
  _id: '',
  pid: 0,
  name: '',
  rid: 0,
  title: '',
  icon: '',
  path: '',

});



const rules = reactive<FormRules<IMenuItem>>({
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




onMounted(() => {
  getMenuListData()
});
const getMenuListData = async () => {
  const res: IMenuItem[] = await reqMenuList()
  // console.log(res)
  menuListData.value = getTreeMenus(res)
}

const submitForm = (formEl: FormInstance | undefined) => {
  // console.log(checkedMenu)
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      updateMenu()
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const updateMenu = async () => {
  let res = await reqUpdateMenu(checkedMenu)
  if(res.code == 200){
    ElMessage({
      type: 'success',
      message: res.msg
    })
    // 刷新页面
    window.location.reload()
  }
}


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  isChecked.value = false
}

// 点击节点
const clickTree = (data: any) => {
  Object.assign(checkedMenu, data)
  // console.log(checkedMenu)
  isChecked.value = true;
  // 将父亲id（rid）赋值给孩子的父亲id（pid）字段
  // 孩子会根据pid找父亲
  pid.value = checkedMenu.rid;
  parentTitle.value = checkedMenu.title;
};


const handleCommand = (command: string) => {
  if (command === "parent") {
    pid.value = 0;
    menuAddVisible.value = true;
  } else {
    menuAddVisible.value = true;
  }
};
const menuAddVisibleClose = () => {
  menuAddVisible.value = false;
  // pid.value =checkedMenu.rid ;

};
const menuAddSuccess = () => {
  menuAddVisible.value = false;
  // 刷新页面
  window.location.reload()
  // getMenuListData();
};



</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
