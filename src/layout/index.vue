<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏导航 -->
      <el-aside width="200px" style="background-color:#001529;height: 100vh;">
        <el-scrollbar>
          <Logo />
          <el-menu router background-color="#001529" text-color="#fff" :default-active="$route.path" >
            <Menu :menuList="userStore.menuRouters" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <TabBar></TabBar>
        </el-header>
        <!-- 主体部分 -->
        <el-main class="main">
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Logo from './login/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import TabBar from './tabbar/index.vue'
import { useRoute, useRouter } from 'vue-router';
// 引入仓库
import useUserStore from '@/stores/modules/user'
const $route = useRoute()
const $router = useRouter()
const userStore = useUserStore()
// console.log($route)
// console.log(userStore.menuRouters)

</script>

<style scoped lang="scss">
.el-menu {
  border-right: none;
}

.el-main {
  height: calc(100vh - 60px);
  transition: all 0.3s;
}
</style>