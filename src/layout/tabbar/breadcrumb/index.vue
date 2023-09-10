<template>
    <el-icon class="is_icon" :size="20">
        <Component is="Expand"></Component>
    </el-icon>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in $router.matched" :key="index" :to="item.path" v-show="item.meta.title" >
            <el-icon v-if="item.meta.icon" :size="13" style="vertical-align:top">
                <Component :is="item.meta.icon"></Component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import {useRoute} from "vue-router"
// 获取路由对象
const $router = useRoute()
</script>

<style scoped></style>