<template>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="添加漫画" name="first" >
                <Comics />
            </el-tab-pane>
            <el-tab-pane label="添加章节/图片" name="second" >
                <ChaptersOrImg/>
            </el-tab-pane>
            <el-tab-pane label="Role" name="third">
                <ChapterList  />
            </el-tab-pane>
        </el-tabs>
</template>
<script lang="ts" setup>
import Comics from './comics/index.vue'
import ChapterList from './chapterList/index.vue'
import ChaptersOrImg from './chaptersOrImg/index.vue'
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}
</script>
<style>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>