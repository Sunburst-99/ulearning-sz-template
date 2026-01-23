<script lang="ts" setup>
  import Logo from '@/components/Logo/index.vue'
  import Login from '@/components/Login/index.vue'
</script>

<template>
  <div class="login-container">
    <Logo class="logo" />
    <Login class="login" />
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  background: url("https://leicloud-huawei.obs.cn-north-4.myhuaweicloud.com/resource/web/sz/sjjx/login-bg.png") no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  .logo {
    position: absolute;
    left: 40px;
    top: 40px;
  }
}
.login {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 15%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 460px;
  min-height: 420px;
  padding: 40px;
}
</style>
