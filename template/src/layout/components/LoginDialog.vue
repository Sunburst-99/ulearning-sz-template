<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import Login from '@/components/Login/index.vue'
  const AppStore = useAppStore()
</script>

<template>
  <el-dialog
    v-model="AppStore.loginDialog"
    width="min(460px, calc(100vw - 32px))"
    :close-on-click-modal="false"
    destroy-on-close
    show-close
  >
    <Login />
  </el-dialog>
</template>
