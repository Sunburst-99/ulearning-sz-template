<template>
  <div class="resource-content">
    <!-- 视频 -->
    <div class="video-wrapper" v-if="resource?.fileType === FILE_TYPE_NAME.VIDEO">
      <video
        id="media"
        controls
        playsinline
        webkit-playsinline
        controlsList="nodownload"
        :src="fileUrl"
      />
    </div>
    <!-- 音频 -->
    <div class="audio-wrapper" v-if="resource?.fileType === FILE_TYPE_NAME.AUDIO">
      <audio
        :id="'media'"
        :src="fileUrl"
        controls
      />
    </div>
    <!-- 文档 -->
    <div class="document-block" v-if="resource?.fileType === FILE_TYPE_NAME.DOCUMENT">
      <iframe :src="fileUrl" :title="resource.name"></iframe>
    </div>
    <!-- 图片 -->
    <div class="image-block" v-if="resource?.fileType === FILE_TYPE_NAME.IMAGE">
      <div 
        class="image-wrapper"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @lostpointercapture="handlePointerUp"
        @wheel="handleWheel"
      >
        <img
          class="img"
          id="image-viewer"
          :src="fileUrl"
          :alt="resource?.name"
          :style="imageStyle"
          draggable="false"
        />
      </div>
      <div class="icons-block">
        <div class="icons">
          <button type="button" class="image-tool" aria-label="向左旋转" @click="left"><el-icon><RefreshLeft /></el-icon></button>
          <button type="button" class="image-tool" aria-label="向右旋转" @click="right"><el-icon><RefreshRight /></el-icon></button>
          <button type="button" class="image-tool" aria-label="放大" @click="zoomIn"><el-icon><CirclePlus /></el-icon></button>
          <button type="button" class="image-tool" aria-label="缩小" @click="zoomOut"><el-icon><Remove /></el-icon></button>
          <button type="button" class="image-tool" aria-label="重置图片" @click="resetImage"><el-icon><Refresh /></el-icon></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed,watch } from 'vue'
  import { RefreshLeft, RefreshRight, CirclePlus, Remove, Refresh } from '@element-plus/icons-vue'
  import { FILE_TYPE_NAME } from '@/ts/enums'

  interface Props {
    fileUrl: string
    resource: {
      fileType: FILE_TYPE_NAME
      name: string
    }
  }

  const props = defineProps<Props>()
  watch(() => props.fileUrl, () => {
    resetImage()
  })

  const deg = ref(0) //旋转角度
  const zoom = ref(1) //放大缩小倍数
  const x = ref(0) //水平位置
  const y = ref(0) //垂直位置
  const isDragging = ref(false) //是否正在拖拽
  const startPos = ref({ x: 0, y: 0 }) //拖拽起始位置

  // 计算图片样式
  const imageStyle = computed(() => {
    return {
      transform: `translate(${x.value}px, ${y.value}px) rotate(${deg.value}deg) scale(${zoom.value})`,
      transition: isDragging.value ? 'none' : 'transform 0.1s ease',
    }
  })

  // 向左旋转
  const left = () => {
    deg.value -= 90;
  }

  // 向右旋转
  const right = () => {
    deg.value += 90;
  }

  // 放大
  const zoomIn = () => {
    zoom.value = Math.min(10, Number((zoom.value + 0.2).toFixed(1)));
  }

  // 缩小
  const zoomOut = () => {
    zoom.value = Number((zoom.value - 0.2).toFixed(1));
    if (Number(zoom.value) <= 0.0) {
      zoom.value = 0.2;
    }
  }

  // 重置图片
  const resetImage = () => {
    deg.value = 0;
    zoom.value = 1;
    x.value = 0;
    y.value = 0;
    isDragging.value = false;
  }

  // Pointer 事件同时支持鼠标和手指拖动，捕获后移出图片也能正常结束拖动。
  const handlePointerDown = (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.value = true;
    startPos.value = {
      x: e.clientX - x.value,
      y: e.clientY - y.value
    };
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!e.isPrimary) return
    e.preventDefault(); // 阻止默认行为
    if (isDragging.value) {
      x.value = e.clientX - startPos.value.x;
      y.value = e.clientY - startPos.value.y;
    }
  }

  const handlePointerUp = () => {
    isDragging.value = false;
  }

  // 处理鼠标滚轮
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault(); // 阻止默认滚轮行为
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Number((zoom.value + delta).toFixed(1));
    
    // 限制缩放范围
    if (newZoom >= 0.1 && newZoom <= 10) {
      // 计算鼠标位置相对于图片的中心点
      const rect = e.currentTarget;
      if (!(rect instanceof HTMLElement)) return
      const rectWidth = rect.clientWidth;
      const rectHeight = rect.clientHeight;
      const mouseX = e.clientX - rect.getBoundingClientRect().left;
      const mouseY = e.clientY - rect.getBoundingClientRect().top;
      
      // 计算鼠标相对于图片中心点的偏移
      const mouseOffsetX = mouseX - rectWidth / 2;
      const mouseOffsetY = mouseY - rectHeight / 2;
      
      // 应用缩放
      const ratio = newZoom / zoom.value
      zoom.value = newZoom;
      
      // 调整位置，使鼠标指向的位置保持不变
      x.value = mouseOffsetX - (mouseOffsetX - x.value) * ratio;
      y.value = mouseOffsetY - (mouseOffsetY - y.value) * ratio;
    }
  }
</script>
