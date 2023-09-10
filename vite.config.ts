
import path from 'path'
import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
   // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return{
    
    plugins: [
      vue(),
      vueJsx(),
      
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    //scss全局变量一个配置
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]: {
          // 服务器地址
          target: env.VITE_SERVE,
          // 开启代理
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      '/upload': {
          // 服务器地址
          target: env.VITE_SERVE,
          // 开启代理
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/upload/, '/'),
        },
      }
    }
  }
})
