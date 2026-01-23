<template>
  <el-tooltip :disabled="!showTooltip" :show-after="1000">
    <template #content>
      <div class="tooltip" v-html="tooltipHtml"></div>
    </template>
    <div class="text-block">
      <div class="tag" ref="tagRef"><slot name="tag" /></div>
      <div
        class="text"
        :class="lineClamp > 1 ? `multiline` : `ellipsis`"
        ref="textRef"
        v-html="content"
      ></div>
    </div>
  </el-tooltip>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

interface Props {
  content?: string
  lineClamp?: number
}
const props = withDefaults(defineProps<Props>(),{
  content: '',
  lineClamp: 1,
  className: ''
})

const tagRef = ref<HTMLElement | null>();
const textRef = ref<HTMLElement | null>();
const showTooltip = ref(false)
const tagWidth = ref('0px')

const tooltipHtml = computed(() => {
  if (props.content) {
    let re1 = new RegExp("<.+?>|&.+?;", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
    let msg = props.content.replace(re1, ""); //执行替换成空字符
    msg = msg.replace(/\s/g, ""); //去掉所有的空格（中文空格、英文空格都会被替换）
    msg = msg.replace(/[\r\n]/g, ""); //去掉所有的换行符
    return msg;
  } else return "";
})

// 判断内容是否超出div的宽度
const init = () => {
  if (textRef.value) {
    const clientW = textRef.value.clientWidth;
    const clientH = textRef.value.clientHeight;
    const scrollW = textRef.value.scrollWidth;
    const scrollH = textRef.value.scrollHeight;
    showTooltip.value = scrollW > clientW || scrollH > clientH;
    const tagW = tagRef.value?.clientWidth || 0
    tagWidth.value = tagW + 'px'
  }
}

onMounted(init)
</script>
<style lang="scss" scoped>
.tooltip {
  max-width: 240px;
}
.text-block {
  position: relative;
  .tag {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.text {
  text-indent: v-bind('tagWidth');
}
.multiline {
  display: -webkit-box;
  -webkit-line-clamp: v-bind('props.lineClamp');
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
