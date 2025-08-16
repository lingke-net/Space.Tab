<template>
  <div class="watermark" :class="fillClass">
    <h2>Space Tab</h2>
    <h4>测试版本，不代表最终品质</h4>
    <h4 v-if="isLoggedIn && user">USER·{{ user.username }}·<span v-if="user.email">{{ user.email }}</span></h4>
    <h4>测试版本: V.{{ versionNumber }}</h4>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
const props = defineProps<{
  version: string,
  fillMode?: 'auto' | 'light' | 'dark',
  isLoggedIn?: boolean,
  user?: { username?: string, email?: string }
}>()
const fillClass = computed(() => {
  if (props.fillMode === 'light') return 'watermark-light'
  if (props.fillMode === 'dark') return 'watermark-dark'
  return 'watermark-auto'
})

// 获取环境变量中的版本号
const versionNumber = import.meta.env.VITE_VERSON
</script>

<style scoped>
.watermark {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 9999;
  text-align: right;
  pointer-events: none;
  user-select: none;
  padding: 12px 24px;
  border-radius: 12px;
  transition: background 0.2s, color 0.2s;
}
.watermark-auto {
  background: none;
  color: rgba(255,255,255,0.18);
  mix-blend-mode: difference;
}
.watermark-light {
  background: #fff;
  color: #222;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
}
.watermark-dark {
  background: #111;
  color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
}
.watermark h2 {
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
}
.watermark h4 {
  font-size: 1rem;
  margin: 0;
  font-weight: normal;
}
</style> 