<template>
  <SidebarInset>
    <div class="flex flex-1 flex-col gap-6 p-8 bg-card">
      <!-- 欢迎信息 -->
      <div class="space-y-2">
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-bold tracking-tight">
            {{ greeting }}，{{ username }}
          </h1>
          <span
            v-if="isAdmin"
            class="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white"
          >
            管理员
          </span>
        </div>
        <p class="text-lg text-muted-foreground">
          现在是{{ formattedTime }}，今天还有什么事没有完成呢？
        </p>
      </div>

      <!-- 内容区域 -->
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[180px]">
        <div class="rounded-xl bg-muted/50" />
        <div class="rounded-xl bg-muted/50" />
        <div class="rounded-xl bg-muted/50" />
        <!-- 可添加更多内容块 -->
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </SidebarInset>
</template>

<script setup lang="ts">
import { SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo?.username || '用户')
const isAdmin = computed(() => userStore.userInfo?.is_admin)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

const formattedTime = computed(() => {
  const now = new Date()
  return now.toLocaleString('zh-CN', { hour12: false })
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
.dashboard-content {
  flex: 1;
  padding: 24px;
  background: #f8f9fa;
}
</style> 