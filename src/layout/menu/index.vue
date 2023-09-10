<template>
    <!-- <template v-for="(item, index) in menuList" :key="item.path" > -->
        <!-- 符合三个 && 条件 标题就说明里面有需要渲染的子组件 -->
        <!-- <el-sub-menu v-if="item.children && item.children.length > 0 && item.children[0].meta.hidden==false" :index="item.path">
            <template #title>
                <el-icon :size="20">
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuList="item.children"></Menu>
        </el-sub-menu>
        <el-menu-item v-else-if="item.meta.hidden==false" :index="item.path">
            <template #title>
                <el-icon :size="20">
                    <component :is="item.meta.icon"></component>
                </el-icon>
                {{ item.meta.title }}
            </template>
        </el-menu-item>
    </template> -->

    <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但只有一个 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且大于一个 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>


</template>

<script setup lang="ts">
defineProps(['menuList'])
</script>
<script lang="ts">
// 起名字，递归需要
export default {
  name: 'Menu',
}
</script>
<style scoped></style>