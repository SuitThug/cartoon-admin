<template>
    <el-button size="small" icon="Refresh" circle  @click="updateRefsh"/>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen" />

    <el-popover placement="bottom" :width="300" trigger="hover">
        <el-form>
            <el-form-item label="主题颜色">
                <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch @change="onswitch" v-model="dark" active-icon="Moon"  inactive-icon="Sunny" inline-prompt/>
            </el-form-item>
        </el-form>
        <template #reference>
            <el-button size="small" icon="Setting" circle />
        </template>
    </el-popover>

    <img :src="useStore.avatar" alt="" style="width:24px;height:24px;margin:0 10px;border-radius:50% ">
    <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
            {{ useStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
import useLayOutSettingStore from '@/stores/modules/setting';
let layoutSettingStore = useLayOutSettingStore();
const useStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
const visible = ref(false)
const dark = ref(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// console.log(useStore.username)
const logout = async () => {
    try {
        await useStore.reqLogout()
        $router.push({ path: '/login', query: { redirect: $route.path } })
    } catch (error) {

    }

}
// 暗黑模式
const onswitch = ()=>{
    let html = document.documentElement
    console.log(html)
    dark.value? html.className='dark':html.className='';
}
// 设置主题
const setColor = () =>{
    let html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
}

//刷新按钮点击回调
const updateRefsh = () => {
    layoutSettingStore.refsh = !layoutSettingStore.refsh;
};
//全屏按钮点击的回调
const fullScreen = () => {
    //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
    let full = document.fullscreenElement;
    //切换为全屏模式
    if (!full) {
        //文档根节点的方法requestFullscreen,实现全屏模式
        document.documentElement.requestFullscreen();
    } else {
        //变为不是全屏模式->退出全屏模式
        document.exitFullscreen();
    }
}
</script>

<style scoped></style>