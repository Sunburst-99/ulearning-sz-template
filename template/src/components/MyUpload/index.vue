<template>
  <div class="my-upload">
    <el-upload
      ref="uploadRef"
      :list-type="type === 'card' ? 'picture-card' : 'text'"
      :drag="type === 'drag'"
      :multiple="multiple"
      action="#"
      :show-file-list="type === 'card'"
      :fileList="uploadFileList"
      :limit="multiple ? limit : 1"
      :accept="accept"
      :disabled="disabled"
      :auto-upload="autoUpload"
      :before-upload="onBeforeUpload"
      :http-request="onRequest"
      :on-change="onChange"
      :on-exceed="onExceed"
      :on-remove="removeFile"
    >
      <slot>
        <template v-if="type === 'default'">
          <el-button type="primary">点击上传</el-button>
        </template>
        <template v-if="type === 'drag'">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处或<em>点击上传</em>
          </div>
        </template>
        <template v-if="type === 'card'">
          <el-icon><Plus /></el-icon>
        </template>
      </slot>
      <template v-if="tip" #tip>
        <div class="el-upload__tip">
          <span>{{ tip }}</span>
        </div>
      </template>

      <!-- 自定义缩略图 -->
      <template #file="{ file }" v-if="type === 'card'">
        <!-- 上传中 -->
        <el-progress v-if="file.status === 'uploading'" type="circle" :percentage="file.percentage" />
        <!-- 待上传 / 上传成功 -->
        <template v-if="file.status === 'success' || (!autoUpload && file.status === 'ready')">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="onPreview(file)"
            >
              <el-icon><zoom-in /></el-icon>
            </span>
            <span
              class="el-upload-list__item-delete"
              :class="{'my-disabled': disabled}"
              @click="removeFile(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </template>
      </template>
    </el-upload>

    <FileList
      v-if="showFileList && type !== 'card'"
      :fileList="fileList"
      :disabled="disabled"
      @remove="removeFile"
    />

    <el-dialog v-model="dialogVisible">
      <div class="preview-img">
        <img :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="MyUpload">
import { ref, watch, computed, nextTick } from 'vue';
import useUploadHooks from "@/hooks/useUploadHooks";
import { ElMessage, genFileId } from 'element-plus';
import { Delete, Plus, UploadFilled, ZoomIn } from '@element-plus/icons-vue';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import FileList from './FileList.vue'

interface FileInfo {
  url: string,
  name: string
}

// 单位转换表
const units = {
  'B': 1,
  'KB': 1024,
  'MB': 1024 ** 2,
  'GB': 1024 ** 3,
  'TB': 1024 ** 4
};

interface Props {
  modelValue?: FileInfo[] | FileInfo
  type?: 'default' | 'drag' | 'card'
  multiple?: boolean
  limit?: number
  accept?: string
  size?: number | string //（为number时单位： M，为string是单位： 'B' | 'KB' | 'MB' | 'GB' | 'TB')
  tip?: string
  autoUpload?: boolean
  showFileList?: boolean // 是否显示文件列表
  basePath?: string
  uptokenHost?: string
  openPartUploadSize?: number // 超过此大小开启分段上传，单位 MB
  needPartUpload?: boolean  // 是否开启分段上传
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(),{
  type: 'default',
  multiple: false,
  autoUpload: true,
  showFileList: true,
  openPartUploadSize: 100,  // 默认100M
  needPartUpload: false,
  disabled: false,
})

interface Emit {
  (e: 'update:modelValue', fileList: any): void
  (e: 'change', fileList: any): void
  (e: 'getProgress', fileList: any): void
}
const emit = defineEmits<Emit>()

const { obsUploader, formatUploadPath, uploadByLocal } = useUploadHooks()

const uploadRef = ref<UploadInstance>()

const fileList = ref<any[]>([])
// 手动上传模式对外仍返回原始文件，内部补齐 Element Plus submit 所需的 raw 和状态。
const uploadFileList = computed(() => {
  if (props.autoUpload) return fileList.value
  return fileList.value.map(file => {
    const { name, uid, status, size, percentage, url } = file
    return file instanceof File
      ? { name, uid, status: status ?? 'ready', size, percentage, url, raw: file }
      : file
  })
})
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
// 每个文件保存自己的 SDK 实例，避免并发上传时取消到其他文件。
const uploadClients = new Map<number, ReturnType<typeof obsUploader>>()

const getFileList = () => {
  if (props.modelValue) {
    fileList.value = typeof props.modelValue === 'object' && !Array.isArray(props.modelValue) ?  [props.modelValue] : props.modelValue
  } else {
    fileList.value = []
  }
}
getFileList()

watch(() => props.modelValue, (val) => {
  getFileList()
})

// 是否为本地部署上传
const isLocalUpload = computed(() => {
  return import.meta.env.VITE_UPLOAD_STRATEGY === "local"
})

// 上传前
const onBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!props.autoUpload) return

  const isLegal = checkFile(file)
  if (!isLegal) {
    return false
  }
  
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index === -1) {
    fileList.value.push(file);
  }
}

// 文件校验
const checkFile = (file: File) => {
  // 校检文件类型
  const accepts = props.accept ? props.accept.split(',').map(v => v.trim()) : []
  const suffix = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
  if (props.accept && !accepts.includes(suffix)) {
    ElMessage.error(`上传格式仅限于${props.accept}`);
    return false
  }

  // 校检文件大小
  if (props.size) {
    const isString = isNaN(Number(props.size))
    const size = isString ? convertToBytes(props.size as string) || 0 : (props.size as number) * 1024 ** 2
    if(file.size && file.size > size) {
      ElMessage.error(`文件${file.name}的大小超出限制!`);
      return false
    }
  }
  return true
}

