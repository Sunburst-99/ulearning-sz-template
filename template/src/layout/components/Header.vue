<script setup lang="ts">
  import { apiLogout } from '@/api/login';
  import { User } from '@element-plus/icons-vue'
  import { useUserStore, useAppStore } from '@/store'

  interface Props {
    height: string
  }
  defineProps<Props>()

  const { userInfo, isLogin } = useUserStore();
  const AppStore = useAppStore()

  const login = () => {
    AppStore.loginDialog = true
  }

  // 头像下拉
  const handleCommand = async (command: string) => {
    switch (command) {
      case 'logout':
        await apiLogout()
        useUserStore().logout()
        break;
    }
  }
</script>

<template>
  <header class="my-common-layout">
    <img class="logo" src="@images/logo.png" alt="" height="30">
    <div class="user-block">
      <el-button v-if="!isLogin" type="primary" :icon="User" @click="login">登录</el-button>
      <el-dropdown v-else @command="handleCommand">
        <div class="user">
          <el-image :src="userInfo.headimage ?? ''" fit="cover">
            <template #error>
              <img src="@images/avatar.png" />
            </template>
          </el-image>
          <span class="name">{{ userInfo.name }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  header {
    width: 100%;
    height: v-bind(height);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    .user-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      .user {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      }
      .el-image, img {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
</style>