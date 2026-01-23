<template>
  <el-dialog
    class="preview-dialog"
    v-model="visible"
    :modal="false"
    :fullscreen="true"
    :close-on-click-modal="false"
    :show-close="false"
    destroy-on-close
    @close="closeDialog"
  >
    <template #header>
      <div class="title-container">
        <div class="title-block ellipsis">{{ resource?.name }}</div>
        <div class="btn-block">
          <el-button v-if="showDownload" class="btn" @click="downLoad">
            下载<span v-if="resource?.fileSize">({{ formatBytes(resource?.fileSize) }})</span>
          </el-button>
          <el-button @click="visible = false">关闭</el-button>
        </div>
      </div>
    </template>
    <div class="resource-container">
      <ResourceContent
        :fileUrl="fileUrl!"
        :resource="{ fileType: resource?.fileType!, name: resource?.name! }"
      />
      <template v-if="showButton">
        <el-tooltip content="上一张">
          <div class="switch-btn prev" @click="prev"><el-icon><ArrowLeft /></el-icon></div>
        </el-tooltip>
        <el-tooltip content="下一张">
          <div class="switch-btn next" @click="next"><el-icon><ArrowRight /></el-icon></div>
        </el-tooltip>
      </template>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import useFileHooks from '@/hooks/useFileHooks'
import useUploadHooks from '@/hooks/useUploadHooks'
import { FILE_TYPE_NAME } from '@/ts/enums'
import ResourceContent from './ResourceContent.vue'

interface ResourceInfo {
  name: string
  fileType: FILE_TYPE_NAME
  filePath: string
  fileSize?: number
  previewUrl?: string
}

interface Props {
  showDownload?: boolean
}
withDefaults(defineProps<Props>(), {
  showDownload: false
})
interface Emit {
  (e: 'close'): void
}
const emit = defineEmits<Emit>()

const { formatBytes, formatFilePath } = useFileHooks()
const { obsDownload } = useUploadHooks()

const visible = ref(false)
const resource = ref<ResourceInfo | null>(null)
const showButton = ref(false)
const previewList = ref<ResourceInfo[]>([])
const currentIndex = ref(0)

const fileUrl = computed(() => {
  return resource.value?.previewUrl;
})

// 打开弹窗
const openDialog = (item: ResourceInfo) => {
  visible.value = true;
  showButton.value = false
  preview(item)
}

const closeDialog = () => {
  emit('close')
}

// 批量预览
const openDialogByBatch = (list: ResourceInfo[], index = 0) => {
  visible.value = true;
  showButton.value = true
  currentIndex.value = index
  previewList.value = list
  preview(previewList.value[currentIndex.value])
}

// 预览
const preview = (item: ResourceInfo) => {
  resource.value = { ...item, previewUrl: formatFilePath(item.filePath, item.fileType)}
}

// 下载
const downLoad = () => {
  const url = resource.value?.filePath || ''
  const name = resource.value?.name || ''
  obsDownload(url, name)
}

// 键盘左右切换图片
const onchangeByKeyup = (event: KeyboardEvent) => {
  if (!showButton.value) return
  if (event.key === 'ArrowRight') {
    next();
  } else if (event.key === 'ArrowLeft') {
    prev();
  }
}

// 上一个
const prev = () => {
  if (currentIndex.value === 0) return;
  if(previewList.value[currentIndex.value - 1].fileType !== FILE_TYPE_NAME.IMAGE) return;
  currentIndex.value--;
  preview(previewList.value[currentIndex.value]);
}

// 下一个
const next = () => {
  if (currentIndex.value === previewList.value.length - 1) return;
  if(currentIndex.value < previewList.value.length - 1){
    if(previewList.value[currentIndex.value + 1].fileType !== FILE_TYPE_NAME.IMAGE){
      return;
    }
  }
  currentIndex.value++;
  preview(previewList.value[currentIndex.value]);
}

onMounted(() => {
  window.addEventListener('keyup', (event) => {
    onchangeByKeyup(event)
  });
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', onchangeByKeyup);
})

defineExpose({ openDialog, openDialogByBatch })
</script>

<style lang="scss" scoped>
@import url('./index.scss');
:deep(.video-block) {
  height: 100%;
}
</style>