// 转换文件大小为字节的辅助函数
type unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'
const convertToBytes = (sizeStr: string) => {
  // 正则表达式匹配数字和单位部分
  const regex = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/;
  const match = sizeStr.match(regex);
  if (!match) return
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase() as unit ;
  return value * units[unit];
}

// 文件变更
const onChange: UploadProps['onChange'] = (file) => {
  if (props.autoUpload) return

  // 手动上传时在change事件中校验文件
  if (file.status === 'ready') {
    if (!file.raw) return
    const isLegal = checkFile(file.raw)
    if (!isLegal) {
      removeFile(file.raw);
      return false
    }
    fileList.value.push(Object.assign(file.raw, { status: file.status, url: file.url }));
    getFile()
  }
}

// 文件数超出限制
const onExceed: UploadProps['onExceed'] = async (files) => {
  if (props.multiple) {
    ElMessage.warning('已达到上传数量上限！');
    return
  }

  const file = files[0]
  if (!file || !checkFile(file)) return

  for (const oldFile of fileList.value) {
    uploadRef.value?.abort(oldFile)
    if (oldFile.uploadId && oldFile.status === 'uploading') {
      uploadClients.get(oldFile.uid)?.abortMultipartUpload(oldFile.key, oldFile.uploadId)
    }
  }
  uploadClients.clear()
  uploadRef.value?.clearFiles()
  fileList.value = []
  await nextTick()
  const rawFile = Object.assign(file, { uid: genFileId() })
  uploadRef.value?.handleStart(rawFile)
  if (props.autoUpload) uploadRef.value?.submit()
}

// type === card时预览图片
const onPreview: UploadProps['onPreview'] = (uploadFile) => {
  if (props.type === 'card') {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }
}

// 移除文件
const removeFile = (file: any) => {
  if (props.disabled) return
  // 分段上传的文件，上传中被删除则取消上传
  if (props.autoUpload && file.uploadId && file.status === "uploading") {
    uploadClients.get(file.uid)?.abortMultipartUpload(file.key, file.uploadId);
  }

  // 自动上传且beforeupload校验不通过的文件，不执行以下代码
  if (props.autoUpload && file.status === 'ready') return

  uploadClients.delete(file.uid)
  fileList.value = fileList.value.filter(f => f.uid !== file.uid);
  getFile()
}

// 上传
const onRequest: any = (file: any) => {
  if (isLocalUpload.value) {
    localUpload(file.file);
  } else {
    file.file.key = formatUploadPath(file.file, props.basePath) // 修改上传路径
    obsUpload(file.file);
  }
}

// 本地部署上传
const localUpload = (file: UploadRawFile) => {
  uploadByLocal(file, 
    (url: string) => { onSuccess(file, url) },
    (error: any) => { onFail(file, error?.message) }, 
    (percent: number) => { onProgress(file, percent) }
  )
}

// obs上传
const obsUpload = (file: UploadRawFile) => {
  const obs = obsUploader({
    uptokenHost: props.uptokenHost ? props.uptokenHost : import.meta.env.VITE_COURSE_API
  });
  uploadClients.set(file.uid, obs)
  obs.onSuccess = async () => {
    uploadClients.delete(file.uid)
    onSuccess(file)
  };
  obs.onProgress = (file: UploadRawFile, percent: number) => {
    onProgress(file, percent)
  };
  obs.onError = (file: UploadRawFile, error: { msg: string }) => {
    uploadClients.delete(file.uid)
    onFail(file, error.msg)
  }
  if (props.needPartUpload && file.size > props.openPartUploadSize * 1024 ** 2) {
    obs.startPartUpload(file)
  } else {
    obs.startUpload(file);
  }
}

// 上传成功
const onSuccess = (file: UploadRawFile, url?: string) => {
  fileList.value = fileList.value.map((f, i) => {
    if (f.uid === file.uid) {
      f.percentage = 100;
      f.status = "success";
      f.url = isLocalUpload.value ? url : f.url || `${f.obsHost}/${f.key}`;
      f.key = url ? url : f.key
    }
    return f;
  });
  getProgressFile()
  getFile()
}

// 上传中
const onProgress = (file: UploadRawFile, percent: number) => {
  fileList.value = fileList.value.map((f) => {
    if (f.uid === file.uid) {
      f.percentage = percent;
      f.status = "uploading";
    }
    return f;
  });
  getProgressFile()
}

// 上传失败处理
const onFail = (file: UploadRawFile, errMessage: string) => {
  fileList.value = fileList.value.map((f) => {
    if (f.uid === file.uid) {
      f.status = "fail"
    }
    return f
  })
  getProgressFile()
  removeFile(file)
  errMessage && ElMessage.error(errMessage)
}

const getProgressFile = () => {
  const files = props.multiple ? fileList.value : fileList.value[0]
  emit('getProgress', files)
}

// 获取上传的文件
const getFile = () => {
  const file = props.multiple ? fileList.value : fileList.value[0]
  emit('update:modelValue', file)
  emit('change', file)
}

// 手动上传
const handleUpload = () => {
  uploadRef.value!.submit()
}

// 清除文件
const clearFiles = () => {
  fileList.value = []
}

defineExpose({ uploadRef, removeFile, handleUpload, clearFiles })
</script>

<style lang="scss" scoped>
.my-upload{
  :deep(.el-upload-dragger) {
    .file-items {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      transition: all .3s;
    }
    .text {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2px;
      color: #667085;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      em {
        color: var(--el-color-primary);
        font-style: normal;
      }
    }
  }
  .el-upload__text {
    color: #667085;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    em{
      margin-left: 4px;
    }
  }
  .el-upload__tip {
    color: var(--el-text-color-regular);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
  }
  .preview-img {
    width: 100%;
    min-height: 174px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
  }
}
</style>
