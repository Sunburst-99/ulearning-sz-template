<template>
  <el-dialog
    class="preview-dialog"
    :class="{ 'preview-dialog--mobile': appStore.isMobile }"
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
          <el-button class="close-button" @click="visible = false">关闭</el-button>
        </div>
      </div>
    </template>
    <div class="resource-container">
      <ResourceContent
        v-if="resource"
        :fileUrl="resource.previewUrl"
        :resource="resource"
      />
      <template v-if="showButton">
        <el-tooltip content="上一张" :disabled="appStore.isMobile">
          <button type="button" class="switch-btn prev" aria-label="上一张" :disabled="!canPrev" @click="prev"><el-icon><ArrowLeft /></el-icon></button>
        </el-tooltip>
        <el-tooltip content="下一张" :disabled="appStore.isMobile">
          <button type="button" class="switch-btn next" aria-label="下一张" :disabled="!canNext" @click="next"><el-icon><ArrowRight /></el-icon></button>
        </el-tooltip>
      </template>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="PreviewDialog">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import useFileHooks from '@/hooks/useFileHooks'
import useUploadHooks from '@/hooks/useUploadHooks'
import { useAppStore } from '@/store'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
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
const appStore = useAppStore()

const { formatBytes, formatFilePath } = useFileHooks()
const { obsDownload } = useUploadHooks()

const visible = ref(false)
const resource = ref<(ResourceInfo & { previewUrl: string }) | null>(null)
const showButton = ref(false)
const previewList = ref<ResourceInfo[]>([])
const currentIndex = ref(0)

const canPrev = computed(() => currentIndex.value > 0 && previewList.value[currentIndex.value - 1]?.fileType === FILE_TYPE_NAME.IMAGE)
const canNext = computed(() => currentIndex.value < previewList.value.length - 1 && previewList.value[currentIndex.value + 1]?.fileType === FILE_TYPE_NAME.IMAGE)

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
  if (!list.length || !Number.isInteger(index) || index < 0 || index >= list.length) return
  visible.value = true;
  showButton.value = list.length > 1
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
  if (!resource.value) return
  return obsDownload(resource.value.filePath, resource.value.name)
}

// 键盘左右切换图片
const onchangeByKeyup = (event: KeyboardEvent) => {
  if (!visible.value || !showButton.value) return
  if (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable="true"]')) return
  if (event.key === 'ArrowRight') {
    next();
  } else if (event.key === 'ArrowLeft') {
    prev();
  }
}

// 只允许切换到相邻图片，保持原有批量预览规则。
const prev = () => {
  if (!canPrev.value) return
  currentIndex.value--
  preview(previewList.value[currentIndex.value])
}

const next = () => {
  if (!canNext.value) return
  currentIndex.value++
  preview(previewList.value[currentIndex.value])
}

onMounted(() => window.addEventListener('keyup', onchangeByKeyup))
onBeforeUnmount(() => window.removeEventListener('keyup', onchangeByKeyup))

defineExpose({ openDialog, openDialogByBatch })
</script>

<style lang="scss" src="./index.scss"></style>
