<template>
  <TransitionGroup name="list" tag="div" class="list-block">
    <template v-if="fileList.length">
      <div
        class="item-block"
        v-for="(file, index) in fileList"
        :key="'file' + index"
      >
        <div class="file-block">
          <el-icon class="icon"><Document /></el-icon>
          <span class="name ellipsis">{{ file.name }}</span>
          <el-icon class="scusess-icon" v-if="file.status === 'success'"><CircleCheck /></el-icon>
          <el-icon class="close-icon" :class="{'my-disabled': disabled}" v-if="file.status === 'success'" @click="onRemove(file)">
            <Close />
          </el-icon>
        </div>
        <el-progress
          v-if="file.status === 'uploading'"
          :stroke-width="2"
          :percentage="file.percentage"
        />
      </div>
    </template>
  </TransitionGroup>
</template>

<script lang="ts" setup>

interface Props {
  fileList: any
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits(['remove'])

  // 移除文件
const onRemove = (file: any) => {
  if (props.disabled) return
  emit('remove', file)
}
</script>

<style lang="scss" scoped>
.list-block{
  width: 100%;
}
.item-block{
  width: 100%;
  position: relative;
  margin-top: 8px;
}
.file-block {
  width: 100%;
  height: 26px;
  font-size: 14px;
  border-radius: var(--el-border-radius-small);
  color: var(--el-text-color-regular);
  font-weight: 400;
  line-height: 26px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all .5s;
  .name {
    flex: 1;
    width: 400px;
  }
  .el-icon {
    width: 14px;
    display: inline-block;
    vertical-align: middle;
  }
  .scusess-icon {
    color: var(--el-color-success);
  }
  .close-icon {
    display: none;
    &:hover {
      color: var(--el-color-primary);
    }
  }
  &:hover {
    background-color: var(--el-fill-color-light);
    .scusess-icon {
      display: none;
    }
    .close-icon {
      display: block;
    }
  }
}
.el-progress {
  width: 100%;
}
.list-enter-active,
.list-leave-active {
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.list-enter-from {  
  opacity: 0;
  transform: translateY(-20px);
}
.list-enter-to { 
  opacity: 1;
  transform: translateY(0);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>