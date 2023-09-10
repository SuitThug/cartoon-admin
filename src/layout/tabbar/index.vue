<template>
    <div class="toolbar">
        <div class="toolbar-left">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="toolbar-right">
            <Setting></Setting>
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from "./breadcrumb/index.vue";
import Setting from "./setting/index.vue";
</script>

<style  lang="scss">
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    .toolbar-left {
        display: flex;
        align-items: center;
        margin-left: 10px;
        align-items: center;
        .is_icon {
            margin-right: 10px;
            vertical-align:top
        }
    }

    .toolbar-right {
        display: flex;
        align-items: center;
        margin-right: 10px;
       
      img{
        margin-right:20px;
      }
    }
}
</style>