<script setup lang="ts">
  import { computed } from 'vue'
  import logo from "@images/logo.png";

  interface Props {
    src?: string
    height?: number
  }
  const props = withDefaults(defineProps<Props>(), {
    height: 30
  })

  const logoUrl = computed(() => {
    if (props.src) return props.src
    return logo
  })
</script>

<template>
  <img class="logo" :src="logoUrl" :height="height" draggable="false" />
</template>