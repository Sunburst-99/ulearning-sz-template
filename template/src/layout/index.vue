<script lang="ts" setup>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  import LoginDialog from './components/LoginDialog.vue'

  const headerHeight = '48px'
</script>

<template>
  <div class="layout" :style="{'--headerHeight': headerHeight}">
    <Header :height="headerHeight" />
    <main>
      <router-view v-slot="{Component, route}">
        <Transition name="scale-transform" appear mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </router-view>
    </main>
    <Footer/>

    <!-- 登录弹窗 -->
    <LoginDialog />
  </div>
</template>

<style lang="scss" scoped>
  .layout {
    width: 100vw;
    min-height: 100vh;
    main {
      position: relative;
      width: 100vw;
      height: calc(100dvh - v-bind('headerHeight'));
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>