<template>
    <div class="login">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <div class="grid-content ep-bg-purple-dark" />
                <div class="login-right">
                    <h1>HELLO</h1>
                    <h2>欢迎来到admin</h2>
                    <el-form :model="regPages.loginType" ref="ruleFormRef" :rules="rules">
                        <el-form-item prop="phone">
                            <el-input placeholder="请输入手机号" :prefix-icon="User" v-model="regPages.loginType.phone" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="regPages.loginType.password"
                                :prefix-icon="Lock" :show-password="true" />
                        </el-form-item>
                    </el-form>
                    <el-form-item class="login-btn">
                        <el-button type="primary" @click="onSubmit" class="login-btn-childer" :loading="is_loading">
                            确定登录
                        </el-button>
                        <el-button class="login-btn-childer" @click="onRegister">注册账号</el-button>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { User, Lock, Loading } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 数据类型
import { regPage } from '@/api/user/type'
// 接口
import useUserStore from '@/stores/modules/user'
//引入用户相关的小仓库
// 引入格式化的类型
const regPages = reactive(new regPage())
const ruleFormRef = ref()
const $router = useRouter()
const $route = useRoute()
let is_loading = ref(false)

let useStore = useUserStore()
const onSubmit = async () => {
    //保证全部表单相校验通过再发请求
    // ruleFormRef 是获取当前表单的DOM元素
    await ruleFormRef.value.validate()
    try {
        await useStore.reqLogin(regPages.loginType)
        ElNotification({
            message: '登录成功',
            type: 'success',
        })
        let redirect: string = $route.query.redirect as string
        $router.push({ path:redirect || '/' })
    } catch (error) {
        ElNotification({
            message: (error as Error).message,
            type: 'error',
        })
    }


}

const validatorPhone = (rule: any, value: any, callback: any) => {
    if (value.length === 0) {
        callback(new Error('请输入手机号'))
    } else if (value.length < 11 || value.length > 11) {
        callback(new Error('请输入11位号码'))
    } else {
        callback()
    }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
    if (value.length === 0) {
        callback(new Error('请输入密码'))
    } else if (value.length < 6 || value.length > 12) {
        callback(new Error('密码应为6-12位的任意组合'))
    } else {
        callback()
    }
}

const onRegister = () => {
    $router.push({path:'/register'})
}

const rules = {
    phone: [
        {
            trigger: 'change',
            validator: validatorPhone
        },

    ],
    password: [
        {
            trigger: 'blur',
            validator: validatorPassword
        },
    ]
}
</script>
  
<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100vh;
    background-image: url('@/assets/images/background-34eb3d2b.jpg');

    .login-right {
        position: relative;
        width: 75%;
        top: 30vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        padding: 40px;

        h1 {
            color: white;
            font-size: 40px;
        }

        h2 {
            font-size: 20px;
            color: white;
            margin: 20px 0px;
        }

        .login-btn {
            display: flex;
        }

        .login-btn-childer {
            flex: 1;
        }
    }
}
</style>