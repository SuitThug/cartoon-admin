<template>
  <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div class="card_box">
          <Achievement/>
      </div>
<el-card >
  <div class="pageView">
    <div id="main" ref="main" style="min-width: 500px; height: 400px"></div>
    <el-card class="box-card" style="width: 300px;border:none"  >
      <template #header>
        <div class="card-header">
          <span>热门排行</span>
          <el-button class="button" text>查看更多</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
    </el-card>
  </div>
  </el-card>
</template>
 
<script lang="ts" setup>
//按需引入
import { onMounted, ref } from "vue";
import Achievement from "./Achievement/index.vue";

//引入创建的echarts.ts文件
import echarts from "@/echart/index";
import { ECOption } from '@/echart/index'
const main = ref<HTMLElement | null>(null)
onMounted(() => {
  // var chartDom = document.getElementById("main")!;
  const myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  const option: ECOption = {
    title: {
      text: "访问量趋势",
    },
    tooltip: {},
   
    xAxis: {
      data: ["1", "2", "3", "4", "5", "6", '7','8','9','10','11','12'],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20, 30,36, 10, 10, 20, 30],
        barWidth: 20, // 设置柱状图宽度为 20
      },

    ],
  };

  // 使用刚指定的配置项option和数据显示图表myChart。
  myChart.setOption(option);

});

</script>
 
<style scoped lang="scss">
.card_box{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pageView {
  display: flex;
  justify-content: space-between;
  #main{
    flex: 1;
    padding: 0;
    margin: 0;
  }
}

.card-header {
  display: flex;
  height: 10px;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>