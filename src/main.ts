
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//引入模板的全局的样式
import '@/styles/index.scss'
import '@/styles/style.css'
// elemetnt-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'
// 引入大仓库pinia
import pinia from './stores'
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入echart
// import echarts from './echart/index'
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
// 注册自定义插件
app.use(gloalComponent)
// 注册echart，vue3采用provide, inject方式使用
// app.provide('$echarts', echarts); 
//引入路由鉴权文件
import './permission'
app.mount('#app')
