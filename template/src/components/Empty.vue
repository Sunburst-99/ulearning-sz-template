<script lang="ts" setup></script>

<template>
  <div class="empty">
    <img src="@images/empty.png" width="160" />
    <span><slot>暂无数据</slot></span>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    color: var(--el-text-color-secondary);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
}

</style>