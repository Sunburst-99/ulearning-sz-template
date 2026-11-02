<script lang="ts" setup name="SiteLayout">
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  import LoginDialog from './components/LoginDialog.vue'

</script>

<template>
  <div class="layout">
    <Header />
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
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    main {
      position: relative;
      flex: 1;
      min-height: 0;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
