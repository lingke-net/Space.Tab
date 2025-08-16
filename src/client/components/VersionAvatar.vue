<script setup lang="ts">
import { computed } from 'vue'

// 定义props
const props = defineProps({
  mode: {
    type: String,
    default: 'none' // 默认不显示
  },
  size: {
    type: String,
    default: 'small' // small, medium, large
  }
})

// 根据模式计算显示内容和样式
const avatarText = computed(() => {
  switch (props.mode) {
    case 'beta':
      return 'BETA'
    case 'production':
      return 'VERSION'
    case 'coomingsoon':
      return 'COOMING SOON'
    default:
      return ''
  }
})

// 根据大小计算样式类
const sizeClass = computed(() => {
  switch (props.size) {
    case 'large':
      return 'version-avatar-large'
    case 'medium':
      return 'version-avatar-medium'
    default:
      return 'version-avatar-small'
  }
})

// 根据模式计算颜色类
const colorClass = computed(() => {
  switch (props.mode) {
    case 'beta':
      return 'version-avatar-beta'
    case 'production':
      return 'version-avatar-production'
    case 'coomingsoon':
      return 'version-avatar-coomingsoon'
    default:
      return 'version-avatar-none'
  }
})

// 是否显示
const shouldShow = computed(() => props.mode !== 'none')
</script>

<template>
  <span v-if="shouldShow" class="version-avatar" :class="[sizeClass, colorClass]">
    {{ avatarText }}
  </span>
</template>

<style scoped>
.version-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  font-weight: bold;
  margin-right: 0.5rem;
  padding: 0 0.5rem;
  font-size: 0.65rem;
}

.version-avatar-small {
  height: 1.2rem;
  min-width: 2.5rem;
}

.version-avatar-medium {
  height: 1.5rem;
  min-width: 3rem;
  font-size: 0.75rem;
}

.version-avatar-large {
  height: 1.8rem;
  min-width: 3.5rem;
  font-size: 0.85rem;
}

.version-avatar-beta {
  background-color: #84cc16; /* 黄绿色 */
  color: white;
}

.version-avatar-production {
  background-color: #3b82f6; /* 蓝色 */
  color: white;
}

.version-avatar-coomingsoon {
  background-color: #cc7116; /* 黄绿色 */
  color: white;
}

.version-avatar-none {
  display: none;
}
</style>
