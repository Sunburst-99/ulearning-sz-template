<template>
  <div class="resource-content">
    <!-- 视频 -->
    <div class="video-block" v-if="resource?.fileType === FILE_TYPE_NAME.VIDEO">
      <div class="video-wrapper">
        <video
          class="custom-video"
          id="media"
          controls
          playsinline
          webkit-playsinline
          controlsList="nodownload"
          :src="fileUrl"
        ></video>
      </div>
    </div>
    <!-- 音频 -->
    <div class="audio-block" v-if="resource?.fileType === FILE_TYPE_NAME.AUDIO">
      <div class="audio-wrapper">
        <audio
          class="custom-audio"
          :id="'media'"
          :src="fileUrl"
          controls
        ></audio>
      </div>
    </div>
    <!-- 文档 -->
    <div class="document-block" v-if="resource?.fileType === FILE_TYPE_NAME.DOCUMENT">
      <iframe :src="fileUrl"></iframe>
    </div>
    <!-- 图片 -->
    <div class="image-block" v-if="resource?.fileType === FILE_TYPE_NAME.IMAGE">
      <div 
        class="image-wrapper"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @wheel="handleWheel"
      >
        <img
          class="img"
          id="image-viewer"
          :src="fileUrl"
          :alt="resource?.name"
          :style="imageStyle"
        />
      </div>
      <div class="icons-block">
        <div class="icons">
          <el-icon @click="left"><RefreshLeft /></el-icon>
          <el-icon @click="right"><RefreshRight /></el-icon>
          <el-icon @click="zoomIn"><CirclePlus /></el-icon>
          <el-icon @click="zoomOut"><Remove /></el-icon>
          <el-icon @click="resetImage"><Refresh /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed,watch } from 'vue'
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
    zoom.value += 0.2;
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
  }

  // 处理鼠标按下
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDragging.value = true;
    startPos.value = {
      x: e.clientX - x.value,
      y: e.clientY - y.value
    };
  }

  // 处理鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault(); // 阻止默认行为
    if (isDragging.value) {
      x.value = e.clientX - startPos.value.x;
      y.value = e.clientY - startPos.value.y;
    }
  }

  // 处理鼠标松开
  const handleMouseUp = () => {
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
      const rect = e.currentTarget as HTMLElement;
      const rectWidth = rect.clientWidth;
      const rectHeight = rect.clientHeight;
      const mouseX = e.clientX - rect.getBoundingClientRect().left;
      const mouseY = e.clientY - rect.getBoundingClientRect().top;
      
      // 计算鼠标相对于图片中心点的偏移
      const mouseOffsetX = mouseX - rectWidth / 2;
      const mouseOffsetY = mouseY - rectHeight / 2;
      
      // 应用缩放
      zoom.value = newZoom;
      
      // 调整位置，使鼠标指向的位置保持不变
      x.value += mouseOffsetX * (delta / zoom.value);
      y.value += mouseOffsetY * (delta / zoom.value);
    }
  }
</script>

<style lang="scss" scoped>
  @import url('./index.scss');
  
  .image-wrapper {
    touch-action: none; // 防止触摸设备上的默认行为
  }
  
  .img {
    user-select: none; // 防止图片被选中
    max-width: none; // 允许图片完全显示，不限制在容器宽度内
  }
</style>