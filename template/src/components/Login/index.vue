<script setup lang="ts" name="AccountLogin">
  import { reactive, useTemplateRef } from 'vue'
  import { ArrowLeft } from '@element-plus/icons-vue'
  import LoginForm from './LoginForm.vue'
  import ResetForm from './ResetForm.vue'
  import VerifyDialog from './VerifyDialog.vue'

  enum MODULE_ENUM {
    LOGIN = "Login",  //登录
    RESET_PASSWORD = "ResetPassword" //忘记密码
  };

  const SHOW_FORGOT_PASSWORD = import.meta.env.VITE_SHOW_FORGOT_PASSWORD

  const verifyDialogRef = useTemplateRef('verifyDialogRef')

  const state = reactive({
    curModule: MODULE_ENUM.LOGIN,
    dialogVisible: false,
    captcha: '', // 用户填写的图片验证码
    verifyKey: ''
  })

  // 打开验证码弹窗
  const openDialog = () => {
    verifyDialogRef.value?.open()
  }

  // 关闭验证码弹窗
  const closeDialog = () => {
    verifyDialogRef.value?.close()
  }

  // 获取验证码
  const getCaptcha = (captcha: string, verifyKey: string) => {
    if (captcha) {
      state.captcha = captcha;
      state.verifyKey = verifyKey;
    } else {
      state.captcha = '';
      state.verifyKey = '';
    }
  }
</script>

<template>
  <div class="sz-login">
    <template v-if="state.curModule !== MODULE_ENUM.LOGIN">
      <div class="return" @click="state.curModule = MODULE_ENUM.LOGIN">
        <el-icon><ArrowLeft /></el-icon>
        <span class="text">返回</span>
      </div>
    </template>

    <!-- 登录组件 -->
    <template v-if="state.curModule === MODULE_ENUM.LOGIN">
      <LoginForm />
      <div v-if="SHOW_FORGOT_PASSWORD === 'true'" class="footer">
        <span class="password-btn" @click="state.curModule = MODULE_ENUM.RESET_PASSWORD">忘记密码？</span>
      </div>
    </template>

    <!-- 忘记密码 -->
    <template v-if="state.curModule === MODULE_ENUM.RESET_PASSWORD">
      <ResetForm
        :imgCaptchaInfo="{ 
          captcha: state.captcha,
          verifyKey: state.verifyKey 
        }"
        @openDialog="openDialog"
        @closeDialog="closeDialog"
      />
    </template>

    <!-- 验证码弹窗 -->
    <VerifyDialog ref="verifyDialogRef" @submit="getCaptcha" />
  </div>
</template>

<style lang="scss" scoped>
  .sz-login {
    padding: 0 40px 20px;
  }
  
  .footer {
    margin-top: 12px;
    width: 100%;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    .password-btn {
      color: var(--el-text-color-placeholder);
      cursor: pointer;
    }
  }
  
  .return {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    top: 20px;
    left: 20px;
    .el-icon {
      font-size: 16px;
      color: var(--el-icon-color-primary);
    }
    .text {
      color: var(--el-text-color-regular);
    }
  }
</style>