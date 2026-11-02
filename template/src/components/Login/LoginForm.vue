<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { apiLogin } from "@/api/login";
import { useUserStore } from '@/store'
import type { UserInfo } from '@/types/user';
import type { FormInstance, FormRules } from 'element-plus'

interface FormInfo {
  loginName: string,
  password: string,
}

const userStore = useUserStore()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const loginForm = reactive<FormInfo>({
  loginName: "",
  password: "",
})
const loginRules = reactive<FormRules<FormInfo>>({
  loginName: [{ required: true, message: "请输入用户名", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "change" }],
})

// 登录
const handleSubmit = async () => {
  if (submitting.value || !formRef.value) return
  submitting.value = true
  try {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return
    const res = await apiLogin<UserInfo>(loginForm);
    userStore.updateUserInfo(res)
    window.location.reload()
  } catch {

  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="title-block">
    <span>账号登录</span>
  </div>

  <el-form ref="formRef" :model="loginForm" :rules="loginRules" @submit.prevent="handleSubmit">
    <el-form-item prop="loginName">
      <el-input v-model="loginForm.loginName" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-button class="btn" type="primary" native-type="submit" :loading="submitting">登录</el-button>
  </el-form>
</template>

<style lang="scss" scoped>
@import url("./index.scss");
.title-block{
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  span{
    position: relative;
    font-size: 20px;
    color: var(--el-text-color-primary);
    font-weight: 600;
    &::after {
      content: "";
      height: 5px;
      width: 100%;
      background: linear-gradient(90deg, var(--el-color-primary), rgba(22, 119, 255, 0) 100%);
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
.el-input {
  height: 40px;
}
.btn {
  margin-top: 70px;
  width: 100%;
  height: 44px;
}
</style>
